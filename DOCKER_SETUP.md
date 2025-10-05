# Docker Setup Guide - Acquistions Application

This guide provides comprehensive instructions for running the Acquistions application using Docker with Neon Database in both development and production environments.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Development Setup (Neon Local)](#development-setup-neon-local)
- [Production Setup (Neon Cloud)](#production-setup-neon-cloud)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

---

## Overview

The application supports two distinct deployment modes:

### Development Mode
- Uses **Neon Local** via Docker
- Automatically creates **ephemeral database branches**
- Each container startup gets a fresh database branch
- Branches are automatically deleted when container stops
- Perfect for local development and testing

### Production Mode
- Connects directly to **Neon Cloud**
- Uses your production database URL
- No local database proxy needed
- Production-grade security and resource limits

---

## Prerequisites

### Required Software
- **Docker Desktop** (20.10.0 or higher)
  - Windows: [Download Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - Enable WSL 2 backend if on Windows
- **Docker Compose** (v2.0 or higher) - Usually included with Docker Desktop

### Neon Account Setup
1. Create a Neon account at [https://console.neon.tech](https://console.neon.tech)
2. Create a new project or use an existing one
3. Get your API credentials:
   - **API Key**: Go to [Account Settings → API Keys](https://console.neon.tech/app/settings/api-keys)
   - **Project ID**: Found in Project Settings → General
   - **Parent Branch ID**: Usually your main branch (e.g., `main` or `production`)

---

## Development Setup (Neon Local)

### Step 1: Configure Environment Variables

Copy the development environment template:

```bash
# Create .env.development file (or use the provided template)
# Edit the file and add your Neon credentials
```

Update `.env.development` with your actual values:

```env
# Application
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Database - Neon Local (ephemeral branch)
DATABASE_URL=postgresql://neon:npg@db:5432/neondb?sslmode=require

# Neon API Configuration
NEON_API_KEY=your_actual_neon_api_key
NEON_PROJECT_ID=your_actual_project_id
PARENT_BRANCH_ID=your_main_branch_id

# Arcjet Security
ARCJET_KEY=your_arcjet_key
```

### Step 2: Start the Development Environment

```bash
# Build and start all services (app + Neon Local)
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode (background)
docker-compose -f docker-compose.dev.yml up -d --build
```

### Step 3: Verify the Setup

```bash
# Check service status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Test the application
curl http://localhost:3000/health
```

Expected output:
```json
{
  "status": "OK",
  "timestamp": "2025-10-04T21:40:30.000Z",
  "upTime": 5.123
}
```

### Step 4: Run Database Migrations (if needed)

```bash
# Execute migrations inside the app container
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Or generate new migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate
```

### Step 5: Stop the Development Environment

```bash
# Stop services (ephemeral branch will be deleted)
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.yml down -v
```

### How Neon Local Works in Development

1. **Container Starts**: Neon Local creates a new ephemeral branch from your `PARENT_BRANCH_ID`
2. **Application Connects**: Your app connects to `postgresql://neon:npg@db:5432/neondb`
3. **Neon Local Proxies**: All database queries are proxied to the ephemeral Neon branch
4. **Container Stops**: The ephemeral branch is automatically deleted

This gives you a **fresh database** every time you start development! 🎉

---

## Production Setup (Neon Cloud)

### Step 1: Configure Production Environment

Update `.env.production` with your **actual Neon Cloud connection string**:

```env
# Application
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Database - Neon Cloud (production)
# Get this from: https://console.neon.tech/app/projects/[your-project]/connection-string
DATABASE_URL=postgresql://user:password@ep-xxxxx-xxxx.us-east-1.aws.neon.tech/dbname?sslmode=require

# Arcjet Security
ARCJET_KEY=your_production_arcjet_key
```

⚠️ **IMPORTANT**: Never commit `.env.production` with actual secrets to version control!

### Step 2: Build the Production Image

```bash
# Build the production image
docker-compose -f docker-compose.prod.yml build

# Or build with no cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Step 3: Run Production Container

```bash
# Start the production service
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### Step 4: Run Production Migrations

```bash
# Run migrations against production database
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Step 5: Health Check

```bash
# Verify production deployment
curl http://localhost:3000/health
```

### Step 6: Stop Production

```bash
docker-compose -f docker-compose.prod.yml down
```

---

## Environment Variables

### Application Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `PORT` | 3000 | 3000 | Application port |
| `NODE_ENV` | development | production | Node environment |
| `LOG_LEVEL` | debug | info | Logging verbosity |
| `DATABASE_URL` | Neon Local proxy | Neon Cloud URL | Database connection string |
| `ARCJET_KEY` | Dev key | Prod key | Arcjet security key |

### Neon Local Variables (Development Only)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEON_API_KEY` | Yes | Your Neon API key |
| `NEON_PROJECT_ID` | Yes | Your Neon project ID |
| `PARENT_BRANCH_ID` | Yes | Parent branch for ephemeral branches |
| `DELETE_BRANCH` | No | Delete branch on shutdown (default: true) |
| `BRANCH_ID` | No | Connect to specific existing branch |

### Database Connection Strings

**Development (Neon Local):**
```
postgresql://neon:npg@db:5432/neondb?sslmode=require
```

**Production (Neon Cloud):**
```
postgresql://user:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
```

---

## Database Migrations

### Run Migrations

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Generate Migrations

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Production (not recommended - generate in dev, then apply in prod)
docker-compose -f docker-compose.prod.yml exec app npm run db:generate
```

### Drizzle Studio (Database GUI)

```bash
# Development only
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
# Access at: https://local.drizzle.studio
```

---

## Troubleshooting

### Issue: Neon Local container fails to start

**Error:** `Failed to create ephemeral branch`

**Solution:**
1. Verify your `NEON_API_KEY` is correct
2. Check that `NEON_PROJECT_ID` and `PARENT_BRANCH_ID` exist
3. Ensure your API key has permissions to create branches

```bash
# Check Neon Local logs
docker-compose -f docker-compose.dev.yml logs db
```

### Issue: Application can't connect to database

**Error:** `ECONNREFUSED` or `connection timeout`

**Solution:**
1. Ensure the `db` service is healthy:
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```
2. Check if port 5432 is already in use on your host
3. Verify `DATABASE_URL` hostname is `db` (not `localhost`)

### Issue: SSL certificate errors (JavaScript apps)

**Error:** `self signed certificate in certificate chain`

**Solution:** Add SSL config for self-signed certificates in your database connection:

```javascript
// For pg/postgres library
ssl: {
  rejectUnauthorized: false
}
```

### Issue: Permission denied errors

**Solution:** The Dockerfile runs as non-root user. If you need to install packages:

```bash
# Enter container as root
docker-compose -f docker-compose.dev.yml exec -u root app sh
```

### Issue: Changes not reflected

**Solution:**
```bash
# Rebuild the image
docker-compose -f docker-compose.dev.yml up --build

# Or clear everything
docker-compose -f docker-compose.dev.yml down -v
docker system prune -a
```

### Issue: Windows path issues

If you're on Windows and encounter path-related issues:

```bash
# Use PowerShell or WSL 2
# Ensure Docker Desktop is using WSL 2 backend
# Check: Docker Desktop → Settings → General → Use WSL 2 based engine
```

---

## Advanced Configuration

### Persistent Branches Per Git Branch

To persist a Neon branch per Git branch (useful for feature branches):

```yaml
# Add to docker-compose.dev.yml
services:
  db:
    environment:
      DELETE_BRANCH: "false"
    volumes:
      - ./.neon_local/:/tmp/.neon_local
      - ./.git/HEAD:/tmp/.git/HEAD:ro
```

Add to `.gitignore`:
```
.neon_local/
```

### Enable Hot Reload in Development

Uncomment these lines in `docker-compose.dev.yml`:

```yaml
services:
  app:
    volumes:
      - ./src:/app/src:ro
      - ./package.json:/app/package.json:ro
```

### Connect to Existing Branch (Instead of Ephemeral)

```yaml
# In docker-compose.dev.yml, change from:
PARENT_BRANCH_ID: ${PARENT_BRANCH_ID}

# To:
BRANCH_ID: ${BRANCH_ID}
```

### Using Neon Serverless Driver

Your app already uses `@neondatabase/serverless`. For Neon Local support:

```javascript
import { neon, neonConfig } from '@neondatabase/serverless';

// Configure for Neon Local (development)
if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = 'http://db:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);
```

### Resource Limits

Adjust in `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 1024M
```

### Multi-Environment Setup

Create environment-specific files:

```bash
.env.development      # Local development
.env.staging          # Staging environment
.env.production       # Production environment
```

```bash
# Use specific environment
docker-compose -f docker-compose.prod.yml --env-file .env.staging up
```

---

## Quick Reference

### Common Commands

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d --build      # Start dev
docker-compose -f docker-compose.dev.yml logs -f            # View logs
docker-compose -f docker-compose.dev.yml exec app sh        # Enter app
docker-compose -f docker-compose.dev.yml down               # Stop dev

# Production
docker-compose -f docker-compose.prod.yml up -d --build     # Start prod
docker-compose -f docker-compose.prod.yml logs -f           # View logs
docker-compose -f docker-compose.prod.yml exec app sh       # Enter app
docker-compose -f docker-compose.prod.yml down              # Stop prod

# Database
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
docker-compose -f docker-compose.dev.yml exec app npm run db:studio

# Cleanup
docker-compose -f docker-compose.dev.yml down -v            # Remove volumes
docker system prune -a                                      # Clean everything
```

---

## Support

- **Neon Documentation**: https://neon.com/docs
- **Neon Local Docs**: https://neon.com/docs/local/neon-local
- **Docker Documentation**: https://docs.docker.com

---

## License

Copyright © 2025 Acquistions. All rights reserved.
