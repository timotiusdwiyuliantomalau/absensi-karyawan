package tests

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
    "github.com/example/transactions-api/internal/service"
)

func newTestDB(t *testing.T) *gorm.DB {
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    require.NoError(t, err)
    require.NoError(t, db.AutoMigrate(&models.Transaction{}))
    return db
}

func TestTransactionService_CRUD_And_Dashboard(t *testing.T) {
    db := newTestDB(t)
    repo := repository.NewTransactionRepository(db)
    svc := service.NewTransactionService(repo)

    ctx := context.Background()

    // Create
    tx1, err := svc.Create(ctx, 1, decimal.RequireFromString("100.00"), models.TransactionStatusSuccess)
    require.NoError(t, err)
    require.NotZero(t, tx1.ID)

    tx2, err := svc.Create(ctx, 1, decimal.RequireFromString("50.50"), models.TransactionStatusPending)
    require.NoError(t, err)

    tx3, err := svc.Create(ctx, 2, decimal.RequireFromString("10.00"), models.TransactionStatusFailed)
    require.NoError(t, err)

    // GetByID
    got, err := svc.GetByID(ctx, tx1.ID)
    require.NoError(t, err)
    require.Equal(t, tx1.ID, got.ID)

    // List filter by user
    list, total, err := svc.List(ctx, repository.TransactionFilter{UserID: &tx1.UserID})
    require.NoError(t, err)
    require.Equal(t, int64(2), total)
    require.Len(t, list, 2)

    // Update status
    err = svc.UpdateStatus(ctx, tx2.ID, models.TransactionStatusSuccess)
    require.NoError(t, err)
    got2, err := svc.GetByID(ctx, tx2.ID)
    require.NoError(t, err)
    require.Equal(t, models.TransactionStatusSuccess, got2.Status)

    // Dashboard summary
    summary, err := svc.DashboardSummary(ctx, time.Now())
    require.NoError(t, err)
    // total success today should be tx1 + tx2
    require.Equal(t, decimal.RequireFromString("150.50"), summary.TotalSuccessToday)
    // average amount per user = (100 + 50.50 + 10) / 2 = 80.25
    require.Equal(t, decimal.RequireFromString("80.25"), summary.AverageAmountPerUser)
    require.NotEmpty(t, summary.LatestTransactions)

    // Delete
    require.NoError(t, svc.Delete(ctx, tx3.ID))
}