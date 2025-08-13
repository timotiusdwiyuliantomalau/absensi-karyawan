@echo off
echo 🚀 Transaction API Setup Script (Windows)
echo ==========================================

:: Check if Go is installed
go version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Go not found. Please install Go 1.21+ first.
    pause
    exit /b 1
)

:: Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker not found. Please install Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

:: Setup environment
echo ⚙️ Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file
) else (
    echo ✅ .env file already exists
)

:: Install Go dependencies
echo 📦 Installing Go dependencies...
go mod tidy
if %errorlevel% neq 0 (
    echo ❌ Failed to install Go dependencies
    pause
    exit /b 1
)
echo ✅ Go dependencies installed

:: Stop existing containers
echo 🛑 Stopping existing containers...
docker compose down -v 2>nul || docker-compose down -v 2>nul || echo No existing containers

:: Start MySQL
echo 🐳 Starting MySQL container...
docker compose up -d
if %errorlevel% neq 0 (
    docker-compose up -d
    if %errorlevel% neq 0 (
        echo ❌ Failed to start MySQL container
        pause
        exit /b 1
    )
)
echo ✅ MySQL container started

:: Wait for MySQL to be ready
echo ⏳ Waiting for MySQL to be ready...
timeout /t 30 /nobreak >nul

:: Test database connection
echo 🔗 Testing database connection...
docker exec transaction_mysql mysql -u app_user -ppassword -e "USE transaction_db; SELECT 1;" 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ app_user connection failed, trying root...
    docker exec transaction_mysql mysql -u root -ppassword -e "USE transaction_db; SELECT 1;" 2>nul
    if %errorlevel% neq 0 (
        echo ❌ Database connection failed
        echo 🔍 Creating user manually...
        docker exec transaction_mysql mysql -u root -ppassword -e "CREATE USER IF NOT EXISTS 'app_user'@'%%' IDENTIFIED BY 'password'; GRANT ALL PRIVILEGES ON transaction_db.* TO 'app_user'@'%%'; FLUSH PRIVILEGES;"
    ) else (
        echo ✅ Database connection successful (root)
        echo ⚠️ Consider using .env.root for root user
    )
) else (
    echo ✅ Database connection successful (app_user)
)

:: Run tests
echo 🧪 Running tests...
go test ./... -v
if %errorlevel% neq 0 (
    echo ⚠️ Some tests failed, but continuing...
) else (
    echo ✅ All tests passed
)

echo.
echo 🎉 Setup completed!
echo.
echo 📋 Next steps:
echo 1. Start the application: go run cmd/server/main.go
echo 2. Test the API: curl http://localhost:8080/health
echo 3. If connection fails, try: copy .env.root .env
echo.
echo 🔍 Useful commands:
echo - View logs: docker logs transaction_mysql
echo - Connect to DB: docker exec -it transaction_mysql mysql -u root -ppassword
echo - Stop services: docker compose down
echo.
pause