package handler

import (
    "net/http"
    "strconv"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/shopspring/decimal"

    "github.com/example/transactions-api/internal/pagination"
    "github.com/example/transactions-api/internal/repository"
    "github.com/example/transactions-api/internal/response"
    "github.com/example/transactions-api/internal/service"
)

type TransactionHandler struct {
    svc service.TransactionService
}

func NewTransactionHandler(svc service.TransactionService) *TransactionHandler {
    return &TransactionHandler{svc: svc}
}

// createTransactionRequest represents the payload for creating a transaction

type createTransactionRequest struct {
    UserID uint64 `json:"user_id" binding:"required"`
    Amount string `json:"amount" binding:"required"` // decimal string, e.g. "123.45"
    Status string `json:"status" binding:"required,oneof=pending success failed"`
}

// updateTransactionRequest represents the payload for updating a transaction status

type updateTransactionRequest struct {
    Status string `json:"status" binding:"required,oneof=pending success failed"`
}

// listTransactionsQuery represents optional filters and pagination

type listTransactionsQuery struct {
    UserID   *uint64 `form:"user_id"`
    Status   *string `form:"status"`
    Page     int     `form:"page,default=1"`
    PageSize int     `form:"page_size,default=10"`
    Sort     string  `form:"sort,default=created_at desc"`
}

// CreateTransaction godoc
// @Summary Create a new transaction
// @Accept json
// @Produce json
// @Param payload body createTransactionRequest true "Transaction payload"
// @Success 201 {object} response.APIResponse
// @Failure 400 {object} response.APIResponse
// @Router /transactions [post]
func (h *TransactionHandler) CreateTransaction(c *gin.Context) {
    var req createTransactionRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, http.StatusBadRequest, err.Error())
        return
    }
    amount, err := decimal.NewFromString(req.Amount)
    if err != nil {
        response.Error(c, http.StatusBadRequest, "invalid amount format")
        return
    }

    tx, err := h.svc.Create(c.Request.Context(), req.UserID, amount, req.Status)
    if err != nil {
        response.Error(c, http.StatusBadRequest, err.Error())
        return
    }
    response.Created(c, tx)
}

// GetTransaction godoc
// @Summary Get transaction by ID
// @Produce json
// @Param id path int true "Transaction ID"
// @Success 200 {object} response.APIResponse
// @Failure 404 {object} response.APIResponse
// @Router /transactions/{id} [get]
func (h *TransactionHandler) GetTransaction(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 64)
    if err != nil {
        response.Error(c, http.StatusBadRequest, "invalid id")
        return
    }
    tx, err := h.svc.GetByID(c.Request.Context(), id)
    if err != nil {
        response.Error(c, http.StatusNotFound, "transaction not found")
        return
    }
    response.OK(c, tx, nil)
}

// ListTransactions godoc
// @Summary List transactions with optional filters and pagination
// @Produce json
// @Param user_id query int false "Filter by user id"
// @Param status query string false "Filter by status"
// @Param page query int false "Page number"
// @Param page_size query int false "Page size"
// @Param sort query string false "Sort, e.g. created_at desc"
// @Success 200 {object} response.APIResponse
// @Router /transactions [get]
func (h *TransactionHandler) ListTransactions(c *gin.Context) {
    var q listTransactionsQuery
    if err := c.ShouldBindQuery(&q); err != nil {
        response.Error(c, http.StatusBadRequest, err.Error())
        return
    }

    p := pagination.Params{Page: q.Page, PageSize: q.PageSize}
    p.Normalize(100)

    filter := repository.TransactionFilter{
        UserID: q.UserID,
        Status: q.Status,
        Sort:   q.Sort,
        Limit:  p.Limit(),
        Offset: p.Offset(),
    }

    list, total, err := h.svc.List(c.Request.Context(), filter)
    if err != nil {
        response.Error(c, http.StatusInternalServerError, err.Error())
        return
    }

    meta := &response.Meta{
        Page:       p.Page,
        PageSize:   p.PageSize,
        TotalRows:  total,
        TotalPages: pagination.TotalPages(total, p.PageSize),
    }
    response.OK(c, list, meta)
}

// UpdateTransaction godoc
// @Summary Update transaction status
// @Accept json
// @Produce json
// @Param id path int true "Transaction ID"
// @Param payload body updateTransactionRequest true "Update payload"
// @Success 200 {object} response.APIResponse
// @Failure 400 {object} response.APIResponse
// @Failure 404 {object} response.APIResponse
// @Router /transactions/{id} [put]
func (h *TransactionHandler) UpdateTransaction(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 64)
    if err != nil {
        response.Error(c, http.StatusBadRequest, "invalid id")
        return
    }
    var req updateTransactionRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, http.StatusBadRequest, err.Error())
        return
    }
    if err := h.svc.UpdateStatus(c.Request.Context(), id, req.Status); err != nil {
        if err.Error() == "invalid status" {
            response.Error(c, http.StatusBadRequest, err.Error())
            return
        }
        response.Error(c, http.StatusNotFound, "transaction not found")
        return
    }
    tx, _ := h.svc.GetByID(c.Request.Context(), id)
    response.OK(c, tx, nil)
}

// DeleteTransaction godoc
// @Summary Delete transaction by ID
// @Param id path int true "Transaction ID"
// @Success 204 {string} string ""
// @Failure 404 {object} response.APIResponse
// @Router /transactions/{id} [delete]
func (h *TransactionHandler) DeleteTransaction(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 64)
    if err != nil {
        response.Error(c, http.StatusBadRequest, "invalid id")
        return
    }
    if err := h.svc.Delete(c.Request.Context(), id); err != nil {
        response.Error(c, http.StatusNotFound, "transaction not found")
        return
    }
    response.NoContent(c)
}

// GetDashboardSummary godoc
// @Summary Get dashboard summary
// @Produce json
// @Success 200 {object} response.APIResponse
// @Router /dashboard/summary [get]
func (h *TransactionHandler) GetDashboardSummary(c *gin.Context) {
    now := time.Now()
    summary, err := h.svc.DashboardSummary(c.Request.Context(), now)
    if err != nil {
        response.Error(c, http.StatusInternalServerError, err.Error())
        return
    }
    response.OK(c, summary, nil)
}