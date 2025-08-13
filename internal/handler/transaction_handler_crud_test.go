package handler

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/shopspring/decimal"
    "github.com/stretchr/testify/require"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"

    "github.com/example/transactions-api/internal/models"
    "github.com/example/transactions-api/internal/repository"
    "github.com/example/transactions-api/internal/service"
)

func setupFullRouter(t *testing.T) *gin.Engine {
    gin.SetMode(gin.TestMode)
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    require.NoError(t, err)
    require.NoError(t, db.AutoMigrate(&models.Transaction{}))
    repo := repository.NewTransactionRepository(db)
    svc := service.NewTransactionService(repo)
    h := NewTransactionHandler(svc)

    r := gin.New()
    r.POST("/transactions", h.CreateTransaction)
    r.GET("/transactions", h.ListTransactions)
    r.GET("/transactions/:id", h.GetTransaction)
    r.PUT("/transactions/:id", h.UpdateTransaction)
    r.DELETE("/transactions/:id", h.DeleteTransaction)
    r.GET("/dashboard/summary", h.GetDashboardSummary)
    return r
}

func TestHandlers_Full_CRUD_And_Dashboard(t *testing.T) {
    r := setupFullRouter(t)

    // Create 2 tx
    create := func(userID int, amount string, status string) uint64 {
        payload := map[string]interface{}{
            "user_id": userID,
            "amount":  amount,
            "status":  status,
        }
        body, _ := json.Marshal(payload)
        w := httptest.NewRecorder()
        req, _ := http.NewRequest(http.MethodPost, "/transactions", bytes.NewReader(body))
        req.Header.Set("Content-Type", "application/json")
        r.ServeHTTP(w, req)
        require.Equal(t, http.StatusCreated, w.Code)
        var resp map[string]interface{}
        _ = json.Unmarshal(w.Body.Bytes(), &resp)
        data := resp["data"].(map[string]interface{})
        return uint64(data["id"].(float64))
    }

    id1 := create(1, decimal.NewFromFloat(100).StringFixed(2), models.TransactionStatusSuccess)
    id2 := create(1, decimal.NewFromFloat(50.5).StringFixed(2), models.TransactionStatusPending)

    // Get by id
    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodGet, fmt.Sprintf("/transactions/%d", id1), nil)
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusOK, w.Code)

    // Update status
    updateBody, _ := json.Marshal(map[string]string{"status": models.TransactionStatusSuccess})
    w = httptest.NewRecorder()
    req, _ = http.NewRequest(http.MethodPut, fmt.Sprintf("/transactions/%d", id2), bytes.NewReader(updateBody))
    req.Header.Set("Content-Type", "application/json")
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusOK, w.Code)

    // Dashboard summary
    w = httptest.NewRecorder()
    req, _ = http.NewRequest(http.MethodGet, "/dashboard/summary", nil)
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusOK, w.Code)

    // Delete
    w = httptest.NewRecorder()
    req, _ = http.NewRequest(http.MethodDelete, fmt.Sprintf("/transactions/%d", id1), nil)
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusNoContent, w.Code)
}