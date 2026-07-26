# AI-Powered Smart Waste Management System — Backend

A production-ready Spring Boot backend for an AI-powered waste management platform integrating **Google Gemini API** for real-time multilingual waste analysis, complaint evaluation, and an intelligent chatbot.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Java 21 | Runtime |
| Spring Boot 3.3.0 | Framework |
| Spring Security + JWT | Authentication & Authorization |
| Spring Data JPA + Hibernate | ORM & Database Access |
| MySQL 8 | Relational Database |
| Google Gemini 1.5 Flash | AI Analysis & Chatbot |
| OpenAPI / Swagger UI | API Documentation |
| Lombok | Boilerplate Reduction |
| Docker + Docker Compose | Containerization |

---

## Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose
- Google Gemini API Key → [Get one free](https://aistudio.google.com/app/apikey)

### Steps

```bash
# 1. Clone the project
cd "Waste Management System"

# 2. Set your environment variables
copy .env.example .env
# Edit .env and fill in GEMINI_API_KEY and DB_PASSWORD

# 3. Start with Docker Compose
docker-compose up --build -d

# 4. Access the API
# Swagger UI: http://localhost:8080/swagger-ui.html
# API Docs:   http://localhost:8080/v3/api-docs
```

---

## Quick Start (Local Maven)

### Prerequisites
- Java 21
- Maven (or use included `mvnw`)
- MySQL 8 running locally

```bash
# Set environment variables
set GEMINI_API_KEY=your_key_here
set DB_PASSWORD=your_mysql_password
set DB_USER=root

# Build and run
.\mvnw.cmd spring-boot:run
```

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| ADMIN | admin@smartwaste.com | adminpassword |

> First, POST `/auth/register` to create a regular user, then POST `/auth/login` to get your JWT token.

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive JWT |
| POST | `/auth/refresh?refreshToken=...` | Refresh access token |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/forgot-password` | Initiate forgot password |

### User
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/profile` | Get current user profile |
| PUT | `/users/profile` | Update profile |

### Waste Analysis (AI)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/waste/analyze` | Upload image → live Gemini analysis |
| GET | `/waste/history` | Get user's report history |
| GET | `/waste/{id}` | Get specific report |

> **`/waste/analyze` Parameters:** `file` (image), `language` (en/hi/ta/ml), `location`, `latitude`, `longitude`

### Pickup Scheduling
| Method | Endpoint | Description |
|---|---|---|
| POST | `/pickup/request` | Schedule a waste collection |
| GET | `/pickup/history` | Get pickup history |
| PUT | `/pickup/cancel/{id}` | Cancel a pending pickup |

### Complaints (AI)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/complaints/report` | Report illegal dumping with image |
| GET | `/complaints/history` | Get complaint history |

### AI Chatbot
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/chat` | Ask a waste-related question |
| GET | `/ai/history` | Get chat conversation history |

### Rewards & Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/rewards` | Get points and badges |
| GET | `/notifications` | Get inbox notifications |
| POST | `/notifications/read` | Mark all as read |

### Admin (ADMIN role required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/users` | All registered users |
| GET | `/admin/reports` | All waste reports |
| GET | `/admin/complaints` | All complaints |
| GET | `/admin/statistics` | Platform statistics |
| PUT | `/admin/complaints/{id}/status` | Update complaint status |
| PUT | `/admin/pickups/{id}/status` | Assign driver / update status |

---

## Multilingual Support

Pass `"language"` in request body or form-data:

| Code | Language |
|---|---|
| `en` | English (default) |
| `hi` | Hindi |
| `ta` | Tamil |
| `ml` | Malayalam |

---

## Response Format

All responses follow this consistent structure:

```json
{
  "success": true,
  "message": "Waste analyzed successfully",
  "language": "ta",
  "data": { ... },
  "timestamp": "2026-07-12T09:00:00Z"
}
```

---

## Reward Points System

| Action | Points |
|---|---|
| Submit waste report | +10 pts |
| Pickup completed | +20 pts |
| Complaint resolved | +15 pts |

### Badges
| Badge | Trigger |
|---|---|
| Eco-Novice | First report |
| Eco-Warrior | 5+ reports |
| Eco-Champion | 10+ reports |

---

## Project Structure

```
src/main/java/com/smartwaste/
├── SmartWasteApplication.java
├── config/
│   ├── OpenApiConfig.java
│   └── WebMvcConfig.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── WasteController.java
│   ├── PickupController.java
│   ├── ComplaintController.java
│   ├── ChatController.java
│   ├── RewardController.java
│   ├── NotificationController.java
│   └── AdminController.java
├── dto/          (Request/Response DTOs)
├── entity/       (JPA Entities)
├── exception/
│   ├── CustomExceptions.java
│   └── GlobalExceptionHandler.java
├── mapper/
│   └── DtoMapper.java
├── repository/   (Spring Data JPA Interfaces)
├── security/
│   ├── SecurityConfig.java
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── service/
    ├── (interfaces)
    └── impl/     (implementations)
```
