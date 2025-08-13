package config

import (
    "fmt"
    "os"
    "strings"

    "github.com/joho/godotenv"
)

// Config holds application configuration parsed from environment variables.
// It provides helpers to build database DSNs and flags used across the app.
type Config struct {
    AppName   string
    Env       string
    Port      string
    LogLevel  string

    DBDriver    string // mysql | sqlite
    DBDsn       string // full DSN (optional). If empty and DBDriver=mysql, it will be built from parts
    MySQLHost   string
    MySQLPort   string
    MySQLUser   string
    MySQLPass   string
    MySQLDBName string
    MySQLParams string

    SQLitePath string // file path, default ":memory:?cache=shared" for tests
}

// Load reads .env if present and populates Config with sane defaults.
func Load() (*Config, error) {
    // Load .env if present
    _ = godotenv.Load()

    cfg := &Config{
        AppName:    getEnv("APP_NAME", "transactions-api"),
        Env:        getEnv("APP_ENV", "development"),
        Port:       getEnv("PORT", "8080"),
        LogLevel:   strings.ToLower(getEnv("LOG_LEVEL", "info")),
        DBDriver:   strings.ToLower(getEnv("DB_DRIVER", "mysql")),
        DBDsn:      os.Getenv("DB_DSN"),
        MySQLHost:  getEnv("DB_HOST", "127.0.0.1"),
        MySQLPort:  getEnv("DB_PORT", "3306"),
        MySQLUser:  getEnv("DB_USER", "root"),
        MySQLPass:  getEnv("DB_PASSWORD", ""),
        MySQLDBName:getEnv("DB_NAME", "transactions"),
        MySQLParams:getEnv("DB_PARAMS", "parseTime=true&loc=Local&charset=utf8mb4,utf8"),
        SQLitePath: getEnv("DB_SQLITE_PATH", ":memory:?cache=shared"),
    }

    if cfg.DBDsn == "" {
        if cfg.DBDriver == "mysql" {
            cfg.DBDsn = cfg.buildMySQLDSN()
        } else if cfg.DBDriver == "sqlite" {
            cfg.DBDsn = cfg.SQLitePath
        }
    }

    return cfg, nil
}

func getEnv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}

func (c *Config) buildMySQLDSN() string {
    // username:password@tcp(host:port)/dbname?params
    auth := c.MySQLUser
    if c.MySQLPass != "" {
        auth = fmt.Sprintf("%s:%s", c.MySQLUser, c.MySQLPass)
    }
    return fmt.Sprintf("%s@tcp(%s:%s)/%s?%s", auth, c.MySQLHost, c.MySQLPort, c.MySQLDBName, c.MySQLParams)
}