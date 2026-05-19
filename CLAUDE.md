# OpenClaw Skill Store - Claude Project Guide

## Project Overview
An online marketplace for AI agent skills (plugins/extensions). Users can browse, search, install, and review skills. Inspired by the "Effective Harnesses for Long-Running Agents" pattern.

## Tech Stack
- **Frontend**: React 18 + Vite 5 + TypeScript + TailwindCSS
- **Backend**: Java 17 + Spring Boot 3 + Maven
- **Database**: PostgreSQL (prod) / H2 (dev)
- **Deployment**: Render (Static Site + Docker + PostgreSQL)

## Quick Start

### Backend (Spring Boot)
```bash
cd backend
# Set JAVA_HOME if needed
export JAVA_HOME="C:/Program Files/Java/jdk-17"
# Run with dev profile (uses H2 in-memory database + seed data)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
The API starts at http://localhost:8080
H2 Console at http://localhost:8080/h2-console

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend starts at http://localhost:5173

### Run Both
Just run `init.sh` from the project root.

## Project Structure
```
Openclaw-Skill-Store/
├── CLAUDE.md              # This file - project guide for Claude
├── init.sh                # One-click startup script
├── feature_list.json      # Feature tracking list (from Anthropic pattern)
├── claude-progress.txt    # Progress log (from Anthropic pattern)
├── render.yaml            # Render deployment blueprint
├── backend/               # Spring Boot API
│   ├── src/main/java/com/openclaw/skillstore/
│   │   ├── model/entity/  # JPA entities
│   │   ├── model/dto/     # Request DTOs
│   │   ├── model/vo/      # Response VOs
│   │   ├── repository/    # JPA repositories
│   │   ├── service/       # Business logic
│   │   ├── controller/    # REST controllers
│   │   ├── config/        # Security, CORS, Data init
│   │   ├── security/      # JWT auth
│   │   └── exception/     # Error handling
│   └── pom.xml
└── frontend/              # React SPA
    └── src/
        ├── components/    # Reusable UI components
        ├── pages/         # Route pages
        ├── router/        # React Router config
        ├── services/      # API client layer
        ├── store/         # Zustand state management
        └── types/         # TypeScript interfaces
```

## API Endpoints (Base: /api/v1)
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET    | /skills | List skills (paginated, filterable) | No |
| GET    | /skills/search?q= | Full-text search | No |
| GET    | /skills/featured | Featured skills | No |
| GET    | /skills/{slug} | Skill detail | No |
| POST   | /skills | Create skill | AUTHOR |
| POST   | /skills/{id}/install | Record install | No |
| GET    | /categories | Category tree | No |
| POST   | /auth/register | Register | No |
| POST   | /auth/login | Login → JWT | No |
| GET    | /auth/me | Current user | USER |
| GET    | /health | Health check | No |

## Key Design Decisions
1. **Slug-based URLs** instead of numeric IDs for SEO
2. **PostgreSQL full-text search** instead of Elasticsearch (MVP simplicity)
3. **Zustand** instead of Redux (less boilerplate for this scale)
4. **JWT dual-token** (24h access + 7d refresh)
5. **H2 for dev, PostgreSQL for prod** via Spring profiles
6. **Feature list pattern** from Anthropic article: each skill has verifiable features

## Logging
Backend logs use SLF4J with profiles:
- **dev**: DEBUG level, SQL logging, detailed
- **prod**: INFO level, minimal
Frontend: console.log/error with prefix [SkillStore]
