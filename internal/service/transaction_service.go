package service

import (
    "context"
    "errors"
    "strings"
    "time"

    "github.com/example/transactions-api/internal/models"
    "github.com/example/transactions-api/internal/repository"
    "github.com/shopspring/decimal"
)

type TransactionService interface {
    Create(ctx context.Context, userID uint64, amount decimal.Decimal, status string) (*models.Transaction, error)
    GetByID(ctx context.Context, id uint64) (*models.Transaction, error)
    UpdateStatus(ctx context.Context, id uint64, status string) error
    Delete(ctx context.Context, id uint64) error

    List(ctx context.Context, filter repository.TransactionFilter) ([]models.Transaction, int64, error)
    DashboardSummary(ctx context.Context, now time.Time) (DashboardSummary, error)
}

type transactionService struct {
    repo repository.TransactionRepository
}

type DashboardSummary struct {
    TotalSuccessToday       decimal.Decimal   `json:"total_success_today"`
    AverageAmountPerUser    decimal.Decimal   `json:"average_amount_per_user"`
    LatestTransactions      []models.Transaction `json:"latest_transactions"`
}

func NewTransactionService(repo repository.TransactionRepository) TransactionService {
    return &transactionService{repo: repo}
}

func (s *transactionService) Create(ctx context.Context, userID uint64, amount decimal.Decimal, status string) (*models.Transaction, error) {
    if userID == 0 {
        return nil, errors.New("user_id is required")
    }
    if amount.LessThanOrEqual(decimal.Zero) {
        return nil, errors.New("amount must be greater than 0")
    }
    status = strings.ToLower(status)
    if !isValidStatus(status) {
        return nil, errors.New("invalid status")
    }

    tx := &models.Transaction{
        UserID: userID,
        Amount: amount,
        Status: status,
    }
    if err := s.repo.Create(ctx, tx); err != nil {
        return nil, err
    }
    return tx, nil
}

func (s *transactionService) GetByID(ctx context.Context, id uint64) (*models.Transaction, error) {
    return s.repo.FindByID(ctx, id)
}

func (s *transactionService) UpdateStatus(ctx context.Context, id uint64, status string) error {
    status = strings.ToLower(status)
    if !isValidStatus(status) {
        return errors.New("invalid status")
    }
    return s.repo.UpdateStatus(ctx, id, status)
}

func (s *transactionService) Delete(ctx context.Context, id uint64) error {
    return s.repo.Delete(ctx, id)
}

func (s *transactionService) List(ctx context.Context, filter repository.TransactionFilter) ([]models.Transaction, int64, error) {
    return s.repo.List(ctx, filter)
}

func (s *transactionService) DashboardSummary(ctx context.Context, now time.Time) (DashboardSummary, error) {
    total, err := s.repo.TotalSuccessToday(ctx, now)
    if err != nil {
        return DashboardSummary{}, err
    }
    avg, err := s.repo.AverageAmountPerUser(ctx)
    if err != nil {
        return DashboardSummary{}, err
    }
    latest, err := s.repo.LatestTransactions(ctx, 10)
    if err != nil {
        return DashboardSummary{}, err
    }
    return DashboardSummary{
        TotalSuccessToday:    total,
        AverageAmountPerUser: avg,
        LatestTransactions:   latest,
    }, nil
}

func isValidStatus(s string) bool {
    switch s {
    case models.TransactionStatusSuccess, models.TransactionStatusPending, models.TransactionStatusFailed:
        return true
    default:
        return false
    }
}