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
)

func TestTransactionRepository_Filters_Pagination_Aggregates(t *testing.T) {
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    require.NoError(t, err)
    require.NoError(t, db.AutoMigrate(&models.Transaction{}))

    repo := repository.NewTransactionRepository(db)
    ctx := context.Background()

    // Seed
    now := time.Now()
    items := []models.Transaction{
        {UserID: 1, Amount: decimal.RequireFromString("10.00"), Status: models.TransactionStatusSuccess, CreatedAt: now.Add(-1 * time.Hour)},
        {UserID: 1, Amount: decimal.RequireFromString("5.00"), Status: models.TransactionStatusPending, CreatedAt: now.Add(-30 * time.Minute)},
        {UserID: 2, Amount: decimal.RequireFromString("7.50"), Status: models.TransactionStatusSuccess, CreatedAt: now.Add(-10 * time.Minute)},
        {UserID: 3, Amount: decimal.RequireFromString("2.50"), Status: models.TransactionStatusFailed, CreatedAt: now.Add(-5 * time.Minute)},
    }
    for i := range items {
        require.NoError(t, repo.Create(ctx, &items[i]))
    }

    // Filter by user
    uid := uint64(1)
    list, total, err := repo.List(ctx, repository.TransactionFilter{UserID: &uid})
    require.NoError(t, err)
    require.Equal(t, int64(2), total)
    require.Len(t, list, 2)

    // Pagination
    list, total, err = repo.List(ctx, repository.TransactionFilter{Limit: 2, Offset: 0, Sort: "created_at asc"})
    require.NoError(t, err)
    require.Equal(t, int64(4), total)
    require.Len(t, list, 2)

    // Aggregates
    sum, err := repo.TotalSuccessToday(ctx, now)
    require.NoError(t, err)
    // 10.00 + 7.50 = 17.50
    require.Equal(t, decimal.RequireFromString("17.50"), sum)

    avg, err := repo.AverageAmountPerUser(ctx)
    require.NoError(t, err)
    // total = 10 + 5 + 7.5 + 2.5 = 25, distinct users = 3 => 8.3333333333...
    require.True(t, avg.Sub(decimal.RequireFromString("8.33")).Abs().LessThan(decimal.NewFromFloat(0.02)))
}