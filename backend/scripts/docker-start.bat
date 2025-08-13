@echo off
echo 🐳 Docker MySQL Management
echo ==========================

echo Select an option:
echo 1. Start MySQL container
echo 2. Stop MySQL container
echo 3. Restart MySQL container
echo 4. View MySQL logs
echo 5. Connect to MySQL
echo 6. Remove all containers and volumes
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo 🚀 Starting MySQL container...
    docker compose up -d
    echo ✅ MySQL container started on port 3307
    echo 🔗 Connection: localhost:3307
    echo 👤 Users: root/app_user, Password: password
)

if "%choice%"=="2" (
    echo 🛑 Stopping MySQL container...
    docker compose down
    echo ✅ MySQL container stopped
)

if "%choice%"=="3" (
    echo 🔄 Restarting MySQL container...
    docker compose restart mysql
    echo ✅ MySQL container restarted
)

if "%choice%"=="4" (
    echo 📋 MySQL container logs:
    docker logs transaction_mysql
)

if "%choice%"=="5" (
    echo 🔗 Connecting to MySQL as root...
    echo Type 'exit' to quit MySQL
    docker exec -it transaction_mysql mysql -u root -ppassword
)

if "%choice%"=="6" (
    echo ⚠️ This will remove all containers and data!
    set /p confirm="Are you sure? (y/N): "
    if /i "%confirm%"=="y" (
        echo 🗑️ Removing all containers and volumes...
        docker compose down -v
        echo ✅ All containers and data removed
    ) else (
        echo ❌ Operation cancelled
    )
)

echo.
pause