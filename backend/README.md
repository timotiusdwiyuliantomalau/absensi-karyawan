# Transaction API

Backend sistem sederhana untuk mengelola transaksi yang dibangun menggunakan Golang, Gin Gonic, GORM, dan MySQL. Sistem ini menyediakan RESTful API untuk operasi CRUD transaksi dan dashboard summary untuk analisis data.

## 🚀 Fitur

- **RESTful API** untuk manajemen transaksi
- **CRUD operations** lengkap (Create, Read, Update, Delete)
- **Dashboard summary** dengan data agregat
- **Pagination** untuk daftar transaksi
- **Filtering** berdasarkan UserID dan Status
- **Logging** menggunakan Logrus
- **Error handling** yang konsisten
- **Unit testing** dengan coverage tinggi
- **Database migration** otomatis
- **Graceful shutdown**

## 🛠 Teknologi

- **Go** 1.21+
- **Gin Gonic** - Web framework
- **GORM** - ORM library
- **MySQL** 8.0 - Database
- **Logrus** - Logging
- **Testify** - Testing framework
- **Docker** - Containerization

## 📋 Requirements

- Go 1.21 atau lebih baru
- MySQL 8.0
- Docker & Docker Compose (opsional)

> **🪟 Windows Users:** Lihat [WINDOWS_SETUP.md](WINDOWS_SETUP.md) untuk panduan khusus Windows dengan batch files dan PowerShell scripts.

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Environment Setup

Copy file environment:
```bash
cp .env.example .env
```

Edit `.env` sesuai dengan konfigurasi database Anda:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=transaction_db

# Server Configuration
SERVER_PORT=8080
GIN_MODE=debug

# Log Configuration
LOG_LEVEL=info
```

### 3. Database Setup (Menggunakan Docker)

**Opsi A: Gunakan Docker Compose** (Port 3307 untuk menghindari konflik)
```bash
docker-compose up -d
```

**Jika Port 3306 Sudah Digunakan:**
- Docker sudah menggunakan port 3307 secara default
- Aplikasi sudah dikonfigurasi untuk menggunakan port 3307
- Jika masih ada masalah, lihat `SETUP_GUIDE.md`

**Opsi B: Setup MySQL Manual**
```sql
CREATE DATABASE transaction_db;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON transaction_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```

> **⚠️ Troubleshooting:** Jika mengalami masalah setup, baca `SETUP_GUIDE.md` untuk panduan lengkap.

### 4. Install Dependencies

```bash
go mod tidy
```

### 5. Run Application

```bash
go run cmd/server/main.go
```

Server akan berjalan di `http://localhost:8080`

## 🔍 Testing

Jalankan unit tests:
```bash
go test ./... -v
```

Jalankan tests dengan coverage:
```bash
go test ./... -cover
```

Generate coverage report:
```bash
go test ./... -coverprofile=coverage.out
go tool cover -html=coverage.out -o coverage.html
```

## 📖 API Documentation

### Base URL
```
http://localhost:8080
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "transaction-api",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### 2. Create Transaction
```http
POST /transactions
Content-Type: application/json

{
  "user_id": 1,
  "amount": 100.50
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "amount": 100.50,
  "status": "pending",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### 3. Get All Transactions
```http
GET /transactions?page=1&limit=10&user_id=1&status=success
```

**Query Parameters:**
- `page` (int): Nomor halaman (default: 1)
- `limit` (int): Jumlah item per halaman (default: 10)
- `user_id` (int): Filter berdasarkan User ID
- `status` (string): Filter berdasarkan status (`pending`, `success`, `failed`)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "amount": 100.50,
      "status": "success",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "total_pages": 1
}
```

#### 4. Get Transaction by ID
```http
GET /transactions/{id}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "amount": 100.50,
  "status": "success",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### 5. Update Transaction Status
```http
PUT /transactions/{id}
Content-Type: application/json

{
  "status": "success"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "amount": 100.50,
  "status": "success",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### 6. Delete Transaction
```http
DELETE /transactions/{id}
```

**Response:**
```
204 No Content
```

#### 7. Dashboard Summary
```http
GET /dashboard/summary
```

**Response:**
```json
{
  "total_success_today": 5,
  "average_amount_per_user": 150.75,
  "total_transactions": 100,
  "recent_transactions": [
    {
      "id": 10,
      "user_id": 5,
      "amount": 200.00,
      "status": "success",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "total_amount": 15075.00,
  "total_amount_today": 753.75,
  "status_distribution": {
    "success": 80,
    "pending": 15,
    "failed": 5
  }
}
```

### API Versioning

API juga tersedia dengan versioning:
```
http://localhost:8080/api/v1/transactions
http://localhost:8080/api/v1/dashboard/summary
```

## 🗂 Struktur Project

```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # Entry point aplikasi
├── internal/
│   ├── config/
│   │   └── config.go              # Konfigurasi aplikasi
│   ├── database/
│   │   └── database.go            # Database connection & migration
│   ├── handlers/
│   │   ├── transaction_handler.go # HTTP handlers
│   │   └── transaction_handler_test.go # Handler tests
│   ├── middleware/
│   │   ├── error_handler.go       # Error handling middleware
│   │   └── logger.go              # Logging middleware
│   ├── models/
│   │   └── transaction.go         # Data models
│   └── services/
│       ├── transaction_service.go  # Business logic
│       └── transaction_service_test.go # Service tests
├── pkg/
│   └── utils/                     # Utility functions
├── docs/                          # API documentation
├── .env.example                   # Environment template
├── .env                          # Environment variables
├── docker-compose.yml            # Docker compose config
├── go.mod                        # Go modules
├── go.sum                        # Go modules checksum
└── README.md                     # Documentation
```

## 🧪 Testing Strategy

Project ini memiliki comprehensive test coverage yang mencakup:

### Unit Tests
- **Service Layer Tests**: Testing business logic
- **Handler Tests**: Testing HTTP endpoints
- **Integration Tests**: Testing database operations

### Test Coverage
Target coverage: **70%+**

```bash
# Run tests with coverage report
go test ./... -coverprofile=coverage.out
go tool cover -func coverage.out
```

### Test Data
Tests menggunakan SQLite in-memory database untuk isolasi dan performance.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | password |
| `DB_NAME` | Database name | transaction_db |
| `SERVER_PORT` | Server port | 8080 |
| `GIN_MODE` | Gin mode (debug/release) | debug |
| `LOG_LEVEL` | Log level | info |

### Logging

Application menggunakan structured logging dengan Logrus:
- **Format**: JSON
- **Levels**: debug, info, warn, error, fatal
- **Fields**: timestamp, level, message, dan context fields

## 🚀 Deployment

### Docker Deployment

1. Build image:
```bash
docker build -t transaction-api .
```

2. Run container:
```bash
docker run -p 8080:8080 --env-file .env transaction-api
```

### Production Considerations

1. **Environment**: Set `GIN_MODE=release`
2. **Database**: Gunakan connection pooling yang sesuai
3. **Logging**: Set log level ke `warn` atau `error`
4. **Security**: Implementasikan rate limiting dan authentication
5. **Monitoring**: Tambahkan health checks dan metrics

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

Jika ada pertanyaan atau issues, silakan:
- Buat issue di repository
- Contact: [email]

## 🔄 Changelog

### v1.0.0
- Initial release
- CRUD operations untuk transaksi
- Dashboard summary endpoint
- Unit testing dengan coverage tinggi
- Docker support
- Comprehensive documentation