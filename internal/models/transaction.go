package models

import (
    "time"

    "github.com/shopspring/decimal"
)

// TransactionStatus defines allowed transaction statuses.
const (
    TransactionStatusSuccess = "success"
    TransactionStatusPending = "pending"
    TransactionStatusFailed  = "failed"
)

// Transaction represents a financial transaction executed by a user.
// Using decimal.Decimal for precise monetary arithmetic.
// Table name will be `transactions` (gorm default pluralization).
// ID uses uint64 for broader range.
// CreatedAt/UpdatedAt managed by GORM.

type Transaction struct {
    ID        uint64            `gorm:"primaryKey" json:"id"`
    UserID    uint64            `gorm:"index;not null" json:"user_id"`
    Amount    decimal.Decimal   `gorm:"type:decimal(18,2);not null" json:"amount"`
    Status    string            `gorm:"type:varchar(20);index;not null" json:"status"`
    CreatedAt time.Time         `gorm:"index" json:"created_at"`
    UpdatedAt time.Time         `json:"updated_at"`
}

// TableName overrides the table name.
func (Transaction) TableName() string { return "transactions" }