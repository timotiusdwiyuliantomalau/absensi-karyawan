package logger

import "testing"

func TestLoggerNew(t *testing.T) {
    l, err := New("development", "debug")
    if err != nil || l == nil {
        t.Fatalf("expected dev logger, got err=%v", err)
    }
    l, err = New("production", "info")
    if err != nil || l == nil {
        t.Fatalf("expected prod logger, got err=%v", err)
    }
}