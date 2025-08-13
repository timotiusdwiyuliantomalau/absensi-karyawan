package config

import (
    "os"
    "testing"
)

func TestLoad_Defaults_And_SQLiteDSN(t *testing.T) {
    os.Clearenv()
    os.Setenv("DB_DRIVER", "sqlite")
    os.Setenv("DB_SQLITE_PATH", ":memory:")
    cfg, err := Load()
    if err != nil {
        t.Fatalf("load error: %v", err)
    }
    if cfg.DBDriver != "sqlite" || cfg.DBDsn == "" {
        t.Fatalf("unexpected cfg: %+v", cfg)
    }
}

func TestLoad_MySQL_DSN_From_Parts(t *testing.T) {
    os.Clearenv()
    os.Setenv("DB_DRIVER", "mysql")
    os.Setenv("DB_HOST", "localhost")
    os.Setenv("DB_PORT", "3306")
    os.Setenv("DB_USER", "root")
    os.Setenv("DB_PASSWORD", "secret")
    os.Setenv("DB_NAME", "transactions")
    os.Setenv("DB_PARAMS", "parseTime=true")

    cfg, err := Load()
    if err != nil {
        t.Fatalf("load error: %v", err)
    }
    if cfg.DBDsn == "" || cfg.DBDriver != "mysql" {
        t.Fatalf("unexpected cfg: %+v", cfg)
    }
    if want := "root:secret@tcp(localhost:3306)/transactions?parseTime=true"; cfg.DBDsn != want {
        t.Fatalf("unexpected dsn: %s", cfg.DBDsn)
    }
}

func TestLoad_Uses_DB_DSN_If_Set(t *testing.T) {
    os.Clearenv()
    os.Setenv("DB_DRIVER", "mysql")
    os.Setenv("DB_DSN", "user:pass@tcp(host:1234)/db?x=y")
    cfg, err := Load()
    if err != nil {
        t.Fatalf("load error: %v", err)
    }
    if cfg.DBDsn != "user:pass@tcp(host:1234)/db?x=y" {
        t.Fatalf("unexpected dsn: %s", cfg.DBDsn)
    }
}