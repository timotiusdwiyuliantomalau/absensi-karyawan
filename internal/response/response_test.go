package response

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
)

func newContext() (*gin.Context, *httptest.ResponseRecorder) {
    gin.SetMode(gin.TestMode)
    w := httptest.NewRecorder()
    c, _ := gin.CreateTestContext(w)
    return c, w
}

func TestOKResponse(t *testing.T) {
    c, w := newContext()
    OK(c, map[string]string{"a": "b"}, &Meta{Page: 1})
    if w.Code != http.StatusOK {
        t.Fatalf("expected 200, got %d", w.Code)
    }
    var res APIResponse
    _ = json.Unmarshal(w.Body.Bytes(), &res)
    if !res.Success || res.Meta == nil || res.Meta.Page != 1 {
        t.Fatalf("unexpected response: %+v", res)
    }
}

func TestCreatedResponse(t *testing.T) {
    c, w := newContext()
    Created(c, map[string]int{"id": 1})
    if w.Code != http.StatusCreated {
        t.Fatalf("expected 201, got %d", w.Code)
    }
}

func TestNoContent(t *testing.T) {
    gin.SetMode(gin.TestMode)
    r := gin.New()
    r.GET("/nc", func(c *gin.Context) { NoContent(c) })
    w := httptest.NewRecorder()
    req, _ := http.NewRequest(http.MethodGet, "/nc", nil)
    r.ServeHTTP(w, req)
    if w.Code != http.StatusNoContent {
        t.Fatalf("expected 204, got %d", w.Code)
    }
}

func TestErrorResponse(t *testing.T) {
    c, w := newContext()
    Error(c, http.StatusBadRequest, "bad")
    if w.Code != http.StatusBadRequest {
        t.Fatalf("expected 400, got %d", w.Code)
    }
    var res APIResponse
    _ = json.Unmarshal(w.Body.Bytes(), &res)
    if res.Success || res.Message != "bad" {
        t.Fatalf("unexpected response: %+v", res)
    }
}