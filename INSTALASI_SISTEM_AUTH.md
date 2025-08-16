# 🚀 Instalasi Sistem Autentikasi Laravel

## 📦 File yang Tersedia

**`laravel-auth-system.zip`** (99 KB) - Sistem autentikasi Laravel lengkap dengan JWT dan RBAC

## 🎯 Fitur yang Tersedia

✅ **JWT Authentication** - Token-based authentication yang aman  
✅ **Role-Based Access Control (RBAC)** - Manajemen role dan permission  
✅ **User Management** - CRUD operations untuk user  
✅ **Security Features** - Password hashing, rate limiting, validation  
✅ **API Endpoints** - RESTful API yang lengkap  
✅ **Documentation** - Dokumentasi API dan sistem yang lengkap  

## 📋 Prerequisites

Sebelum menginstall, pastikan sistem Anda memiliki:

- **PHP 8.1+** dengan ekstensi berikut:
  - php-cli
  - php-mbstring
  - php-xml
  - php-curl
  - php-mysql (atau php-sqlite3)
  - php-zip
- **Composer** - Package manager untuk PHP
- **Web Server** (Apache/Nginx) atau gunakan built-in server Laravel

## 🚀 Langkah Instalasi

### 1. Extract File ZIP

```bash
# Extract file ZIP ke direktori yang diinginkan
unzip laravel-auth-system.zip

# Masuk ke direktori proyek
cd laravel-auth-system
```

### 2. Install Dependencies

```bash
# Install semua package yang diperlukan
composer install
```

### 3. Setup Environment

```bash
# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret key
php artisan jwt:secret
```

### 4. Konfigurasi Database

Edit file `.env` dan sesuaikan konfigurasi database:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/your/database.sqlite

# Atau untuk MySQL
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel_auth
# DB_USERNAME=root
# DB_PASSWORD=
```

### 5. Setup Database

```bash
# Jalankan migration untuk membuat tabel
php artisan migrate:fresh

# Jalankan seeder untuk data default
php artisan db:seed
```

### 6. Set Permissions (Linux/Mac)

```bash
# Set permission untuk storage dan bootstrap/cache
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 7. Start Development Server

```bash
# Jalankan server development
php artisan serve

# Server akan berjalan di http://localhost:8000
```

## 🔐 Default Users

Setelah menjalankan seeder, sistem akan memiliki user default:

| Email | Password | Role |
|-------|----------|------|
| `superadmin@example.com` | `password123` | Super Admin |
| `admin@example.com` | `password123` | Admin |
| `manager@example.com` | `password123` | Manager |
| `user@example.com` | `password123` | User |
| `guest@example.com` | `password123` | Guest |

## 🧪 Testing Sistem

### 1. Health Check
```bash
curl http://localhost:8000/api/health
```

### 2. User Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

### 3. Test Protected Route
```bash
# Ganti YOUR_JWT_TOKEN dengan token yang didapat dari login
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 Dokumentasi Lengkap

Setelah instalasi, Anda dapat mengakses dokumentasi lengkap di:

- **README.md** - Dokumentasi sistem lengkap
- **API_DOCUMENTATION.md** - Referensi API yang detail
- **Laravel_Auth_System.postman_collection.json** - Collection Postman untuk testing

## 🌐 API Base URL

```
http://localhost:8000/api
```

## 🔧 Troubleshooting

### Masalah Umum:

1. **Composer Error**
   ```bash
   composer install --ignore-platform-reqs
   ```

2. **Permission Denied**
   ```bash
   sudo chmod -R 775 storage bootstrap/cache
   ```

3. **Database Connection Error**
   - Pastikan ekstensi database sudah terinstall
   - Check konfigurasi di file `.env`

4. **JWT Error**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

## 📁 Struktur File Penting

```
laravel-auth-system/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php      # Authentication
│   │   ├── UserController.php      # User management
│   │   └── RoleController.php      # Role management
│   ├── Http/Middleware/
│   │   ├── JWTAuthentication.php   # JWT auth
│   │   ├── CheckRole.php           # Role checking
│   │   ├── CheckPermission.php     # Permission checking
│   │   └── RateLimitMiddleware.php # Rate limiting
│   └── Models/
│       └── User.php                # User model
├── config/
│   ├── auth.php                    # Auth configuration
│   ├── jwt.php                     # JWT configuration
│   └── permission.php              # Permission configuration
├── database/
│   ├── migrations/                 # Database migrations
│   └── seeders/                    # Database seeders
├── routes/
│   └── api.php                     # API routes
└── README.md                       # Dokumentasi lengkap
```

## 🚀 Next Steps

Setelah instalasi berhasil:

1. **Customize Roles & Permissions** - Sesuaikan dengan kebutuhan aplikasi
2. **Add Business Logic** - Tambahkan logika bisnis sesuai kebutuhan
3. **Frontend Integration** - Integrasikan dengan frontend (Vue.js, React, dll)
4. **Production Deployment** - Deploy ke production server
5. **Monitoring & Logging** - Tambahkan monitoring dan logging

## 📞 Support

Jika mengalami masalah atau ada pertanyaan:

1. Check dokumentasi yang tersedia
2. Review error logs di `storage/logs/`
3. Pastikan semua prerequisites terpenuhi
4. Gunakan Postman collection untuk testing

## 🎉 Selamat!

Sistem autentikasi Laravel Anda telah siap digunakan! 🚀

---

**Note**: Sistem ini dirancang untuk production use dengan security yang ketat. Pastikan untuk review dan customize sesuai kebutuhan spesifik aplikasi Anda.