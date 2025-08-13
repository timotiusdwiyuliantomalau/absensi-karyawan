package middleware

import (
    "time"

    "github.com/gin-gonic/gin"
    "go.uber.org/zap"
)

var logger *zap.Logger

func SetLogger(l *zap.Logger) {
    logger = l
}

func RequestLogger() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        path := c.Request.URL.Path
        raw := c.Request.URL.RawQuery

        c.Next()

        latency := time.Since(start)
        if raw != "" {
            path = path + "?" + raw
        }
        if logger != nil {
            logger.Info("http request",
                zap.Int("status", c.Writer.Status()),
                zap.String("method", c.Request.Method),
                zap.String("path", path),
                zap.String("client_ip", c.ClientIP()),
                zap.Duration("latency", latency),
            )
        }
    }
}