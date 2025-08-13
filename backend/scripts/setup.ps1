# PowerShell script for Transaction API setup
Write-Host "🚀 Transaction API Setup Script (PowerShell)" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "go")) {
    Write-Host "❌ Go not found. Please install Go 1.21+ first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (-not (Test-Command "docker")) {
    Write-Host "❌ Docker not found. Please install Docker Desktop first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green

# Setup environment
Write-Host "⚙️ Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Install Go dependencies
Write-Host "📦 Installing Go dependencies..." -ForegroundColor Yellow
$result = & go mod tidy
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Go dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Go dependencies installed" -ForegroundColor Green

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
try {
    & docker compose down -v 2>$null
} catch {
    try {
        & docker-compose down -v 2>$null
    } catch {
        Write-Host "No existing containers" -ForegroundColor Gray
    }
}

# Start MySQL
Write-Host "🐳 Starting MySQL container..." -ForegroundColor Yellow
try {
    & docker compose up -d
} catch {
    & docker-compose up -d
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start MySQL container" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ MySQL container started" -ForegroundColor Green

# Wait for MySQL to be ready
Write-Host "⏳ Waiting for MySQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Test database connection
Write-Host "🔗 Testing database connection..." -ForegroundColor Yellow
$appUserTest = & docker exec transaction_mysql mysql -u app_user -ppassword -e "USE transaction_db; SELECT 1;" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ app_user connection failed, trying root..." -ForegroundColor Yellow
    $rootTest = & docker exec transaction_mysql mysql -u root -ppassword -e "USE transaction_db; SELECT 1;" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Database connection failed" -ForegroundColor Red
        Write-Host "🔍 Creating user manually..." -ForegroundColor Yellow
        & docker exec transaction_mysql mysql -u root -ppassword -e "CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'password'; GRANT ALL PRIVILEGES ON transaction_db.* TO 'app_user'@'%'; FLUSH PRIVILEGES;"
    } else {
        Write-Host "✅ Database connection successful (root)" -ForegroundColor Green
        Write-Host "⚠️ Consider using .env.root for root user" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Database connection successful (app_user)" -ForegroundColor Green
}

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Yellow
& go test ./... -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Some tests failed, but continuing..." -ForegroundColor Yellow
} else {
    Write-Host "✅ All tests passed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the application: go run cmd/server/main.go" -ForegroundColor White
Write-Host "2. Test the API: curl http://localhost:8080/health" -ForegroundColor White
Write-Host "3. If connection fails, try: Copy-Item .env.root .env" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Useful commands:" -ForegroundColor Cyan
Write-Host "- View logs: docker logs transaction_mysql" -ForegroundColor White
Write-Host "- Connect to DB: docker exec -it transaction_mysql mysql -u root -ppassword" -ForegroundColor White
Write-Host "- Stop services: docker compose down" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"