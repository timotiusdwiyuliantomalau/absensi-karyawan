package database

import (
    "fmt"
    stdlog "log"
    "os"
    "time"

    "github.com/example/transactions-api/internal/config"
    "github.com/example/transactions-api/internal/models"
    "go.uber.org/zap"
    "gorm.io/driver/mysql"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    gormlogger "gorm.io/gorm/logger"
)

// New opens a GORM DB connection based on configuration and runs migrations.
func New(cfg *config.Config, _ *zap.Logger) (*gorm.DB, error) {
    var dialector gorm.Dialector
    switch cfg.DBDriver {
    case "mysql":
        dialector = mysql.Open(cfg.DBDsn)
    case "sqlite":
        dialector = sqlite.Open(cfg.DBDsn)
    default:
        return nil, fmt.Errorf("unsupported DB_DRIVER: %s", cfg.DBDriver)
    }

    gormLogger := gormlogger.New(stdlog.New(os.Stdout, "", stdlog.LstdFlags), gormlogger.Config{
        SlowThreshold:             200 * time.Millisecond,
        LogLevel:                  gormlogger.Warn,
        IgnoreRecordNotFoundError: true,
        Colorful:                  false,
    })

    db, err := gorm.Open(dialector, &gorm.Config{Logger: gormLogger})
    if err != nil {
        return nil, err
    }

    // Connection pool
    sqlDB, err := db.DB()
    if err == nil {
        sqlDB.SetMaxIdleConns(10)
        sqlDB.SetMaxOpenConns(100)
        sqlDB.SetConnMaxLifetime(60 * time.Minute)
    }

    // AutoMigrate models
    if err := db.AutoMigrate(&models.Transaction{}); err != nil {
        return nil, err
    }

    return db, nil
}