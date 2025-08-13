package main

import (
    "context"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-gonic/gin"
    // _ "github.com/example/transactions-api/docs" // enable after running swag init
    "go.uber.org/zap"

    "github.com/example/transactions-api/internal/config"
    "github.com/example/transactions-api/internal/database"
    "github.com/example/transactions-api/internal/handler"
    "github.com/example/transactions-api/internal/logger"
    "github.com/example/transactions-api/internal/middleware"
    "github.com/example/transactions-api/internal/repository"
    "github.com/example/transactions-api/internal/router"
    "github.com/example/transactions-api/internal/service"
)

// @title Transactions API
// @version 1.0
// @description RESTful API for managing transactions and dashboard summary.
// @BasePath /
// @schemes http
func main() {
    cfg, err := config.Load()
    if err != nil {
        panic(err)
    }

    l, err := logger.New(cfg.Env, cfg.LogLevel)
    if err != nil {
        panic(err)
    }
    defer l.Sync() // flush logs

    middleware.SetLogger(l)

    db, err := database.New(cfg, l)
    if err != nil {
        l.Fatal("failed to init database", zap.Error(err))
    }

    txRepo := repository.NewTransactionRepository(db)
    txSvc := service.NewTransactionService(txRepo)
    txHandler := handler.NewTransactionHandler(txSvc)

    if cfg.Env == "production" {
        gin.SetMode(gin.ReleaseMode)
    }
    r := router.New(txHandler)

    srv := &http.Server{
        Addr:    ":" + cfg.Port,
        Handler: r,
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            l.Fatal("server error", zap.Error(err))
        }
    }()

    // Graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        l.Error("server shutdown error", zap.Error(err))
    }
}