# 🚀 Setup Guide & Troubleshooting

## 📋 Prerequisites Check

Sebelum memulai, pastikan sistem Anda sudah memiliki:

```bash
# Check Go version
go version  # Should be 1.21+

# Check Docker
docker --version
docker-compose --version

# Check if port 3306 is being used
netstat -an | grep 3306
# atau
lsof -i :3306
```

## 🛠 Setup Options

### Option 1: Docker MySQL (Recommended)

1. **Stop existing MySQL service** (jika ada):
```bash
# Windows
net stop mysql

# Linux/Mac
sudo systemctl stop mysql
# atau
sudo service mysql stop
```

2. **Start with Docker**:
```bash
# Gunakan port 3307 untuk menghindari konflik
docker-compose up -d

# Check status
docker-compose ps

# Check logs
docker-compose logs mysql
```

3. **Update .env file**:
```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=password
DB_NAME=transaction_db
```

### Option 2: Use Existing MySQL

Jika Anda sudah memiliki MySQL di port 3306:

1. **Update .env file**:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=transaction_db
```

2. **Create database manually**:
```sql
CREATE DATABASE IF NOT EXISTS transaction_db;
CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON transaction_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

### Option 3: Different Port for Docker

```bash
# Edit docker-compose.yml to use different port (e.g., 3308)
# Then update .env accordingly
```

## 🚀 Running the Application

1. **Install dependencies**:
```bash
go mod tidy
```

2. **Run tests** (optional):
```bash
make test
```

3. **Start the application**:
```bash
make run
# atau
go run cmd/server/main.go
```

4. **Test the API**:
```bash
# Health check
curl http://localhost:8080/health

# Create transaction
curl -X POST http://localhost:8080/transactions \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "amount": 100.50}'
```

## 🔧 Common Issues & Solutions

### Issue 1: Port Already in Use
```
Error: bind: Only one usage of each socket address is normally permitted
```

**Solutions:**
- Use different port (3307, 3308, etc.)
- Stop existing MySQL service
- Kill process using the port

### Issue 2: Docker Permission Issues (Linux)
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Issue 3: MySQL Connection Refused
```bash
# Wait for MySQL to be ready
docker-compose logs mysql

# Check if container is running
docker ps

# Restart if needed
docker-compose restart mysql
```

### Issue 4: Go Module Issues
```bash
# Clean and reinstall
go clean -modcache
go mod download
go mod tidy
```

## 🧪 Testing Database Connection

```bash
# Test MySQL connection
mysql -h localhost -P 3307 -u root -p

# Or using Docker
docker exec -it transaction_mysql mysql -u root -p
```

## 📊 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | Database host | localhost | Yes |
| `DB_PORT` | Database port | 3307 | Yes |
| `DB_USER` | Database user | root | Yes |
| `DB_PASSWORD` | Database password | password | Yes |
| `DB_NAME` | Database name | transaction_db | Yes |
| `SERVER_PORT` | API server port | 8080 | No |
| `GIN_MODE` | Gin mode | debug | No |
| `LOG_LEVEL` | Log level | info | No |

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart MySQL
docker-compose restart mysql

# Remove everything (including data)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

## 🔍 Health Checks

1. **Database Health**:
```bash
# Via API
curl http://localhost:8080/health

# Direct MySQL check
docker exec transaction_mysql mysqladmin ping -h localhost -u root -p
```

2. **Application Health**:
```bash
# Check if server is running
curl -I http://localhost:8080/health

# Check logs
docker logs transaction_mysql
```

## 📱 API Testing with Postman

1. Import `docs/postman-collection.json`
2. Set environment variable `base_url` to `http://localhost:8080`
3. Test all endpoints

## 🛡️ Security Notes

- Change default passwords in production
- Use environment-specific .env files
- Don't commit .env files to version control
- Consider using Docker secrets for sensitive data

## 📞 Need Help?

Jika masih mengalami masalah:

1. Check logs: `docker-compose logs mysql`
2. Verify ports: `netstat -an | grep 3307`
3. Test connection: `telnet localhost 3307`
4. Review this guide again
5. Create an issue dengan detail error message