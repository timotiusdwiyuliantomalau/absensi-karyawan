@echo off
echo 🧪 Running Transaction API Tests (Windows)
echo ==========================================

echo ⚙️ Checking for CGO/SQLite compatibility...
set CGO_ENABLED=1

:: Try running tests with CGO first
echo 🔄 Attempting full tests with CGO...
go test ./... -v 2>test_error.log

if %errorlevel% neq 0 (
    echo ⚠️ CGO tests failed (likely SQLite issue on Windows)
    echo.
    echo 📋 Available alternatives:
    echo 1. Docker tests (recommended)
    echo 2. Windows CGO setup  
    echo 3. Mock tests only
    echo.
    
    set /p choice="Choose option (1/2/3): "
    
    if "%choice%"=="1" (
        echo 🐳 Running Docker-based tests...
        call scripts\test-docker.bat
        goto :end
    )
    
    if "%choice%"=="2" (
        echo 🔧 Running Windows CGO tests...
        call scripts\test-windows.bat
        goto :end
    )
    
    if "%choice%"=="3" (
        echo 🧪 Running mock tests only...
        goto :mock_tests
    )
    
    echo 🐳 Defaulting to Docker tests...
    call scripts\test-docker.bat
    goto :end
) else (
    echo ✅ Full tests passed!
    echo 📊 Running coverage...
    go test ./... -cover
    goto :end
)

:mock_tests
echo 🧪 Running Windows-compatible mock tests...
go test ./internal/config -v
go test ./internal/models -v
echo.
echo ⚠️ Note: Database integration tests skipped
echo 💡 For full testing, use Docker: scripts\test-docker.bat

:end
echo.
echo 📋 Test completion summary:
echo - For full coverage: Use Docker testing
echo - For quick validation: Mock tests work
echo - Setup CGO: Install TDM-GCC or MinGW-w64
echo.

:: Clean up
if exist test_error.log del test_error.log

pause