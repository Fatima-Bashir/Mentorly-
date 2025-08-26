# Mentorly - Personalized AI Career Mentor

## Overview

Mentorly is a comprehensive AI-powered career mentorship platform that helps professionals identify skill gaps, create personalized learning plans, practice interviews, and optimize their resumes for ATS systems.

## Architecture

### Tech Stack

- **Frontend**: Next.js 14 with TypeScript, App Router
- **UI**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL with pgvector extension)
- **ORM**: Prisma
- **Backend**: FastAPI microservice for RAG + reranking (optional)
- **Search**: Hybrid retrieval (BM25 + vector similarity search)
- **Auth**: Clerk authentication (or Supabase Auth)
- **Storage**: Supabase Storage (S3-compatible)
- **Infrastructure**: Serverless with Supabase

### Monorepo Structure

```
Mentorly/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── rag/          # FastAPI backend service
├── packages/
│   ├── database/     # Prisma schema and migrations
│   └── ui/           # Shared UI components
├── docker-compose.yml
└── README.md
```

## MVP Features

1. **Onboarding Flow**
   - Role selection and career goals
   - Weekly time commitment
   - Resume upload and parsing

2. **Skill Gap Analysis**
   - Interactive heatmap visualization
   - Comparison with target roles
   - Competency scoring

3. **Personalized Learning Plan**
   - 4-week structured curriculum
   - Module-based learning paths
   - 2 hands-on projects

4. **Mock Interview System**
   - Behavioral and technical interviews
   - AI-powered rubric scoring
   - Detailed feedback and improvement suggestions

5. **ATS Resume Optimization**
   - Job description analysis
   - Evidence-based STAR bullet generation
   - ATS compatibility scoring

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account (free tier available)
- Optional: Python 3.9+ (for backend API later)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Mentorly
   ```

2. Set up Supabase:
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Go to Settings → Database and copy your connection string
   - Go to Settings → API and copy your API keys
   - Enable pgvector extension: Settings → Extensions → Search for "vector" → Enable

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Set up environment variables:
   ```bash
   cp env.example .env
   # Update .env with your Supabase credentials:
   # DATABASE_URL (from Supabase)
   # SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
   # Add your Clerk and OpenAI API keys
   ```

5. Set up the database:
   ```bash
   pnpm db:generate  # Generate Prisma client
   pnpm db:push      # Create tables in Supabase
   ```

6. Start the development server:
   ```bash
   pnpm dev          # Start frontend
   ```

### Development Commands

- `pnpm dev` - Start development servers
- `pnpm build` - Build all applications
- `pnpm lint` - Run linting
- `pnpm format` - Format code
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## Database Schema

The application uses the following core models:

- **User** - User authentication and basic info
- **Profile** - Extended user profile and career information
- **UserSkill** - Individual skill assessments and progress
- **Artifact** - User-generated content (resumes, projects, etc.)
- **Activity** - Learning activities and progress tracking
- **DocChunk** - Vector embeddings for RAG system

## Development URLs

- **Web App**: http://localhost:3000
- **Database Studio**: Run `pnpm db:studio` → http://localhost:5555
- **Supabase Dashboard**: Your project dashboard on supabase.com
- **Supabase Table Editor**: Direct database management
- **Supabase Storage**: File upload management

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Run linting and formatting
5. Submit a pull request

## License

This project is licensed under the MIT License.

