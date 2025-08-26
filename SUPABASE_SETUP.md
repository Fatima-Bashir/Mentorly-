# Supabase Setup Guide

This guide will walk you through setting up Supabase for your Mentorly project.

## 🚀 **Quick Setup (5 minutes)**

### 1. Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** → **"Sign up"**
3. Sign up with GitHub (recommended) or email
4. Click **"New Project"**
5. Choose your organization
6. Fill in project details:
   - **Name**: `mentorly-dev` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to you
   - **Plan**: Free (perfect for development)
7. Click **"Create new project"**
8. Wait 2-3 minutes for project setup

### 2. Enable pgvector Extension

1. In your Supabase dashboard, go to **Settings** → **Extensions**
2. Search for **"vector"**
3. Find **"pgvector"** and click **"Enable"**
4. Wait for it to activate (should be instant)

### 3. Get Your Credentials

**Database URL:**
1. Go to **Settings** → **Database**
2. Scroll down to **"Connection string"**
3. Select **"Prisma"** tab
4. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@[REF].supabase.co:5432/postgres`)

**API Keys:**
1. Go to **Settings** → **API**
2. Copy these values:
   - **URL**: `https://[YOUR-REF].supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1...` (long string starting with eyJ)
   - **service_role**: `eyJhbGciOiJIUzI1...` (different long string)

### 4. Update Your Environment File

1. In your project root, copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   # Database (Supabase PostgreSQL with pgvector)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-REF].supabase.co:5432/postgres"
   SUPABASE_URL="https://[YOUR-REF].supabase.co"
   SUPABASE_ANON_KEY="your-actual-anon-key-here"
   SUPABASE_SERVICE_ROLE_KEY="your-actual-service-role-key-here"

   # Next.js public environment variables (same as above)
   NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-actual-anon-key-here"
   ```

### 5. Set Up Database Schema

```bash
# Generate Prisma client with Supabase connection
pnpm db:generate

# Push your schema to Supabase (creates all tables)
pnpm db:push

# Optional: Seed with sample data
pnpm --filter @mentorly/database run db:seed
```

### 6. Test Your Setup

```bash
# Start your app
pnpm dev

# Visit http://localhost:3000
# Try signing up - you should be able to create an account
```

## 🔍 **Verify Everything Works**

### Check Database Tables
1. Go to your Supabase dashboard
2. Click **"Table Editor"** in the sidebar
3. You should see tables like: `users`, `profiles`, `user_skills`, `artifacts`, etc.

### Check pgvector Extension
1. In Supabase, go to **SQL Editor**
2. Run this query:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```
3. Should return one row showing the vector extension is installed

### Test File Storage (Optional)
1. In Supabase, go to **Storage**
2. Create a bucket called `mentorly-files`
3. Set it to public if you want direct file access

## 🛠️ **Useful Supabase Features**

### Table Editor
- Visual interface to view/edit your data
- Like a spreadsheet for your database

### SQL Editor
- Run custom queries
- Great for testing vector searches later

### Auth (Alternative to Clerk)
- If you want to switch from Clerk to Supabase Auth
- Built-in user management

### Storage
- S3-compatible file storage
- Perfect for resume uploads, profile pictures

### Real-time
- WebSocket subscriptions
- Great for chat features

## 🐛 **Troubleshooting**

**Connection Issues:**
- Double-check your DATABASE_URL format
- Make sure password doesn't have special characters
- Try regenerating your database password

**pgvector Not Working:**
- Ensure extension is enabled in Supabase dashboard
- Check that your plan supports extensions (free tier does)

**Migration Errors:**
- Check if tables already exist
- Try `pnpm db:reset` then `pnpm db:push`

**Environment Variables:**
- Restart your dev server after changing .env
- Make sure no spaces around = in .env file

## 🎯 **Next Steps**

Once everything is working:

1. **Add Sample Data**: Use the Supabase Table Editor to add test users/skills
2. **Explore the Dashboard**: Get familiar with the Supabase interface
3. **Set up File Storage**: Create buckets for resume uploads
4. **Plan Vector Search**: Your database is ready for AI embeddings!

## 💡 **Pro Tips**

- **Free Tier Limits**: 500MB database, 1GB bandwidth/month, 2 projects
- **Upgrade Later**: Easy to upgrade when you need more resources
- **Backup**: Supabase handles daily backups automatically
- **Monitoring**: Built-in analytics and logging
- **Edge Functions**: Serverless functions when you need backend logic

Your Mentorly MVP is now powered by Supabase! 🚀
