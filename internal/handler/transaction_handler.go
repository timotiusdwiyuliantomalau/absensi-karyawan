package handler

import (
	"strconv"

	"transaction-backend/internal/model"
	"transaction-backend/internal/service"
	"transaction-backend/pkg/logger"
	"transaction-backend/pkg/response"

	"github.com/gin-gonic/gin"
)

type TransactionHandler struct {
	service service.TransactionService
}

func NewTransactionHandler(service service.TransactionService) *TransactionHandler {
	return &TransactionHandler{
		service: service,
	}
}

// CreateTransaction godoc
// @Summary Create a new transaction
// @Description Create a new transaction with user ID and amount
// @Tags transactions
// @Accept json
// @Produce json
// @Param transaction body model.CreateTransactionRequest true "Transaction data"
// @Success 201 {object} response.Response{data=model.Transaction}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /transactions [post]
func (h *TransactionHandler) CreateTransaction(c *gin.Context) {
	var req model.CreateTransactionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Error("Invalid request body", err, nil)
		response.BadRequest(c, err.Error())
		return
	}

	transaction, err := h.service.CreateTransaction(&req)
	if err != nil {
		logger.Error("Failed to create transaction", err, map[string]interface{}{
			"request": req,
		})
		response.InternalServerError(c, err.Error())
		return
	}

	response.Created(c, transaction, "Transaction created successfully")
}

// GetTransactionByID godoc
// @Summary Get transaction by ID
// @Description Get transaction details by transaction ID
// @Tags transactions
// @Produce json
// @Param id path int true "Transaction ID"
// @Success 200 {object} response.Response{data=model.Transaction}
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /transactions/{id} [get]
func (h *TransactionHandler) GetTransactionByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		logger.Error("Invalid transaction ID", err, map[string]interface{}{
			"id": idStr,
		})
		response.BadRequest(c, "Invalid transaction ID")
		return
	}

	transaction, err := h.service.GetTransactionByID(uint(id))
	if err != nil {
		if err.Error() == "transaction not found" {
			response.NotFound(c, "Transaction not found")
			return
		}
		logger.Error("Failed to get transaction", err, map[string]interface{}{
			"transaction_id": id,
		})
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, transaction, "Transaction retrieved successfully")
}

// GetAllTransactions godoc
// @Summary Get all transactions
// @Description Get paginated list of transactions with optional filters
// @Tags transactions
// @Produce json
// @Param user_id query int false "Filter by user ID"
// @Param status query string false "Filter by status (success, pending, failed)"
// @Param page query int false "Page number (default: 1)"
// @Param limit query int false "Items per page (default: 10, max: 100)"
// @Success 200 {object} response.Response{data=[]model.Transaction,meta=model.Meta}
// @Failure 400 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /transactions [get]
func (h *TransactionHandler) GetAllTransactions(c *gin.Context) {
	var filter model.TransactionFilter

	if err := c.ShouldBindQuery(&filter); err != nil {
		logger.Error("Invalid query parameters", err, nil)
		response.BadRequest(c, err.Error())
		return
	}

	transactions, meta, err := h.service.GetAllTransactions(&filter)
	if err != nil {
		logger.Error("Failed to get transactions", err, map[string]interface{}{
			"filter": filter,
		})
		response.InternalServerError(c, err.Error())
		return
	}

	response.SuccessWithMeta(c, transactions, "Transactions retrieved successfully", meta)
}

// UpdateTransactionStatus godoc
// @Summary Update transaction status
// @Description Update the status of an existing transaction
// @Tags transactions
// @Accept json
// @Produce json
// @Param id path int true "Transaction ID"
// @Param transaction body model.UpdateTransactionRequest true "Status update data"
// @Success 200 {object} response.Response{data=model.Transaction}
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /transactions/{id} [put]
func (h *TransactionHandler) UpdateTransactionStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		logger.Error("Invalid transaction ID", err, map[string]interface{}{
			"id": idStr,
		})
		response.BadRequest(c, "Invalid transaction ID")
		return
	}

	var req model.UpdateTransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logger.Error("Invalid request body", err, nil)
		response.BadRequest(c, err.Error())
		return
	}

	transaction, err := h.service.UpdateTransactionStatus(uint(id), &req)
	if err != nil {
		if err.Error() == "transaction not found" {
			response.NotFound(c, "Transaction not found")
			return
		}
		logger.Error("Failed to update transaction", err, map[string]interface{}{
			"transaction_id": id,
			"request":        req,
		})
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, transaction, "Transaction status updated successfully")
}

// DeleteTransaction godoc
// @Summary Delete transaction
// @Description Delete an existing transaction
// @Tags transactions
// @Produce json
// @Param id path int true "Transaction ID"
// @Success 200 {object} response.Response
// @Failure 400 {object} response.Response
// @Failure 404 {object} response.Response
// @Failure 500 {object} response.Response
// @Router /transactions/{id} [delete]
func (h *TransactionHandler) DeleteTransaction(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		logger.Error("Invalid transaction ID", err, map[string]interface{}{
			"id": idStr,
		})
		response.BadRequest(c, "Invalid transaction ID")
		return
	}

	err = h.service.DeleteTransaction(uint(id))
	if err != nil {
		if err.Error() == "transaction not found" {
			response.NotFound(c, "Transaction not found")
			return
		}
		logger.Error("Failed to delete transaction", err, map[string]interface{}{
			"transaction_id": id,
		})
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, nil, "Transaction deleted successfully")
}

// GetDashboardSummary godoc
// @Summary Get dashboard summary
// @Description Get summary data for dashboard including statistics and recent transactions
// @Tags dashboard
// @Produce json
// @Success 200 {object} response.Response{data=model.DashboardSummary}
// @Failure 500 {object} response.Response
// @Router /dashboard/summary [get]
func (h *TransactionHandler) GetDashboardSummary(c *gin.Context) {
	summary, err := h.service.GetDashboardSummary()
	if err != nil {
		logger.Error("Failed to get dashboard summary", err, nil)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, summary, "Dashboard summary retrieved successfully")
}