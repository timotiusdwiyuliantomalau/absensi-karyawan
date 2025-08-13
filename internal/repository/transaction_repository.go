package repository

import (
	"time"

	"transaction-backend/internal/model"
	"transaction-backend/pkg/database"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	Create(transaction *model.Transaction) error
	GetByID(id uint) (*model.Transaction, error)
	GetAll(filter *model.TransactionFilter) ([]model.Transaction, *model.Meta, error)
	Update(transaction *model.Transaction) error
	Delete(id uint) error
	GetTotalSuccessToday() (int64, error)
	GetTotalTransactions() (int64, error)
	GetAverageAmountPerUser() (float64, error)
	GetRecentTransactions(limit int) ([]model.Transaction, error)
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository() TransactionRepository {
	return &transactionRepository{
		db: database.GetDB(),
	}
}

func (r *transactionRepository) Create(transaction *model.Transaction) error {
	return r.db.Create(transaction).Error
}

func (r *transactionRepository) GetByID(id uint) (*model.Transaction, error) {
	var transaction model.Transaction
	err := r.db.First(&transaction, id).Error
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func (r *transactionRepository) GetAll(filter *model.TransactionFilter) ([]model.Transaction, *model.Meta, error) {
	var transactions []model.Transaction
	var total int64

	query := r.db.Model(&model.Transaction{})

	// Apply filters
	if filter.UserID > 0 {
		query = query.Where("user_id = ?", filter.UserID)
	}
	if filter.Status != "" {
		query = query.Where("status = ?", filter.Status)
	}

	// Count total records
	if err := query.Count(&total).Error; err != nil {
		return nil, nil, err
	}

	// Calculate pagination
	offset := (filter.Page - 1) * filter.Limit
	totalPages := int((total + int64(filter.Limit) - 1) / int64(filter.Limit))

	// Get paginated results
	err := query.Offset(offset).Limit(filter.Limit).Order("created_at DESC").Find(&transactions).Error
	if err != nil {
		return nil, nil, err
	}

	meta := &model.Meta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		Total:      int(total),
		TotalPages: totalPages,
	}

	return transactions, meta, nil
}

func (r *transactionRepository) Update(transaction *model.Transaction) error {
	return r.db.Save(transaction).Error
}

func (r *transactionRepository) Delete(id uint) error {
	return r.db.Delete(&model.Transaction{}, id).Error
}

func (r *transactionRepository) GetTotalSuccessToday() (int64, error) {
	var total int64
	today := time.Now().Truncate(24 * time.Hour)
	
	err := r.db.Model(&model.Transaction{}).
		Where("status = ? AND created_at >= ?", "success", today).
		Count(&total).Error
	
	return total, err
}

func (r *transactionRepository) GetTotalTransactions() (int64, error) {
	var total int64
	err := r.db.Model(&model.Transaction{}).Count(&total).Error
	return total, err
}

func (r *transactionRepository) GetAverageAmountPerUser() (float64, error) {
	var result struct {
		AverageAmount float64
	}
	
	err := r.db.Raw(`
		SELECT AVG(total_amount) as average_amount 
		FROM (
			SELECT user_id, SUM(amount) as total_amount 
			FROM transactions 
			GROUP BY user_id
		) as user_totals
	`).Scan(&result).Error
	
	return result.AverageAmount, err
}

func (r *transactionRepository) GetRecentTransactions(limit int) ([]model.Transaction, error) {
	var transactions []model.Transaction
	
	err := r.db.Order("created_at DESC").
		Limit(limit).
		Find(&transactions).Error
	
	return transactions, err
}