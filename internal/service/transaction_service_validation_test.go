package service

import (
    "context"
    "testing"

    "github.com/shopspring/decimal"
    "github.com/stretchr/testify/require"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"

    "github.com/example/transactions-api/internal/models"
    "github.com/example/transactions-api/internal/repository"
)

func TestService_Create_Validation(t *testing.T) {
    db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    _ = db.AutoMigrate(&models.Transaction{})
    svc := NewTransactionService(repository.NewTransactionRepository(db))

    _, err := svc.Create(context.Background(), 0, decimal.RequireFromString("1"), models.TransactionStatusSuccess)
    require.Error(t, err)

    _, err = svc.Create(context.Background(), 1, decimal.Zero, models.TransactionStatusSuccess)
    require.Error(t, err)

    _, err = svc.Create(context.Background(), 1, decimal.RequireFromString("1"), "invalid")
    require.Error(t, err)
}

func TestService_UpdateStatus_Validation(t *testing.T) {
    db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    _ = db.AutoMigrate(&models.Transaction{})
    svc := NewTransactionService(repository.NewTransactionRepository(db))

    err := svc.UpdateStatus(context.Background(), 1, "notvalid")
    require.Error(t, err)
}