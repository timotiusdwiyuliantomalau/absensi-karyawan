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

func TestRepository_NotFound_And_Latest(t *testing.T) {
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    require.NoError(t, err)
    require.NoError(t, db.AutoMigrate(&models.Transaction{}))

    repo := NewTransactionRepository(db)
    ctx := context.Background()

    // Not found cases
    _, err = repo.FindByID(ctx, 9999)
    require.Error(t, err)

    err = repo.UpdateStatus(ctx, 9999, models.TransactionStatusPending)
    require.Error(t, err)

    err = repo.Delete(ctx, 9999)
    require.Error(t, err)

    // Seed several transactions with increasing CreatedAt
    now := time.Now()
    for i := 0; i < 15; i++ {
        tx := models.Transaction{
            UserID:    1,
            Amount:    decimal.NewFromInt(int64(i + 1)),
            Status:    models.TransactionStatusSuccess,
            CreatedAt: now.Add(time.Duration(i) * time.Minute),
        }
        require.NoError(t, repo.Create(ctx, &tx))
    }

    latest, err := repo.LatestTransactions(ctx, 10)
    require.NoError(t, err)
    require.Len(t, latest, 10)
    // Ensure sorted desc by CreatedAt: first item should be the newest
    require.True(t, latest[0].CreatedAt.After(latest[1].CreatedAt) || latest[0].CreatedAt.Equal(latest[1].CreatedAt))
}