# 🪟 Windows Setup Guide

## 🚀 Quick Start untuk Windows

Karena Windows tidak memiliki `make` secara default, kami menyediakan batch files dan PowerShell scripts sebagai alternatif.

### 📋 Prerequisites

1. **Go 1.21+** - [Download](https://golang.org/dl/)
2. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
3. **Git** (opsional) - [Download](https://git-scm.com/download/win)

### 🎯 Option 1: Automated Setup (Recommended)

#### Using Batch File (Command Prompt)
```cmd
# Buka Command Prompt dan jalankan:
cd backend
scripts\setup.bat
```

#### Using PowerShell
```powershell
# Buka PowerShell dan jalankan:
cd backend
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\setup.ps1
```

### 🎯 Option 2: Manual Setup

#### 1. Setup Environment
```cmd
copy .env.example .env
```

#### 2. Install Dependencies
```cmd
go mod tidy
```

#### 3. Start MySQL
```cmd
docker compose up -d
```

#### 4. Run Tests
```cmd
scripts\test.bat
# atau manual:
go test ./... -v
```

#### 5. Start Application
```cmd
scripts\run.bat
# atau manual:
go run cmd/server/main.go
```

## 📁 Windows Scripts yang Tersedia

| Script | Fungsi | Equivalent Make Command |
|--------|--------|-------------------------|
| `scripts\setup.bat` | Automated setup | `make setup` |
| `scripts\test.bat` | Run tests | `make test` |
| `scripts\build.bat` | Build application | `make build` |
| `scripts\run.bat` | Start server | `make run` |
| `scripts\docker-start.bat` | Docker management | `make docker-up/down` |
| `scripts\setup.ps1` | PowerShell setup | `make setup` |

## 🔧 Common Windows Issues

### Issue 1: Make Command Not Found
```
make : The term 'make' is not recognized...
```

**Solutions:**
```cmd
# Use batch files instead:
scripts\test.bat        # Instead of: make test
scripts\build.bat       # Instead of: make build
scripts\run.bat         # Instead of: make run
scripts\setup.bat       # Instead of: make setup
```

### Issue 2: PowerShell Execution Policy
```
cannot be loaded because running scripts is disabled on this system
```

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: Docker Desktop Not Running
```
error during connect: This error may indicate that the docker daemon is not running
```

**Solution:**
1. Start Docker Desktop dari Start Menu
2. Wait for Docker to be ready (whale icon in system tray)
3. Run script again

### Issue 4: Port 3306 Already in Use
**Solution:** Project sudah dikonfigurasi menggunakan port 3307

### Issue 5: CGO/SQLite Error (Windows Specific)
```
Binary was compiled with 'CGO_ENABLED=0', go-sqlite3 requires cgo to work
```

**Root Cause:** Windows Go builds often have CGO disabled by default, but SQLite requires CGO.

**Solutions:**
```cmd
# Option A: Use Docker for testing (Recommended)
scripts\test-docker.bat

# Option B: Install GCC and enable CGO
# Install TDM-GCC: https://jmeubank.github.io/tdm-gcc/
set CGO_ENABLED=1
scripts\test-windows.bat

# Option C: Use mock tests only
go test ./internal/config -v
go test ./internal/models -v

# Option D: Use WSL (Windows Subsystem for Linux)
wsl -- go test ./... -v
```

### Issue 6: Database Access Denied
**Solutions:**
```cmd
# Option A: Use app_user (default .env)
# File .env already configured

# Option B: Use root user
copy .env.root .env

# Option C: Reset containers
docker compose down -v
docker compose up -d
```

## 🎮 Interactive Docker Management

Jalankan script interaktif untuk manage Docker:
```cmd
scripts\docker-start.bat
```

Menu options:
1. Start MySQL container
2. Stop MySQL container  
3. Restart MySQL container
4. View MySQL logs
5. Connect to MySQL
6. Remove all containers and volumes

## 🧪 Testing Commands (Windows Solutions)

### Option 1: Smart Testing Script (Recommended)
```cmd
# Automatically detects CGO issues and provides solutions
scripts\test.bat
```

### Option 2: Docker Testing (Most Reliable)
```cmd
# Runs tests in Linux container with full CGO support
scripts\test-docker.bat
```

### Option 3: Windows CGO Setup
```cmd
# If you have GCC installed (TDM-GCC/MinGW-w64)
scripts\test-windows.bat
```

### Option 4: Mock/Unit Tests Only
```cmd
# Quick validation without database integration
go test ./internal/config -v
go test ./internal/models -v
```

### Coverage Analysis
```cmd
# Docker-based coverage (most accurate)
docker run --rm -v "%cd%":/app -w /app golang:1.21 go test ./... -cover

# Local coverage (if CGO works)
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out -o coverage.html
```

## 🔨 Build Commands

```cmd
# Build executable
scripts\build.bat

# Manual build
go build -o transaction-api.exe cmd/server/main.go

# Run executable
transaction-api.exe
```

## 🌐 API Testing

```cmd
# Health check (install curl atau gunakan PowerShell)
curl http://localhost:8080/health

# PowerShell alternative
Invoke-RestMethod -Uri "http://localhost:8080/health"

# Create transaction
curl -X POST http://localhost:8080/transactions -H "Content-Type: application/json" -d "{\"user_id\": 1, \"amount\": 100.50}"
```

## 📱 Using Postman

1. Import `docs\postman-collection.json`
2. Set environment variable `base_url` = `http://localhost:8080`
3. Test all endpoints

## 🔍 Troubleshooting Commands

```cmd
# Check Go version
go version

# Check Docker
docker --version
docker ps

# Check MySQL container
docker logs transaction_mysql

# Test MySQL connection
docker exec -it transaction_mysql mysql -u root -ppassword

# Check if ports are in use
netstat -an | findstr :3307
netstat -an | findstr :8080
```

## 🚀 Production Build

```cmd
# Build for production
set GOOS=linux
set GOARCH=amd64
go build -o transaction-api cmd/server/main.go

# Build for Windows
set GOOS=windows
set GOARCH=amd64
go build -o transaction-api.exe cmd/server/main.go
```

## 📝 Tips untuk Windows Users

1. **Use Git Bash** untuk Linux-like commands
2. **Install Windows Terminal** untuk better terminal experience
3. **Use VSCode** dengan Go extension
4. **Enable WSL2** untuk better Docker performance
5. **Use PowerShell** sebagai alternative yang lebih powerful

## 🔗 Useful Links

- [Go Windows Installation](https://golang.org/doc/install)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/)
- [Windows Terminal](https://aka.ms/terminal)
- [Git for Windows](https://gitforwindows.org/)
- [Visual Studio Code](https://code.visualstudio.com/)

## 💡 Alternative: Install Make on Windows

Jika Anda ingin menggunakan `make`:

### Option A: Chocolatey
```cmd
# Install Chocolatey first, then:
choco install make
```

### Option B: Scoop
```cmd
# Install Scoop first, then:
scoop install make
```

### Option C: WSL (Windows Subsystem for Linux)
```cmd
# Enable WSL2 and install Ubuntu
wsl --install
# Then use Linux commands inside WSL
```

Setelah install make, semua `make` commands akan bekerja normal di Windows!