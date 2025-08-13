package service

import (
    "context"
    "testing"
    "time"

    "github.com/shopspring/decimal"
    "github.com/stretchr/testify/require"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"

    "github.com/example/transactions-api/internal/models"
    "github.com/example/transactions-api/internal/repository"
)

func newTestDB(t *testing.T) *gorm.DB {
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    require.NoError(t, err)
    require.NoError(t, db.AutoMigrate(&models.Transaction{}))
    return db
}

func TestService_CRUD_And_Dashboard(t *testing.T) {
    db := newTestDB(t)
    repo := repository.NewTransactionRepository(db)
    svc := NewTransactionService(repo)

    ctx := context.Background()

    tx1, err := svc.Create(ctx, 1, decimal.RequireFromString("100.00"), models.TransactionStatusSuccess)
    require.NoError(t, err)
    tx2, err := svc.Create(ctx, 1, decimal.RequireFromString("50.50"), models.TransactionStatusPending)
    require.NoError(t, err)
    tx3, err := svc.Create(ctx, 2, decimal.RequireFromString("10.00"), models.TransactionStatusFailed)
    require.NoError(t, err)

    _, err = svc.GetByID(ctx, tx1.ID)
    require.NoError(t, err)

    list, total, err := svc.List(ctx, repository.TransactionFilter{UserID: &tx1.UserID})
    require.NoError(t, err)
    require.Equal(t, int64(2), total)
    require.Len(t, list, 2)

    require.NoError(t, svc.UpdateStatus(ctx, tx2.ID, models.TransactionStatusSuccess))

    summary, err := svc.DashboardSummary(ctx, time.Now())
    require.NoError(t, err)
    require.Equal(t, decimal.RequireFromString("150.50"), summary.TotalSuccessToday)
    require.Equal(t, decimal.RequireFromString("80.25"), summary.AverageAmountPerUser)
    require.NotEmpty(t, summary.LatestTransactions)

    require.NoError(t, svc.Delete(ctx, tx3.ID))
}