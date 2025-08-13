package logger

import (
    "strings"

    "go.uber.org/zap"
    "go.uber.org/zap/zapcore"
)

// New creates a configured zap.Logger based on environment and level.
func New(env, level string) (*zap.Logger, error) {
    var cfg zap.Config
    if env == "production" {
        cfg = zap.NewProductionConfig()
    } else {
        cfg = zap.NewDevelopmentConfig()
    }

    switch strings.ToLower(level) {
    case "debug":
        cfg.Level = zap.NewAtomicLevelAt(zapcore.DebugLevel)
    case "warn":
        cfg.Level = zap.NewAtomicLevelAt(zapcore.WarnLevel)
    case "error":
        cfg.Level = zap.NewAtomicLevelAt(zapcore.ErrorLevel)
    default:
        cfg.Level = zap.NewAtomicLevelAt(zapcore.InfoLevel)
    }

    // More readable timestamps in development
    if env != "production" {
        cfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
    }

    return cfg.Build()
}