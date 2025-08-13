package router

import (
	"transaction-backend/internal/handler"
	"transaction-backend/internal/middleware"
	"transaction-backend/internal/repository"
	"transaction-backend/internal/service"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	// Initialize dependencies
	transactionRepo := repository.NewTransactionRepository()
	transactionService := service.NewTransactionService(transactionRepo)
	transactionHandler := handler.NewTransactionHandler(transactionService)

	// Create router
	r := gin.New()

	// Add middleware
	r.Use(middleware.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())
	r.Use(middleware.RequestID())

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Transaction Backend Service is running",
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Transaction routes
		transactions := v1.Group("/transactions")
		{
			transactions.POST("", transactionHandler.CreateTransaction)
			transactions.GET("", transactionHandler.GetAllTransactions)
			transactions.GET("/:id", transactionHandler.GetTransactionByID)
			transactions.PUT("/:id", transactionHandler.UpdateTransactionStatus)
			transactions.DELETE("/:id", transactionHandler.DeleteTransaction)
		}

		// Dashboard routes
		dashboard := v1.Group("/dashboard")
		{
			dashboard.GET("/summary", transactionHandler.GetDashboardSummary)
		}
	}

	return r
}
