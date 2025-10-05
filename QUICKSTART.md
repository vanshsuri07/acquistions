# Quick Start Guide

Get your Acquistions application running in Docker in 5 minutes! 🚀

## Development (Neon Local)

### 1. Prerequisites
- Install Docker Desktop for Windows
- Get Neon API credentials from [console.neon.tech](https://console.neon.tech)

### 2. Configure Environment

Edit `.env.development` and add your Neon credentials:

```env
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here
PARENT_BRANCH_ID=your_main_branch_id_here
ARCJET_KEY=your_arcjet_key_here
```

### 3. Start Development Environment

```powershell
# Build and start (app + Neon Local)
docker-compose -f docker-compose.dev.yml up --build
```

### 4. Test It

Open your browser: http://localhost:3000

Or use PowerShell:
```powershell
curl http://localhost:3000/health
```

### 5. Stop Development

```powershell
docker-compose -f docker-compose.dev.yml down
```

---

## Production (Neon Cloud)

### 1. Configure Production Environment

Edit `.env.production` with your actual Neon Cloud URL:

```env
DATABASE_URL=postgresql://user:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
ARCJET_KEY=your_production_arcjet_key
```

### 2. Start Production

```powershell
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Verify

```powershell
curl http://localhost:3000/health
```

### 4. Stop Production

```powershell
docker-compose -f docker-compose.prod.yml down
```

---

## Common Tasks

### View Logs
```powershell
# Development
docker-compose -f docker-compose.dev.yml logs -f

# Production
docker-compose -f docker-compose.prod.yml logs -f
```

### Run Database Migrations
```powershell
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Enter Container Shell
```powershell
# Development
docker-compose -f docker-compose.dev.yml exec app sh

# Production
docker-compose -f docker-compose.prod.yml exec app sh
```

---

## Troubleshooting

**Issue:** Services won't start
```powershell
# Clean everything and try again
docker-compose -f docker-compose.dev.yml down -v
docker system prune -a
docker-compose -f docker-compose.dev.yml up --build
```

**Issue:** Port already in use
- Check if another app is using port 3000 or 5432
- Change ports in docker-compose files

**Issue:** Database connection fails
- Verify your Neon credentials in `.env.development`
- Check Neon Local logs: `docker-compose -f docker-compose.dev.yml logs db`

---

## What's Happening?

### Development Mode
1. **Neon Local** creates a fresh ephemeral database branch
2. Your **app** connects to it via the local proxy
3. When you stop, the branch is **automatically deleted**
4. Next startup = fresh database! Perfect for testing 🎉

### Production Mode
1. Your **app** connects directly to **Neon Cloud**
2. No proxy, no ephemeral branches
3. Uses your real production database

---

For detailed documentation, see [DOCKER_SETUP.md](DOCKER_SETUP.md)
