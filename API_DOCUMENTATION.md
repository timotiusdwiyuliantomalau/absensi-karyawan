# API Documentation - Laravel Authentication System

## Overview

Sistem autentikasi Laravel yang lengkap dengan JWT, RBAC (Role-Based Access Control), dan permission management. API ini menyediakan endpoint untuk autentikasi, manajemen user, role, dan permission.

## Base URL

```
http://localhost:8000/api
```

## Authentication

API menggunakan JWT (JSON Web Token) untuk autentikasi. Setelah login berhasil, Anda akan menerima access token yang harus disertakan di header `Authorization` untuk setiap request yang memerlukan autentikasi.

### Header Format
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

Semua API responses menggunakan format yang konsisten:

### Success Response
```json
{
    "status": "success",
    "message": "Operation completed successfully",
    "data": {
        // Response data
    }
}
```

### Error Response
```json
{
    "status": "error",
    "message": "Error description",
    "errors": {
        // Validation errors (if any)
    }
}
```

## Public Routes

### 1. Health Check
**GET** `/health`

Endpoint untuk memeriksa status API.

**Response:**
```json
{
    "status": "success",
    "message": "API is running",
    "timestamp": "2025-08-16T09:35:00.000000Z",
    "version": "1.0.0"
}
```

### 2. User Login
**POST** `/auth/login`

Endpoint untuk login user.

**Request Body:**
```json
{
    "email": "admin@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Login successful",
    "data": {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "token_type": "bearer",
        "expires_in": 3600,
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@example.com",
            "phone": "+1234567891",
            "address": "456 Admin Avenue, Admin City",
            "roles": ["Admin"],
            "permissions": ["user.view", "user.create", "user.edit"]
        }
    }
}
```

### 3. User Register
**POST** `/auth/register`

Endpoint untuk registrasi user baru.

**Request Body:**
```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "+1234567890",
    "address": "Test Address"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 2,
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "address": "Test Address",
            "roles": ["User"]
        }
    }
}
```

### 4. Forgot Password
**POST** `/auth/forgot-password`

Endpoint untuk mengirim link reset password.

**Request Body:**
```json
{
    "email": "admin@example.com"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Password reset link sent to your email"
}
```

### 5. Reset Password
**POST** `/auth/reset-password`

Endpoint untuk reset password.

**Request Body:**
```json
{
    "token": "reset-token-here",
    "email": "admin@example.com",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Password reset successfully"
}
```

## Protected Routes

Semua route di bawah ini memerlukan autentikasi JWT.

### Authentication Routes

#### 1. Get User Profile
**GET** `/auth/me`

Mendapatkan informasi user yang sedang login.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@example.com",
            "phone": "+1234567891",
            "address": "456 Admin Avenue, Admin City",
            "is_active": true,
            "last_login_at": "2025-08-16T09:35:00.000000Z",
            "last_login_ip": "127.0.0.1",
            "roles": ["Admin"],
            "permissions": ["user.view", "user.create", "user.edit"],
            "created_at": "2025-08-16T09:30:00.000000Z",
            "updated_at": "2025-08-16T09:35:00.000000Z"
        }
    }
}
```

#### 2. Refresh Token
**POST** `/auth/refresh`

Refresh access token yang sudah expired.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "access_token": "new-jwt-token-here",
        "token_type": "bearer",
        "expires_in": 3600
    }
}
```

#### 3. Change Password
**POST** `/auth/change-password`

Mengubah password user yang sedang login.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "current_password": "password123",
    "new_password": "newpassword123",
    "new_password_confirmation": "newpassword123"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Password changed successfully"
}
```

#### 4. Logout
**POST** `/auth/logout`

Logout user dan invalidate token.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "Successfully logged out"
}
```

### User Management Routes

#### 1. Get All Users
**GET** `/users`

