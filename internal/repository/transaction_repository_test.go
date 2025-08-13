package repository

import (
    "context"
    "testing"
    "time"

    "github.com/shopspring/decimal"
    "github.com/stretchr/testify/require"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"

    "github.com/example/transactions-api/internal/models"
)

func TestRepository_List_And_Aggregates(t *testing.T) {
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    require.NoError(t, err)
    require.NoError(t, db.AutoMigrate(&models.Transaction{}))

    repo := NewTransactionRepository(db)
    ctx := context.Background()

    now := time.Now()
    seed := []models.Transaction{
        {UserID: 1, Amount: decimal.RequireFromString("10.00"), Status: models.TransactionStatusSuccess, CreatedAt: now},
        {UserID: 1, Amount: decimal.RequireFromString("5.00"), Status: models.TransactionStatusPending, CreatedAt: now},
        {UserID: 2, Amount: decimal.RequireFromString("7.50"), Status: models.TransactionStatusSuccess, CreatedAt: now},
    }
    for i := range seed {
        require.NoError(t, repo.Create(ctx, &seed[i]))
    }

    // List
    uid := uint64(1)
    list, total, err := repo.List(ctx, TransactionFilter{UserID: &uid})
    require.NoError(t, err)
    require.Equal(t, int64(2), total)
    require.Len(t, list, 2)

    // Aggregates
    sum, err := repo.TotalSuccessToday(ctx, now)
    require.NoError(t, err)
    require.Equal(t, decimal.RequireFromString("17.50"), sum)

    avg, err := repo.AverageAmountPerUser(ctx)
    require.NoError(t, err)
    // (10 + 5 + 7.50) / 2 = 11.25
    require.Equal(t, decimal.RequireFromString("11.25"), avg)
}