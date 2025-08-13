package response

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type Meta struct {
    Page       int   `json:"page,omitempty"`
    PageSize   int   `json:"page_size,omitempty"`
    TotalRows  int64 `json:"total_rows,omitempty"`
    TotalPages int   `json:"total_pages,omitempty"`
}

type APIResponse struct {
    Success bool        `json:"success"`
    Message string      `json:"message,omitempty"`
    Data    interface{} `json:"data,omitempty"`
    Meta    *Meta       `json:"meta,omitempty"`
}

func OK(c *gin.Context, data interface{}, meta *Meta) {
    c.JSON(http.StatusOK, APIResponse{Success: true, Data: data, Meta: meta})
}

func Created(c *gin.Context, data interface{}) {
    c.JSON(http.StatusCreated, APIResponse{Success: true, Data: data})
}

func NoContent(c *gin.Context) {
    c.Status(http.StatusNoContent)
}

func Error(c *gin.Context, status int, message string) {
    c.JSON(status, APIResponse{Success: false, Message: message})
}