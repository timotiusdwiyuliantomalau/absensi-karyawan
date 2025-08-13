package router

import (
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/example/transactions-api/internal/handler"
)

type dummyService struct{}

func (d *dummyService) Create(ctx interface{}, a ...interface{}) (interface{}, error) { return nil, nil }

func TestRouter_Health(t *testing.T) {
    // Use a handler with nil service; only test health route
    h := handler.NewTransactionHandler(nil)
    r := New(h)
    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodGet, "/health", nil)
    r.ServeHTTP(w, req)
    if w.Code != 200 {
        t.Fatalf("expected 200, got %d", w.Code)
    }
}