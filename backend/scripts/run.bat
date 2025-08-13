@echo off
echo 🚀 Starting Transaction API Server
echo ==================================

:: Check if .env file exists
if not exist .env (
    echo ⚠️ .env file not found. Creating from .env.example...
    copy .env.example .env
)

:: Start the application
echo 🎯 Starting server on port 8080...
echo 🌐 API will be available at: http://localhost:8080
echo 🏥 Health check: http://localhost:8080/health
echo.
echo 🛑 Press Ctrl+C to stop the server
echo.

go run cmd/server/main.go