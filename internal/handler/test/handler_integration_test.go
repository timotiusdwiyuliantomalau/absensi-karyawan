package tests

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/shopspring/decimal"
    "github.com/stretchr/testify/require"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"

    "github.com/example/transactions-api/internal/handler"
    "github.com/example/transactions-api/internal/models"
    "github.com/example/transactions-api/internal/repository"
    "github.com/example/transactions-api/internal/router"
    "github.com/example/transactions-api/internal/service"
)

func setupRouterForTest(t *testing.T) *gin.Engine {
    gin.SetMode(gin.TestMode)
    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    require.NoError(t, err)
    require.NoError(t, db.AutoMigrate(&models.Transaction{}))
    repo := repository.NewTransactionRepository(db)
    svc := service.NewTransactionService(repo)
    h := handler.NewTransactionHandler(svc)
    return router.New(h)
}

func TestHandlers_Create_And_List(t *testing.T) {
    r := setupRouterForTest(t)

    // Create
    payload := map[string]interface{}{
        "user_id": 1,
        "amount":  decimal.NewFromInt(100).StringFixed(2),
        "status":  models.TransactionStatusPending,
    }
    body, _ := json.Marshal(payload)
    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodPost, "/transactions", bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusCreated, w.Code)

    // List
    w = httptest.NewRecorder()
    req, _ = http.NewRequest(http.MethodGet, "/transactions?page=1&page_size=10", nil)
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusOK, w.Code)
}