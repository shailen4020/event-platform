# 🎉 EventHub — Full Stack Event Platform

A complete event listing platform where guests can submit events (verified via email code) and admins can approve/reject them.

## Tech Stack
- **Frontend**: React 18 + React Router
- **Backend**: Java 17 + Spring Boot 3 + Spring Security (JWT)
- **Database**: MySQL 8
- **Email**: Spring Mail (Gmail SMTP)
- **Deployment**: Docker + Docker Compose

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

### Step 1: Clone / Extract the project
```bash
cd event-platform
```

### Step 2: Configure Email
```bash
cp .env.example .env
```
Edit `.env` and fill in your Gmail credentials:
```
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_16char_app_password
```

> **How to get a Gmail App Password:**
> 1. Go to your Google Account → Security
> 2. Enable 2-Step Verification (required)
> 3. Go to Security → App Passwords
> 4. Create a new app password for "Mail"
> 5. Copy the 16-character password

### Step 3: Start Everything
```bash
docker compose up --build
```

This starts:
- MySQL on port `3306`
- Backend API on port `8080`
- Frontend on port `3000`

**First build takes ~3-5 minutes** (downloads Maven, Node.js dependencies).

### Step 4: Open the App
| URL | Description |
|-----|-------------|
| http://localhost:3000 | Main website |
| http://localhost:3000/submit | Submit an event |
| http://localhost:3000/my-events | Track your submissions |
| http://localhost:3000/admin | Admin panel |
| http://localhost:8080/api | Backend API |

---

## 👤 User Roles

### Guest User
1. Browse approved events at http://localhost:3000
2. Submit an event at `/submit`
3. Enter event details + your email
4. Receive a 6-digit code via email
5. Enter the code to verify your submission
6. Track submission status at `/my-events`

### Admin
- **Login**: http://localhost:3000/admin/login
- **Default credentials**: `admin@eventplatform.com` / `Admin@123`
- View all pending/approved/rejected events
- Approve or reject with optional reason
- Organizer is notified via email on decision

---

## 🛑 Stopping the App
```bash
docker compose down        # Stop containers
docker compose down -v     # Stop + delete database data
```

## 🔄 Restarting After Changes
```bash
docker compose up --build  # Rebuild everything
```

---

## 📁 Project Structure
```
event-platform/
├── docker-compose.yml        # Orchestrates all services
├── .env.example              # Environment variables template
├── mysql-init/
│   └── init.sql             # Database schema + sample data
├── backend/                  # Spring Boot Java API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/eventplatform/
│       ├── controller/       # REST endpoints
│       ├── service/          # Business logic
│       ├── repository/       # Database access
│       ├── model/            # JPA entities
│       ├── dto/              # Request/response DTOs
│       ├── security/         # JWT auth
│       └── config/           # Spring config
└── frontend/                 # React app
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── pages/            # Route pages
        ├── components/       # Reusable components
        ├── services/api.js   # Axios API calls
        └── context/          # Auth state
```

## 🔧 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/events` | List approved events (filter: `?category=&search=`) |
| GET | `/api/public/events/:id` | Get single event |
| POST | `/api/public/events/submit` | Submit new event |
| POST | `/api/public/events/verify` | Verify email code |
| GET | `/api/public/events/by-email/:email` | Get events by organizer email |

### Admin (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login → returns JWT |
| GET | `/api/admin/events` | All events |
| POST | `/api/admin/events/:id/approve` | Approve event |
| POST | `/api/admin/events/:id/reject` | Reject with reason |
| GET | `/api/admin/stats` | Event counts by status |

---

## ⚙️ Configuration

Change settings in `.env` file:
```bash
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@eventplatform.com
ADMIN_PASSWORD=Admin@123
```

For production, also update in `docker-compose.yml`:
- `JWT_SECRET` — use a strong random string
- Database passwords
