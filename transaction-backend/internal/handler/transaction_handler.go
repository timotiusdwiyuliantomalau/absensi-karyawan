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

	// Convert model.Meta to response.Meta
	responseMeta := &response.Meta{
		Page:       meta.Page,
		Limit:      meta.Limit,
		Total:      meta.Total,
		TotalPages: meta.TotalPages,
	}

	response.SuccessWithMeta(c, transactions, "Transactions retrieved successfully", responseMeta)
}

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

func (h *TransactionHandler) DeleteTransaction(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		logger.Error("Invalid transaction ID", err, map[string]interface{}{
			"id": idStr,
		})
		response.BadRequest(c, err.Error())
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

func (h *TransactionHandler) GetDashboardSummary(c *gin.Context) {
	summary, err := h.service.GetDashboardSummary()
	if err != nil {
		logger.Error("Failed to get dashboard summary", err, nil)
		response.InternalServerError(c, err.Error())
		return
	}

	response.Success(c, summary, "Dashboard summary retrieved successfully")
}
