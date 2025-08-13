@echo off
echo 🔨 Building Transaction API
echo ============================

:: Build the application
echo 📦 Building binary...
go build -o transaction-api.exe cmd/server/main.go

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
) else (
    echo ✅ Build successful! Binary created: transaction-api.exe
)

echo.
echo 🚀 To run the application:
echo ./transaction-api.exe
echo.
echo 🧹 To clean build files:
echo del transaction-api.exe
echo.
pause