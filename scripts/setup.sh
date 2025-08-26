#!/bin/bash
# @author: fatima bashir
# Mentorly MVP Setup Script

echo "🚀 Setting up Mentorly MVP..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📋 Installing dependencies..."
pnpm install

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Setting up environment variables..."
    cp env.example .env
    echo "Please update .env file with your API keys"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm db:generate

# Run database migrations
echo "🗃️ Running database migrations..."
pnpm db:push

# Seed database (optional)
echo "🌱 Seeding database..."
pnpm --filter @mentorly/database run db:seed

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Create a Supabase project at supabase.com"
echo "2. Enable pgvector extension in Supabase"
echo "3. Update .env file with your Supabase credentials"
echo "4. Run 'pnpm dev' to start development servers"
echo "5. Visit http://localhost:3000 to see your app"
echo ""
echo "🔗 Useful links:"
echo "- Frontend: http://localhost:3000"
echo "- Database Studio: pnpm db:studio"
echo "- Supabase Dashboard: https://supabase.com/dashboard"
echo "- Supabase Docs: https://supabase.com/docs"

