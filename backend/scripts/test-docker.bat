@echo off
echo 🐳 Running Tests with Docker (Windows Solution)
echo ===============================================

echo 📋 Checking Docker availability...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found. Please install Docker Desktop first.
    echo 📥 Download: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo ✅ Docker found!

echo 🐳 Running tests in Docker container with CGO support...
echo ⏳ This may take a moment to download Go image...

:: Run tests in Docker with volume mounting
docker run --rm -v "%cd%":/app -w /app golang:1.21 /bin/bash -c "go mod tidy && go test ./... -v"

if %errorlevel% neq 0 (
    echo ❌ Tests failed in Docker
    echo.
    echo 🔍 Debugging: Running tests with coverage...
    docker run --rm -v "%cd%":/app -w /app golang:1.21 /bin/bash -c "go mod tidy && go test ./... -cover"
) else (
    echo ✅ All tests passed in Docker!
    echo.
    echo 📊 Running coverage analysis...
    docker run --rm -v "%cd%":/app -w /app golang:1.21 /bin/bash -c "go mod tidy && go test ./... -cover"
)

echo.
echo 🎉 Docker testing completed!
echo 💡 This method works around Windows CGO limitations
pause