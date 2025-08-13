@echo off
echo 🧪 Running Transaction API Tests
echo =================================

:: Run tests with verbose output
go test ./... -v

if %errorlevel% neq 0 (
    echo ❌ Some tests failed
    pause
    exit /b 1
) else (
    echo ✅ All tests passed!
)

echo.
echo 📊 Running tests with coverage...
go test ./... -cover

echo.
echo 📋 To generate HTML coverage report:
echo go test ./... -coverprofile=coverage.out
echo go tool cover -html=coverage.out -o coverage.html
echo.
pause