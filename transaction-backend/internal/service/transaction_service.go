package service

import (
	"errors"
	"fmt"

	"transaction-backend/internal/model"
	"transaction-backend/internal/repository"
	"transaction-backend/pkg/logger"
)

type TransactionService interface {
	CreateTransaction(req *model.CreateTransactionRequest) (*model.Transaction, error)
	GetTransactionByID(id uint) (*model.Transaction, error)
	GetAllTransactions(filter *model.TransactionFilter) ([]model.Transaction, *model.Meta, error)
	UpdateTransactionStatus(id uint, req *model.UpdateTransactionRequest) (*model.Transaction, error)
	DeleteTransaction(id uint) error
	GetDashboardSummary() (*model.DashboardSummary, error)
}

type transactionService struct {
	repo repository.TransactionRepository
}

func NewTransactionService(repo repository.TransactionRepository) TransactionService {
	return &transactionService{
		repo: repo,
	}
}

func (s *transactionService) CreateTransaction(req *model.CreateTransactionRequest) (*model.Transaction, error) {
	// Validate amount
	if req.Amount <= 0 {
		return nil, errors.New("amount must be greater than 0")
	}

	// Validate user ID
	if req.UserID <= 0 {
		return nil, errors.New("user ID must be greater than 0")
	}

	transaction := &model.Transaction{
		UserID: req.UserID,
		Amount: req.Amount,
		Status: "pending",
	}

	if err := s.repo.Create(transaction); err != nil {
		logger.Error("Failed to create transaction", err, map[string]interface{}{
			"user_id": req.UserID,
			"amount":  req.Amount,
		})
		return nil, fmt.Errorf("failed to create transaction: %w", err)
	}

	logger.Info("Transaction created successfully", map[string]interface{}{
		"transaction_id": transaction.ID,
		"user_id":        transaction.UserID,
		"amount":         transaction.Amount,
	})

	return transaction, nil
}

func (s *transactionService) GetTransactionByID(id uint) (*model.Transaction, error) {
	if id <= 0 {
		return nil, errors.New("invalid transaction ID")
	}

	transaction, err := s.repo.GetByID(id)
	if err != nil {
		logger.Error("Failed to get transaction by ID", err, map[string]interface{}{
			"transaction_id": id,
		})
		return nil, fmt.Errorf("transaction not found: %w", err)
	}

	return transaction, nil
}

func (s *transactionService) GetAllTransactions(filter *model.TransactionFilter) ([]model.Transaction, *model.Meta, error) {
	// Validate pagination
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 || filter.Limit > 100 {
		filter.Limit = 10
	}

	transactions, meta, err := s.repo.GetAll(filter)
	if err != nil {
		logger.Error("Failed to get all transactions", err, map[string]interface{}{
			"filter": filter,
		})
		return nil, nil, fmt.Errorf("failed to get transactions: %w", err)
	}

	return transactions, meta, nil
}

func (s *transactionService) UpdateTransactionStatus(id uint, req *model.UpdateTransactionRequest) (*model.Transaction, error) {
	if id <= 0 {
		return nil, errors.New("invalid transaction ID")
	}

	// Get existing transaction
	transaction, err := s.repo.GetByID(id)
	if err != nil {
		logger.Error("Failed to get transaction for update", err, map[string]interface{}{
			"transaction_id": id,
		})
		return nil, fmt.Errorf("transaction not found: %w", err)
	}

	// Update status
	transaction.Status = req.Status

	if err := s.repo.Update(transaction); err != nil {
		logger.Error("Failed to update transaction status", err, map[string]interface{}{
			"transaction_id": id,
			"new_status":     req.Status,
		})
		return nil, fmt.Errorf("failed to update transaction: %w", err)
	}
	
	logger.Info("Transaction status updated successfully", map[string]interface{}{
		"transaction_id": transaction.ID,
		"old_status":     transaction.Status,
		"new_status":     req.Status,
	})

	return transaction, nil
}

func (s *transactionService) DeleteTransaction(id uint) error {
	if id <= 0 {
		return errors.New("invalid transaction ID")
	}

	// Check if transaction exists
	_, err := s.repo.GetByID(id)
	if err != nil {
		logger.Error("Failed to get transaction for deletion", err, map[string]interface{}{
			"transaction_id": id,
		})
		return fmt.Errorf("transaction not found: %w", err)
	}

	if err := s.repo.Delete(id); err != nil {
		logger.Error("Failed to delete transaction", err, map[string]interface{}{
			"transaction_id": id,
		})
		return fmt.Errorf("failed to delete transaction: %w", err)
	}

	logger.Info("Transaction deleted successfully", map[string]interface{}{
		"transaction_id": id,
	})

	return nil
}

func (s *transactionService) GetDashboardSummary() (*model.DashboardSummary, error) {
	summary := &model.DashboardSummary{}

	// Get total success today
	totalSuccessToday, err := s.repo.GetTotalSuccessToday()
	if err != nil {
		logger.Error("Failed to get total success today", err, nil)
		return nil, fmt.Errorf("failed to get dashboard data: %w", err)
	}
	summary.TotalSuccessToday = totalSuccessToday

	// Get total transactions
	totalTransactions, err := s.repo.GetTotalTransactions()
	if err != nil {
		logger.Error("Failed to get total transactions", err, nil)
		return nil, fmt.Errorf("failed to get dashboard data: %w", err)
	}
	summary.TotalTransactions = totalTransactions

	// Get average amount per user
	averageAmount, err := s.repo.GetAverageAmountPerUser()
	if err != nil {
		logger.Error("Failed to get average amount per user", err, nil)
		return nil, fmt.Errorf("failed to get dashboard data: %w", err)
	}
	summary.AverageAmountPerUser = averageAmount

	// Get recent transactions
	recentTransactions, err := s.repo.GetRecentTransactions(10)
	if err != nil {
		logger.Error("Failed to get recent transactions", err, nil)
		return nil, fmt.Errorf("failed to get dashboard data: %w", err)
	}
	summary.RecentTransactions = recentTransactions

	logger.Info("Dashboard summary generated successfully", map[string]interface{}{
		"total_success_today": totalSuccessToday,
		"total_transactions":  totalTransactions,
	})

	return summary, nil
}
