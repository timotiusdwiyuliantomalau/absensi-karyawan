package logger

import (
	"os"

	"github.com/sirupsen/logrus"
)

var log *logrus.Logger

func Init(level string) {
	log = logrus.New()
	
	// Set output to stdout
	log.SetOutput(os.Stdout)
	
	// Set log level
	switch level {
	case "debug":
		log.SetLevel(logrus.DebugLevel)
	case "info":
		log.SetLevel(logrus.InfoLevel)
	case "warn":
		log.SetLevel(logrus.WarnLevel)
	case "error":
		log.SetLevel(logrus.ErrorLevel)
	default:
		log.SetLevel(logrus.InfoLevel)
	}
	
	// Set formatter
	log.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
	})
}

func GetLogger() *logrus.Logger {
	return log
}

func Info(message string, fields map[string]interface{}) {
	if fields != nil {
		log.WithFields(fields).Info(message)
	} else {
		log.Info(message)
	}
}

func Error(message string, err error, fields map[string]interface{}) {
	if fields != nil {
		log.WithFields(fields).WithError(err).Error(message)
	} else {
		log.WithError(err).Error(message)
	}
}

func Warn(message string, fields map[string]interface{}) {
	if fields != nil {
		log.WithFields(fields).Warn(message)
	} else {
		log.Warn(message)
	}
}

func Debug(message string, fields map[string]interface{}) {
	if fields != nil {
		log.WithFields(fields).Debug(message)
	} else {
		log.Debug(message)
	}
}

func Fatal(message string, err error) {
	log.WithError(err).Fatal(message)
}
