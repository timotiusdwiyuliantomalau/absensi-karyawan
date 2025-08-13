package repository

import (
    "context"
    "time"

    "github.com/example/transactions-api/internal/models"
    "github.com/shopspring/decimal"
    "gorm.io/gorm"
)

type TransactionFilter struct {
    UserID   *uint64
    Status   *string
    Sort     string // e.g., "created_at desc"
    Limit    int
    Offset   int
}

type TransactionRepository interface {
    Create(ctx context.Context, t *models.Transaction) error
    FindByID(ctx context.Context, id uint64) (*models.Transaction, error)
    UpdateStatus(ctx context.Context, id uint64, status string) error
    Delete(ctx context.Context, id uint64) error

    List(ctx context.Context, filter TransactionFilter) ([]models.Transaction, int64, error)

    TotalSuccessToday(ctx context.Context, now time.Time) (decimal.Decimal, error)
    AverageAmountPerUser(ctx context.Context) (decimal.Decimal, error)
    LatestTransactions(ctx context.Context, limit int) ([]models.Transaction, error)
}

type transactionRepository struct {
    db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) TransactionRepository {
    return &transactionRepository{db: db}
}

func (r *transactionRepository) Create(ctx context.Context, t *models.Transaction) error {
    return r.db.WithContext(ctx).Create(t).Error
}

func (r *transactionRepository) FindByID(ctx context.Context, id uint64) (*models.Transaction, error) {
    var tx models.Transaction
    if err := r.db.WithContext(ctx).First(&tx, id).Error; err != nil {
        return nil, err
    }
    return &tx, nil
}

func (r *transactionRepository) UpdateStatus(ctx context.Context, id uint64, status string) error {
    res := r.db.WithContext(ctx).Model(&models.Transaction{}).Where("id = ?", id).Update("status", status)
    if res.Error != nil {
        return res.Error
    }
    if res.RowsAffected == 0 {
        return gorm.ErrRecordNotFound
    }
    return nil
}

func (r *transactionRepository) Delete(ctx context.Context, id uint64) error {
    res := r.db.WithContext(ctx).Unscoped().Where("id = ?", id).Delete(&models.Transaction{})
    if res.Error != nil {
        return res.Error
    }
    if res.RowsAffected == 0 {
        return gorm.ErrRecordNotFound
    }
    return nil
}

func (r *transactionRepository) List(ctx context.Context, filter TransactionFilter) ([]models.Transaction, int64, error) {
    q := r.db.WithContext(ctx).Model(&models.Transaction{})

    if filter.UserID != nil {
        q = q.Where("user_id = ?", *filter.UserID)
    }
    if filter.Status != nil {
        q = q.Where("status = ?", *filter.Status)
    }

    var total int64
    if err := q.Count(&total).Error; err != nil {
        return nil, 0, err
    }

    if filter.Sort == "" {
        filter.Sort = "created_at desc"
    }
    q = q.Order(filter.Sort)

    if filter.Limit > 0 {
        q = q.Limit(filter.Limit)
    }
    if filter.Offset >= 0 {
        q = q.Offset(filter.Offset)
    }

    var out []models.Transaction
    if err := q.Find(&out).Error; err != nil {
        return nil, 0, err
    }
    return out, total, nil
}

func (r *transactionRepository) TotalSuccessToday(ctx context.Context, now time.Time) (decimal.Decimal, error) {
    // Sum amounts for today with status=success
    startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

    var sumStr string
    if err := r.db.WithContext(ctx).Model(&models.Transaction{}).
        Select("COALESCE(SUM(amount), 0)").
        Where("status = ? AND created_at >= ?", models.TransactionStatusSuccess, startOfDay).
        Row().Scan(&sumStr); err != nil {
        return decimal.Zero, err
    }
    if sumStr == "" {
        return decimal.Zero, nil
    }
    d, err := decimal.NewFromString(sumStr)
    if err != nil {
        return decimal.Zero, err
    }
    return d.Round(2), nil
}

func (r *transactionRepository) AverageAmountPerUser(ctx context.Context) (decimal.Decimal, error) {
    // total amount / distinct users
    var totalStr string
    if err := r.db.WithContext(ctx).Model(&models.Transaction{}).Select("COALESCE(SUM(amount),0)").Row().Scan(&totalStr); err != nil {
        return decimal.Zero, err
    }
    total, err := decimal.NewFromString(totalStr)
    if err != nil {
        return decimal.Zero, err
    }

    var distinctUsers int64
    if err := r.db.WithContext(ctx).Model(&models.Transaction{}).Distinct("user_id").Count(&distinctUsers).Error; err != nil {
        return decimal.Zero, err
    }
    if distinctUsers == 0 {
        return decimal.Zero, nil
    }
    return total.Div(decimal.NewFromInt(distinctUsers)).Round(2), nil
}

func (r *transactionRepository) LatestTransactions(ctx context.Context, limit int) ([]models.Transaction, error) {
    if limit <= 0 {
        limit = 10
    }
    var out []models.Transaction
    if err := r.db.WithContext(ctx).Model(&models.Transaction{}).Order("created_at desc").Limit(limit).Find(&out).Error; err != nil {
        return nil, err
    }
    return out, nil
}