Mendapatkan daftar semua user (memerlukan permission `user.view`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**
- `search` - Pencarian berdasarkan nama, email, atau phone
- `role` - Filter berdasarkan role
- `status` - Filter berdasarkan status (active/inactive)
- `per_page` - Jumlah item per halaman (default: 15)

**Response:**
```json
{
    "status": "success",
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "name": "Admin User",
                "email": "admin@example.com",
                "phone": "+1234567891",
                "address": "456 Admin Avenue, Admin City",
                "is_active": true,
                "roles": [
                    {
                        "id": 2,
                        "name": "Admin"
                    }
                ],
                "permissions": [
                    {
                        "id": 1,
                        "name": "user.view"
                    }
                ]
            }
        ],
        "total": 1,
        "per_page": 15
    }
}
```

#### 2. Create User
**POST** `/users`

Membuat user baru (memerlukan permission `user.create`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "+1234567890",
    "address": "New User Address",
    "roles": ["User"]
}
```

**Response:**
```json
{
    "status": "success",
    "message": "User created successfully",
    "data": {
        "id": 3,
        "name": "New User",
        "email": "newuser@example.com",
        "phone": "+1234567890",
        "address": "New User Address",
        "is_active": true,
        "roles": [
            {
                "id": 3,
                "name": "User"
            }
        ],
        "permissions": [
            {
                "id": 9,
                "name": "profile.view"
            }
        ]
    }
}
```

#### 3. Get User by ID
**GET** `/users/{id}`

Mendapatkan informasi user berdasarkan ID (memerlukan permission `user.view`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "phone": "+1234567891",
        "address": "456 Admin Avenue, Admin City",
        "is_active": true,
        "roles": [
            {
                "id": 2,
                "name": "Admin"
            }
        ],
        "permissions": [
            {
                "id": 1,
                "name": "user.view"
            }
        ]
    }
}
```

#### 4. Update User
**PUT** `/users/{id}`

Mengupdate informasi user (memerlukan permission `user.edit`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "Updated User Name",
    "phone": "+0987654321",
    "address": "Updated Address",
    "roles": ["Admin", "Manager"]
}
```

**Response:**
```json
{
    "status": "success",
    "message": "User updated successfully",
    "data": {
        "id": 1,
        "name": "Updated User Name",
        "email": "admin@example.com",
        "phone": "+0987654321",
        "address": "Updated Address",
        "is_active": true,
        "roles": [
            {
                "id": 2,
                "name": "Admin"
            },
            {
                "id": 4,
                "name": "Manager"
            }
        ],
        "permissions": [
            {
                "id": 1,
                "name": "user.view"
            }
        ]
    }
}
```

#### 5. Activate User
**POST** `/users/{id}/activate`

Mengaktifkan user account (memerlukan permission `user.activate`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "User activated successfully"
}
```

#### 6. Deactivate User
**POST** `/users/{id}/deactivate`

Mendeaktifkan user account (memerlukan permission `user.deactivate`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "User deactivated successfully"
}
```

#### 7. Delete User
**DELETE** `/users/{id}`

Menghapus user (memerlukan permission `user.delete`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "User deleted successfully"
}
```

#### 8. Get Available Roles
**GET** `/users/roles/available`

Mendapatkan daftar role yang tersedia.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "name": "Super Admin"
        },
        {
            "id": 2,
            "name": "Admin"
        },
        {
            "id": 3,
            "name": "User"
        }
    ]
}
```

#### 9. Update Profile
**PUT** `/users/profile/update`

Mengupdate profile user yang sedang login (memerlukan permission `profile.edit`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "Updated Name",
    "phone": "+0987654321",
    "address": "Updated Address"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Profile updated successfully",
    "data": {
        "id": 1,
        "name": "Updated Name",
        "email": "admin@example.com",
        "phone": "+0987654321",
        "address": "Updated Address"
    }
}
```

### Role Management Routes

#### 1. Get All Roles
**GET** `/roles`

Mendapatkan daftar semua role (memerlukan permission `role.view`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "name": "Super Admin",
            "permissions": [
                {
                    "id": 1,
                    "name": "user.view"
                }
            ]
        }
    ]
}
```

#### 2. Create Role
**POST** `/roles`

Membuat role baru (memerlukan permission `role.create`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "Editor",
    "permissions": ["content.view", "content.create", "content.edit"]
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Role created successfully",
    "data": {
        "id": 5,
        "name": "Editor",
        "permissions": [
            {
                "id": 10,
                "name": "content.view"
            },
            {
                "id": 11,
                "name": "content.create"
            },
            {
                "id": 12,
                "name": "content.edit"
            }
        ]
    }
}
```

#### 3. Get Role by ID
**GET** `/roles/{id}`

Mendapatkan informasi role berdasarkan ID (memerlukan permission `role.view`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "id": 2,
        "name": "Admin",
        "permissions": [
            {
                "id": 1,
                "name": "user.view"
            }
        ]
    }
}
```

#### 4. Update Role
**PUT** `/roles/{id}`

Mengupdate informasi role (memerlukan permission `role.edit`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "Senior Editor",
    "permissions": ["content.view", "content.create", "content.edit", "content.delete"]
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Role updated successfully",
    "data": {
        "id": 5,
        "name": "Senior Editor",
        "permissions": [
            {
                "id": 10,
                "name": "content.view"
            },
            {
                "id": 11,
                "name": "content.create"
            },
            {
                "id": 12,
                "name": "content.edit"
            },
            {
                "id": 13,
                "name": "content.delete"
            }
        ]
    }
}
```

#### 5. Delete Role
**DELETE** `/roles/{id}`

