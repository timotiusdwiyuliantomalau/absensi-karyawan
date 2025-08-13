package database

import (
    "testing"

    "github.com/example/transactions-api/internal/config"
)

func TestDatabaseNew_SQLiteMemory(t *testing.T) {
    cfg := &config.Config{
        DBDriver:   "sqlite",
        DBDsn:      ":memory:",
        SQLitePath: ":memory:",
    }
    db, err := New(cfg, nil)
    if err != nil || db == nil {
        t.Fatalf("expected db open, got err=%v", err)
    }
    // Ping underlying connection
    sqlDB, err := db.DB()
    if err != nil {
        t.Fatalf("db.DB error: %v", err)
    }
    if err := sqlDB.Ping(); err != nil {
        t.Fatalf("ping error: %v", err)
    }
}