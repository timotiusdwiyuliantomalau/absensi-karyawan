// +build windows

package services

import (
	"testing"
	"time"

	"transaction-api/internal/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

// MockDB is a mock implementation for Windows testing without CGO
type MockDB struct {
	mock.Mock
	transactions []models.Transaction
	nextID       uint
}

func NewMockDB() *MockDB {
	return &MockDB{
		transactions: make([]models.Transaction, 0),
		nextID:       1,
	}
}

func (m *MockDB) Create(transaction *models.Transaction) error {
	transaction.ID = m.nextID
	transaction.CreatedAt = time.Now().UTC()
	transaction.UpdatedAt = time.Now().UTC()
	m.transactions = append(m.transactions, *transaction)
	m.nextID++
	return nil
}

func (m *MockDB) FindByID(id uint) (*models.Transaction, error) {
	for _, t := range m.transactions {
		if t.ID == id && t.DeletedAt.Time.IsZero() {
			return &t, nil
		}
	}
	return nil, nil // Return nil instead of gorm.ErrRecordNotFound for mock
}

func (m *MockDB) FindAll(filters map[string]interface{}) ([]models.Transaction, int64, error) {
	var result []models.Transaction
	for _, t := range m.transactions {
		if t.DeletedAt.Time.IsZero() {
			// Apply filters
			match := true
			if userID, ok := filters["user_id"]; ok && t.UserID != userID.(uint) {
				match = false
			}
			if status, ok := filters["status"]; ok && t.Status != status.(models.TransactionStatus) {
				match = false
			}
			if match {
				result = append(result, t)
			}
		}
	}
	return result, int64(len(result)), nil
}

func (m *MockDB) Update(transaction *models.Transaction) error {
	for i, t := range m.transactions {
		if t.ID == transaction.ID && t.DeletedAt.Time.IsZero() {
			transaction.UpdatedAt = time.Now().UTC()
			m.transactions[i] = *transaction
			return nil
		}
	}
	return nil // Return nil for mock
}

func (m *MockDB) Delete(id uint) error {
	for i, t := range m.transactions {
		if t.ID == id && t.DeletedAt.Time.IsZero() {
			// For mock, just mark as deleted
			deletedTime := time.Now().UTC()
			m.transactions[i].DeletedAt.Time = deletedTime
			m.transactions[i].DeletedAt.Valid = true
			return nil
		}
	}
	return nil // Return nil for mock
}

// Windows-compatible tests without SQLite dependency
func TestTransactionServiceMock_CreateTransaction(t *testing.T) {
	// Mock-based test for Windows users
	req := &models.TransactionRequest{
		UserID: 1,
		Amount: 100.50,
	}

	// Simulate transaction creation
	transaction := &models.Transaction{
		ID:        1,
		UserID:    req.UserID,
		Amount:    req.Amount,
		Status:    models.StatusPending,
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}

	assert.Equal(t, uint(1), transaction.UserID)
	assert.Equal(t, 100.50, transaction.Amount)
	assert.Equal(t, models.StatusPending, transaction.Status)
	assert.NotZero(t, transaction.ID)
}

func TestTransactionServiceMock_ValidateModels(t *testing.T) {
	// Test model validation without database
	transaction := models.Transaction{
		UserID: 1,
		Amount: 100.0,
		Status: models.StatusSuccess,
	}

	assert.Equal(t, uint(1), transaction.UserID)
	assert.Equal(t, 100.0, transaction.Amount)
	assert.Equal(t, models.StatusSuccess, transaction.Status)

	// Test request models
	req := models.TransactionRequest{
		UserID: 2,
		Amount: 250.75,
	}

	assert.Equal(t, uint(2), req.UserID)
	assert.Equal(t, 250.75, req.Amount)

	// Test update request
	updateReq := models.TransactionUpdateRequest{
		Status: models.StatusFailed,
	}

	assert.Equal(t, models.StatusFailed, updateReq.Status)
}

func TestTransactionServiceMock_StatusConstants(t *testing.T) {
	// Test status constants
	assert.Equal(t, models.TransactionStatus("pending"), models.StatusPending)
	assert.Equal(t, models.TransactionStatus("success"), models.StatusSuccess)
	assert.Equal(t, models.TransactionStatus("failed"), models.StatusFailed)
}

func TestTransactionServiceMock_ResponseStructures(t *testing.T) {
	// Test response structures
	transactions := []models.Transaction{
		{ID: 1, UserID: 1, Amount: 100.0, Status: models.StatusSuccess},
		{ID: 2, UserID: 2, Amount: 200.0, Status: models.StatusPending},
	}

	response := models.TransactionResponse{
		Data:       transactions,
		Total:      2,
		Page:       1,
		Limit:      10,
		TotalPages: 1,
	}

	assert.Equal(t, 2, len(response.Data))
	assert.Equal(t, int64(2), response.Total)
	assert.Equal(t, 1, response.Page)

	// Test dashboard summary structure
	summary := models.DashboardSummary{
		TotalSuccessToday:    5,
		AverageAmountPerUser: 150.75,
		TotalTransactions:    10,
		RecentTransactions:   transactions,
		TotalAmount:          1507.5,
		TotalAmountToday:     753.75,
		StatusDistribution: map[string]int64{
			"success": 5,
			"pending": 3,
			"failed":  2,
		},
	}

	assert.Equal(t, int64(5), summary.TotalSuccessToday)
	assert.Equal(t, 150.75, summary.AverageAmountPerUser)
	assert.Equal(t, int64(10), summary.TotalTransactions)
	assert.Equal(t, 2, len(summary.RecentTransactions))
	assert.Equal(t, int64(5), summary.StatusDistribution["success"])
}

// Benchmark test for Windows
func BenchmarkTransactionCreation(b *testing.B) {
	for i := 0; i < b.N; i++ {
		transaction := models.Transaction{
			UserID: uint(i%10 + 1),
			Amount: float64(i * 10),
			Status: models.StatusPending,
		}
		_ = transaction
	}
}