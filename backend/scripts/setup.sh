#!/bin/bash

echo "🚀 Transaction API Setup Script"
echo "================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command_exists go; then
    echo "❌ Go not found. Please install Go 1.21+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup environment
echo "⚙️ Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Install Go dependencies
echo "📦 Installing Go dependencies..."
go mod tidy
if [ $? -eq 0 ]; then
    echo "✅ Go dependencies installed"
else
    echo "❌ Failed to install Go dependencies"
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down -v 2>/dev/null || docker-compose down -v 2>/dev/null || echo "No existing containers"

# Start MySQL
echo "🐳 Starting MySQL container..."
if command_exists "docker compose"; then
    docker compose up -d
else
    docker-compose up -d
fi

if [ $? -eq 0 ]; then
    echo "✅ MySQL container started"
else
    echo "❌ Failed to start MySQL container"
    exit 1
fi

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
for i in {1..30}; do
    if docker exec transaction_mysql mysqladmin ping -h localhost -u root -ppassword 2>/dev/null; then
        echo "✅ MySQL is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ MySQL failed to start within 30 seconds"
        echo "🔍 Checking logs:"
        docker logs transaction_mysql
        exit 1
    fi
    sleep 1
done

# Test database connection
echo "🔗 Testing database connection..."
if docker exec transaction_mysql mysql -u app_user -ppassword -e "USE transaction_db; SELECT 1;" 2>/dev/null; then
    echo "✅ Database connection successful (app_user)"
elif docker exec transaction_mysql mysql -u root -ppassword -e "USE transaction_db; SELECT 1;" 2>/dev/null; then
    echo "✅ Database connection successful (root)"
    echo "⚠️  Consider using .env.root for root user"
else
    echo "❌ Database connection failed"
    echo "🔍 Trying to create user manually..."
    docker exec transaction_mysql mysql -u root -ppassword -e "
        CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY 'password';
        GRANT ALL PRIVILEGES ON transaction_db.* TO 'app_user'@'%';
        FLUSH PRIVILEGES;
    "
fi

# Run tests
echo "🧪 Running tests..."
go test ./... -v
if [ $? -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "⚠️  Some tests failed, but continuing..."
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start the application: go run cmd/server/main.go"
echo "2. Test the API: curl http://localhost:8080/health"
echo "3. If connection fails, try: cp .env.root .env"
echo ""
echo "🔍 Useful commands:"
echo "- View logs: docker logs transaction_mysql"
echo "- Connect to DB: docker exec -it transaction_mysql mysql -u root -ppassword"
echo "- Stop services: docker compose down"
echo ""