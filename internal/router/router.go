package router

import (
    "github.com/gin-gonic/gin"
    ginSwagger "github.com/swaggo/gin-swagger"
    swaggerFiles "github.com/swaggo/files"

    "github.com/example/transactions-api/internal/handler"
    "github.com/example/transactions-api/internal/middleware"
)

func New(h *handler.TransactionHandler) *gin.Engine {
    r := gin.New()
    r.Use(gin.Recovery())
    r.Use(middleware.RequestLogger())

    // Health check
    r.GET("/health", func(c *gin.Context) { c.String(200, "OK") })

    // Swagger docs
    r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    // Transactions CRUD
    r.POST("/transactions", h.CreateTransaction)
    r.GET("/transactions", h.ListTransactions)
    r.GET("/transactions/:id", h.GetTransaction)
    r.PUT("/transactions/:id", h.UpdateTransaction)
    r.DELETE("/transactions/:id", h.DeleteTransaction)

    // Dashboard
    r.GET("/dashboard/summary", h.GetDashboardSummary)

    return r
}