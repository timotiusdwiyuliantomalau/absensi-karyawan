package service

import (
	"errors"
	"testing"

	"transaction-backend/internal/model"
	"transaction-backend/pkg/logger"
)

func init() {
	// Initialize logger for testing
	logger.Init("debug")
}

// Mock repository for testing
type mockTransactionRepository struct {
	transactions map[uint]*model.Transaction
	nextID       uint
}

func newMockTransactionRepository() *mockTransactionRepository {
	return &mockTransactionRepository{
		transactions: make(map[uint]*model.Transaction),
		nextID:       1,
	}
}

func (m *mockTransactionRepository) Create(transaction *model.Transaction) error {
	transaction.ID = m.nextID
	m.transactions[m.nextID] = transaction
	m.nextID++
	return nil
}

func (m *mockTransactionRepository) GetByID(id uint) (*model.Transaction, error) {
	if transaction, exists := m.transactions[id]; exists {
		return transaction, nil
	}
	return nil, errors.New("transaction not found")
}

func (m *mockTransactionRepository) GetAll(filter *model.TransactionFilter) ([]model.Transaction, *model.Meta, error) {
	var transactions []model.Transaction
	for _, t := range m.transactions {
		transactions = append(transactions, *t)
	}
	
	meta := &model.Meta{
		Page:       filter.Page,
		Limit:      filter.Limit,
		Total:      len(transactions),
		TotalPages: 1,
	}
	
	return transactions, meta, nil
}

func (m *mockTransactionRepository) Update(transaction *model.Transaction) error {
	if _, exists := m.transactions[transaction.ID]; exists {
		m.transactions[transaction.ID] = transaction
		return nil
	}
	return errors.New("transaction not found")
}

func (m *mockTransactionRepository) Delete(id uint) error {
	if _, exists := m.transactions[id]; exists {
		delete(m.transactions, id)
		return nil
	}
	return errors.New("transaction not found")
}

func (m *mockTransactionRepository) GetTotalSuccessToday() (int64, error) {
	var count int64
	for _, t := range m.transactions {
		if t.Status == "success" {
			count++
		}
	}
	return count, nil
}

func (m *mockTransactionRepository) GetTotalTransactions() (int64, error) {
	return int64(len(m.transactions)), nil
}

func (m *mockTransactionRepository) GetAverageAmountPerUser() (float64, error) {
	if len(m.transactions) == 0 {
		return 0, nil
	}
	
	userTotals := make(map[uint]float64)
	for _, t := range m.transactions {
		userTotals[t.UserID] += t.Amount
	}
	
	var total float64
	for _, amount := range userTotals {
		total += amount
	}
	
	return total / float64(len(userTotals)), nil
}

func (m *mockTransactionRepository) GetRecentTransactions(limit int) ([]model.Transaction, error) {
	var transactions []model.Transaction
	for _, t := range m.transactions {
		transactions = append(transactions, *t)
	}
	
	if len(transactions) > limit {
		return transactions[:limit], nil
	}
	return transactions, nil
}

func TestCreateTransaction(t *testing.T) {
	repo := newMockTransactionRepository()
	service := NewTransactionService(repo)

	tests := []struct {
		name    string
		req     *model.CreateTransactionRequest
		wantErr bool
	}{
		{
			name: "Valid transaction",
			req: &model.CreateTransactionRequest{
				UserID: 1,
				Amount: 100.50,
			},
			wantErr: false,
		},
		{
			name: "Invalid amount - zero",
			req: &model.CreateTransactionRequest{
				UserID: 1,
				Amount: 0,
			},
			wantErr: true,
		},
		{
			name: "Invalid amount - negative",
			req: &model.CreateTransactionRequest{
				UserID: 1,
				Amount: -50.00,
			},
			wantErr: true,
		},
		{
			name: "Invalid user ID",
			req: &model.CreateTransactionRequest{
				UserID: 0,
				Amount: 100.00,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			transaction, err := service.CreateTransaction(tt.req)
			
			if tt.wantErr {
				if err == nil {
					t.Errorf("CreateTransaction() expected error but got none")
				}
			} else {
				if err != nil {
					t.Errorf("CreateTransaction() unexpected error: %v", err)
				}
				if transaction == nil {
					t.Errorf("CreateTransaction() expected transaction but got nil")
				}
				if transaction.Status != "pending" {
					t.Errorf("CreateTransaction() expected status 'pending', got %s", transaction.Status)
				}
			}
		})
	}
}

