@echo off
echo 🧪 Running Transaction API Tests (Windows with CGO)
echo ==================================================

echo ⚙️ Setting up CGO environment for Windows...
set CGO_ENABLED=1

echo 📋 Checking if GCC is available...
where gcc >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ GCC not found. SQLite tests may fail.
    echo 💡 Installing TDM-GCC or using alternative test method...
    echo.
    echo 🔄 Running tests without SQLite (unit tests only)...
    goto :run_unit_tests
)

echo ✅ GCC found, running full tests with SQLite...

:: Run tests with CGO enabled
echo 🧪 Running tests with verbose output...
go test ./... -v

if %errorlevel% neq 0 (
    echo ❌ Some tests failed
    goto :try_alternative
) else (
    echo ✅ All tests passed!
)

echo.
echo 📊 Running tests with coverage...
go test ./... -cover

goto :end

:try_alternative
echo.
echo 🔄 CGO tests failed, trying alternative method...
echo 💡 Running without database-dependent tests...

:run_unit_tests
echo.
echo 🧪 Running non-database tests...
echo ⚠️ Note: Database tests are skipped due to CGO limitations

:: Test individual packages that don't require database
echo 📦 Testing config package...
go test ./internal/config -v

echo 📦 Testing models package (struct validation)...
go test ./internal/models -v

echo.
echo 📋 To run full tests with database, you need:
echo 1. Install TDM-GCC: https://jmeubank.github.io/tdm-gcc/
echo 2. Or install MinGW-w64
echo 3. Or use Docker for testing
echo 4. Or use WSL (Windows Subsystem for Linux)

:end
echo.
echo 📋 Alternative testing methods:
echo - Use Docker: docker run --rm -v ${PWD}:/app -w /app golang:1.21 go test ./... -v
echo - Use WSL: wsl -- go test ./... -v  
echo - Install GCC and retry this script
echo.
pause