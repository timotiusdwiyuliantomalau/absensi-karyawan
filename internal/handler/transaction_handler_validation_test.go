package handler

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/require"
)

func TestHandler_Create_BadPayload(t *testing.T) {
    r := gin.New()
    h := &TransactionHandler{}
    r.POST("/transactions", h.CreateTransaction)

    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodPost, "/transactions", bytes.NewBufferString("{"))
    req.Header.Set("Content-Type", "application/json")
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusBadRequest, w.Code)
}

func TestHandler_List_BadQuery(t *testing.T) {
    r := gin.New()
    h := &TransactionHandler{}
    r.GET("/transactions", h.ListTransactions)

    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodGet, "/transactions?page=abc", nil)
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusBadRequest, w.Code)
}

func TestHandler_Get_BadID(t *testing.T) {
    r := gin.New()
    h := &TransactionHandler{}
    r.GET("/transactions/:id", h.GetTransaction)

    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodGet, "/transactions/abc", nil)
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusBadRequest, w.Code)
}

func TestHandler_Update_BadID(t *testing.T) {
    r := gin.New()
    h := &TransactionHandler{}
    r.PUT("/transactions/:id", h.UpdateTransaction)

    w := httptest.NewRecorder()
    body, _ := json.Marshal(map[string]string{"status": "pending"})
    req, _ := http.NewRequest(http.MethodPut, "/transactions/abc", bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusBadRequest, w.Code)
}

func TestHandler_Delete_BadID(t *testing.T) {
    r := gin.New()
    h := &TransactionHandler{}
    r.DELETE("/transactions/:id", h.DeleteTransaction)

    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodDelete, "/transactions/abc", nil)
    r.ServeHTTP(w, req)
    require.Equal(t, http.StatusBadRequest, w.Code)
}