func TestGetTransactionByID(t *testing.T) {
	repo := newMockTransactionRepository()
	service := NewTransactionService(repo)

	// Create a test transaction
	req := &model.CreateTransactionRequest{UserID: 1, Amount: 100.00}
	transaction, _ := service.CreateTransaction(req)

	tests := []struct {
		name    string
		id      uint
		wantErr bool
	}{
		{
			name:    "Valid ID",
			id:      transaction.ID,
			wantErr: false,
		},
		{
			name:    "Invalid ID - zero",
			id:      0,
			wantErr: true,
		},
		{
			name:    "Non-existent ID",
			id:      999,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := service.GetTransactionByID(tt.id)
			
			if tt.wantErr {
				if err == nil {
					t.Errorf("GetTransactionByID() expected error but got none")
				}
			} else {
				if err != nil {
					t.Errorf("GetTransactionByID() unexpected error: %v", err)
				}
				if result == nil {
					t.Errorf("GetTransactionByID() expected transaction but got nil")
				}
			}
		})
	}
}

func TestUpdateTransactionStatus(t *testing.T) {
	repo := newMockTransactionRepository()
	service := NewTransactionService(repo)

	// Create a test transaction
	req := &model.CreateTransactionRequest{UserID: 1, Amount: 100.00}
	transaction, _ := service.CreateTransaction(req)

	tests := []struct {
		name    string
		id      uint
		status  string
		wantErr bool
	}{
		{
			name:    "Valid status update",
			id:      transaction.ID,
			status:  "success",
			wantErr: false,
		},
		{
			name:    "Invalid ID",
			id:      0,
			status:  "success",
			wantErr: true,
		},
		{
			name:    "Non-existent ID",
			id:      999,
			status:  "success",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			updateReq := &model.UpdateTransactionRequest{Status: tt.status}
			result, err := service.UpdateTransactionStatus(tt.id, updateReq)
			
			if tt.wantErr {
				if err == nil {
					t.Errorf("UpdateTransactionStatus() expected error but got none")
				}
			} else {
				if err != nil {
					t.Errorf("UpdateTransactionStatus() unexpected error: %v", err)
				}
				if result.Status != tt.status {
					t.Errorf("UpdateTransactionStatus() expected status %s, got %s", tt.status, result.Status)
				}
			}
		})
	}
}

func TestDeleteTransaction(t *testing.T) {
	repo := newMockTransactionRepository()
	service := NewTransactionService(repo)

	// Create a test transaction
	req := &model.CreateTransactionRequest{UserID: 1, Amount: 100.00}
	transaction, _ := service.CreateTransaction(req)

	tests := []struct {
		name    string
		id      uint
		wantErr bool
	}{
		{
			name:    "Valid ID",
			id:      transaction.ID,
			wantErr: false,
		},
		{
			name:    "Invalid ID - zero",
			id:      0,
			wantErr: true,
		},
		{
			name:    "Non-existent ID",
			id:      999,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := service.DeleteTransaction(tt.id)
			
			if tt.wantErr {
				if err == nil {
					t.Errorf("DeleteTransaction() expected error but got none")
				}
			} else {
				if err != nil {
					t.Errorf("DeleteTransaction() unexpected error: %v", err)
				}
			}
		})
	}
}

func TestGetDashboardSummary(t *testing.T) {
	repo := newMockTransactionRepository()
	service := NewTransactionService(repo)

	// Create some test transactions
	testTransactions := []*model.CreateTransactionRequest{
		{UserID: 1, Amount: 100.00},
		{UserID: 1, Amount: 200.00},
		{UserID: 2, Amount: 150.00},
		{UserID: 2, Amount: 250.00},
	}

	for _, req := range testTransactions {
		service.CreateTransaction(req)
	}

	summary, err := service.GetDashboardSummary()
	if err != nil {
		t.Errorf("GetDashboardSummary() unexpected error: %v", err)
	}

	if summary == nil {
		t.Errorf("GetDashboardSummary() expected summary but got nil")
	}

	if summary.TotalTransactions != 4 {
		t.Errorf("GetDashboardSummary() expected total transactions 4, got %d", summary.TotalTransactions)
	}

	if len(summary.RecentTransactions) == 0 {
		t.Errorf("GetDashboardSummary() expected recent transactions but got empty")
	}
}
