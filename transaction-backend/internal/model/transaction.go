package model

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	UserID    uint           `json:"user_id" gorm:"not null;index"`
	Amount    float64        `json:"amount" gorm:"not null;type:decimal(10,2)"`
	Status    string         `json:"status" gorm:"not null;type:enum('success','pending','failed');default:'pending'"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"deleted_at,omitempty" gorm:"index"`
}

type CreateTransactionRequest struct {
	UserID uint    `json:"user_id" binding:"required"`
	Amount float64 `json:"amount" binding:"required,gt=0"`
}

type UpdateTransactionRequest struct {
	Status string `json:"status" binding:"required,oneof=success pending failed"`
}

type TransactionFilter struct {
	UserID uint   `form:"user_id"`
	Status string `form:"status"`
	Page   int    `form:"page,default=1"`
	Limit  int    `form:"limit,default=10"`
}

type DashboardSummary struct {
	TotalSuccessToday    int64         `json:"total_success_today"`
	TotalTransactions    int64         `json:"total_transactions"`
	AverageAmountPerUser float64       `json:"average_amount_per_user"`
	RecentTransactions   []Transaction `json:"recent_transactions"`
}

type Meta struct {
	Page       int `json:"page,omitempty"`
	Limit      int `json:"limit,omitempty"`
	Total      int `json:"total,omitempty"`
	TotalPages int `json:"total_pages,omitempty"`
}

func (t *Transaction) BeforeCreate(tx *gorm.DB) error {
	if t.Status == "" {
		t.Status = "pending"
	}
	return nil
}