Menghapus role (memerlukan permission `role.delete`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "Role deleted successfully"
}
```

#### 6. Get Available Permissions
**GET** `/roles/permissions/available`

Mendapatkan daftar permission yang tersedia.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "name": "user.view"
        },
        {
            "id": 2,
            "name": "user.create"
        }
    ]
}
```

#### 7. Assign Role to User
**POST** `/roles/assign`

Menugaskan role kepada user (memerlukan permission `role.assign`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "user_id": 1,
    "roles": ["Admin", "Manager"]
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Roles assigned successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@example.com",
            "roles": [
                {
                    "id": 2,
                    "name": "Admin"
                },
                {
                    "id": 4,
                    "name": "Manager"
                }
            ],
            "permissions": [
                {
                    "id": 1,
                    "name": "user.view"
                }
            ]
        }
    }
}
```

### Dashboard Routes

#### 1. Admin Dashboard
**GET** `/admin/dashboard`

Dashboard untuk Admin dan Super Admin.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "Welcome to Admin Dashboard",
    "data": {
        "total_users": 5,
        "active_users": 4,
        "total_roles": 3,
        "total_permissions": 14
    }
}
```

#### 2. Manager Dashboard
**GET** `/manager/dashboard`

Dashboard untuk Manager, Admin, dan Super Admin.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "Welcome to Manager Dashboard",
    "data": {
        "total_users": 5,
        "active_users": 4
    }
}
```

#### 3. User Dashboard
**GET** `/user/dashboard`

Dashboard untuk semua user yang terautentikasi.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "Welcome to User Dashboard",
    "data": {
        "user": {
            "id": 1,
            "name": "Admin User",
            "email": "admin@example.com",
            "phone": "+1234567891",
            "address": "456 Admin Avenue, Admin City"
        },
        "roles": ["Admin"],
        "permissions": ["user.view", "user.create", "user.edit"]
    }
}
```

#### 4. Public Content
**GET** `/public/content`

Konten yang dapat diakses oleh semua user yang terautentikasi.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "Public content accessible to all authenticated users",
    "data": {
        "content": "This is public content that all authenticated users can access.",
        "timestamp": "2025-08-16T09:35:00.000000Z"
    }
}
```

### Content Management Routes

#### 1. Create Content
**POST** `/content`

Membuat konten baru (memerlukan permission `content.create`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "content": "This is a test content"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Content created successfully",
    "data": {
        "content": "This is a test content",
        "created_by": "Admin User",
        "created_at": "2025-08-16T09:35:00.000000Z"
    }
}
```

#### 2. Update Content
**PUT** `/content/{id}`

Mengupdate konten (memerlukan permission `content.edit`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "content": "This is updated content"
}
```

**Response:**
```json
{
    "status": "success",
    "message": "Content updated successfully",
    "data": {
        "id": 1,
        "content": "This is updated content",
        "updated_by": "Admin User",
        "updated_at": "2025-08-16T09:35:00.000000Z"
    }
}
```

#### 3. Delete Content
**DELETE** `/content/{id}`

Menghapus konten (memerlukan permission `content.delete`).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "Content deleted successfully",
    "data": {
        "id": 1,
        "deleted_by": "Admin User",
        "deleted_at": "2025-08-16T09:35:00.000000Z"
    }
}
```

### System Routes

#### 1. System Info
**GET** `/system/info`

Informasi sistem (hanya untuk Super Admin).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "System Information",
    "data": {
        "laravel_version": "12.24.0",
        "php_version": "8.4.5",
        "server_info": "Apache/2.4.63",
        "database_connection": "sqlite",
        "cache_driver": "file",
        "session_driver": "file",
        "queue_driver": "sync",
        "timezone": "UTC",
        "locale": "en",
        "debug_mode": true,
        "environment": "local"
    }
}
```

#### 2. System Logs
**GET** `/system/logs`

Log sistem (hanya untuk Super Admin).

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
    "status": "success",
    "message": "System Logs",
    "data": {
        "note": "This endpoint would typically return system logs",
        "timestamp": "2025-08-16T09:35:00.000000Z"
    }
}
```

## Error Codes

| HTTP Status | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Rate Limiting

API menggunakan rate limiting untuk mencegah abuse:
- **Default**: 60 requests per minute per user/IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`

## Testing

Gunakan file Postman collection yang disediakan (`Laravel_Auth_System.postman_collection.json`) untuk testing API.

### Testing Flow

1. **Register User** - Buat user baru
2. **Login** - Dapatkan JWT token
3. **Use Token** - Gunakan token untuk akses protected routes
4. **Test Permissions** - Verifikasi role dan permission system

## Security Features

- JWT token expiration
- Password hashing dengan bcrypt
- Role-based access control
- Permission-based access control
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection

## Support

Untuk support dan pertanyaan, silakan buat issue di repository atau hubungi tim development.