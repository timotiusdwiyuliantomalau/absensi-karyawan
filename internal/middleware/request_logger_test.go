package middleware

import (
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
)

func TestRequestLoggerMiddleware(t *testing.T) {
    gin.SetMode(gin.TestMode)
    r := gin.New()
    r.Use(RequestLogger())
    r.GET("/ping", func(c *gin.Context) { c.String(200, "pong") })
    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodGet, "/ping", nil)
    r.ServeHTTP(w, req)
    if w.Code != 200 {
        t.Fatalf("expected 200, got %d", w.Code)
    }
}