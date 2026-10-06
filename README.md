# 5DVR Career Portal

An AI-native career intelligence and enablement platform designed to empower students and professionals with evidence-based resume optimization, personalized career discovery, AI-driven mock interviews, and actionable career roadmaps.

---

## 🌟 Key Capabilities

### 1. CV Intelligence Center
* **Evidence-Based ATS Analyzer**: Evaluates resumes using OpenAI's `gpt-6.1-sol` via the official Responses API and Files API. Analyzes documents across 5 rigorous categories (Parseability, Experience Quality, Skills & Keywords, Structure, Readability) with a 100-point balanced scoring model.
* **Evidence-Supported Keyword Opportunities**: Identifies high-value industry terminology grounded in evidence from the candidate's existing background, avoiding generic or unsupported keyword penalties.
* **Prioritized Actionable Fixes**: Provides concrete improvement recommendations with verbatim evidence quotes and severity tags (`HIGH`, `MEDIUM`, `LOW`).
* **Job Description Matcher**: Compares candidate resumes against target job postings to generate match scores, strength highlights, critical gaps, and compensation alignment insights.

### 2. Career Discovery & Assessment
* Interactive multi-dimensional career assessments tailored to user interests and aptitudes.
* Personalized career profile generation and exploration of curated industry career paths.

### 3. AI Mock Interview Studio
* Real-time conversational interview rooms featuring 3rd-party avatar integrations.
* Post-session AI feedback reports grading overall performance, technical readiness, communication, and clear development areas.

### 4. Interactive Career Roadmaps
* Dynamic visual skill trees and milestone roadmaps tailored to user target roles.
* Step-by-step progress tracking from entry-level fundamentals to senior mastery.

### 5. Tailored Onboarding
* Dedicated onboarding paths for **Job Seekers** and **Students**.
* Automatic profile pre-fill via direct PDF CV parsing with OpenAI.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Route Handlers) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) (`@supabase/ssr`) |
| **AI Engine** | [Official OpenAI SDK](https://github.com/openai/openai-node) (`gpt-6.1-sol`, Responses API, Files API) |
| **Specification** | [Spec-Kit](https://github.com/spec-kit) (Specification-driven development) |

---

## 📂 Project Structure

```text
5DVR-Career-Portal/
├── .specify/                   # Spec-Kit configuration, templates & active feature pointer
├── prisma/
│   └── schema.prisma           # Prisma database schema (PostgreSQL)
├── specs/                      # Feature specifications, plans, research & tasks
│   ├── 001-career-portal-platform/
│   └── 002-openai-responses-api-migration/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── (auth)/             # Login & auth routes
│   │   ├── (dashboard)/        # Protected dashboard, CV center, discovery & interview
│   │   ├── api/                # Backend API endpoints (/api/cv, /api/interview, etc.)
│   │   ├── onboarding/         # Job seeker and student onboarding flows
│   │   └── layout.tsx          # Root application layout
│   ├── components/             # Reusable UI & domain components
│   │   ├── cv/                 # ATS score gauges, fix recommendations, active CV banners
│   │   ├── dashboard/          # Metrics, streak counters, navigation
│   │   └── ui/                 # Core UI building blocks
│   ├── lib/
│   │   ├── openai.ts           # OpenAI client instance & target model configuration
│   │   ├── prisma.ts           # Global Prisma client singleton
│   │   └── supabase/           # Supabase client helpers (client, server, middleware)
│   └── middleware.ts           # Session verification and route protection
├── .env.example                # Template for environment variables
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.18.0` or higher
* **npm** or **pnpm**
* **PostgreSQL Database** (e.g. Supabase instance)
* **OpenAI API Key**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ehab-ayman-gharib/5DVR-Career-Portal.git
cd 5DVR-Career-Portal
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the required credentials in `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# PostgreSQL Connection (Prisma)
DATABASE_URL="postgresql://postgres:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:password@host:5432/postgres"

# OpenAI Configuration (gpt-6.1-sol Responses API)
OPENAI_API_KEY=sk-your-openai-api-key

# 3rd-Party Avatar Embed
NEXT_PUBLIC_3RD_PARTY_AVATAR_EMBED_URL=https://avatar.provider.com/embed
3RD_PARTY_AVATAR_EMBED_URL=https://avatar.provider.com/embed
```

### 3. Sync Database Schema
Generate the Prisma client and push the schema to your database:
```bash
npx prisma generate
npm run db:push
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with hot-reload |
| `npm run build` | Builds the production bundle and validates types |
| `npm run start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint checks |
| `npm run db:push` | Synchronizes the Prisma schema directly with the database |
| `npm run db:studio` | Opens Prisma Studio GUI in the browser to inspect database records |

---

## 📋 Spec-Driven Development (Spec-Kit)

This codebase follows the **Spec-Kit** methodology. All major features and migrations are designed, planned, and tracked via structured markdown artifacts:

* `.specify/feature.json`: Points to the active feature directory.
* `specs/<feature-id>/spec.md`: User stories, acceptance criteria, functional requirements.
* `specs/<feature-id>/plan.md`: Technical design, architectural decisions, API contracts.
* `specs/<feature-id>/tasks.md`: Dependency-ordered, actionable implementation tasks.
* `specs/<feature-id>/quickstart.md`: End-to-end verification and testing guide.

---

## 🔒 Security & Privacy

* **Strict Server-Side AI**: All OpenAI and Supabase Service Role keys remain strictly server-side.
* **Transient File Processing**: Uploaded PDF files processed through the OpenAI Files API are automatically purged via `openai.files.del()` upon evaluation completion.
* **Cookie-Based Auth**: Protected routes enforce Supabase JWT validation via Next.js middleware and server client cookies.
