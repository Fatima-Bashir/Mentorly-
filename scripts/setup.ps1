# @author: fatima bashir
# Mentorly MVP Setup Script for Windows PowerShell

Write-Host "🚀 Setting up Mentorly MVP..." -ForegroundColor Green

# Check if pnpm is installed
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Install dependencies
Write-Host "📋 Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Copy environment file
if (!(Test-Path .env)) {
    Write-Host "⚙️ Setting up environment variables..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "Please update .env file with your API keys" -ForegroundColor Cyan
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
pnpm db:generate

# Run database migrations
Write-Host "🗃️ Running database migrations..." -ForegroundColor Yellow
pnpm db:push

# Seed database (optional)
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
pnpm --filter "@mentorly/database" run db:seed

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a Supabase project at supabase.com"
Write-Host "2. Enable pgvector extension in Supabase"
Write-Host "3. Update .env file with your Supabase credentials"
Write-Host "4. Run 'pnpm dev' to start development servers"
Write-Host "5. Visit http://localhost:3000 to see your app"
Write-Host ""
Write-Host "🔗 Useful links:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000"
Write-Host "- Database Studio: pnpm db:studio"
Write-Host "- Supabase Dashboard: https://supabase.com/dashboard"
Write-Host "- Supabase Docs: https://supabase.com/docs"

