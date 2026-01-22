# Lab Pulse

Realtime lab monitoring for faculty and students. Faculty create a session with tasks; students join, submit code/output per task, and dashboards update live.

## Prerequisites
- Node 18+
- Supabase project (for data + realtime)

## Environment
Create `.env.local` in the project root (CRA requires the `REACT_APP_` prefix):
```
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-public-key
```
See `env.example` for a template.

## Supabase schema (SQL)
Run this in the Supabase SQL editor:
```sql
create table public.sessions (
  id text primary key,
  name text not null,
  tasks jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.students (
  id bigserial primary key,
  session_id text references public.sessions(id) on delete cascade,
  roll_no text not null,
  name text not null,
  task_status jsonb not null default '{}'::jsonb,
  unique (session_id, roll_no)
);

create table public.submissions (
  id bigserial primary key,
  session_id text references public.sessions(id) on delete cascade,
  roll_no text not null,
  task_idx integer not null,
  code text,
  output text,
  timestamp timestamptz not null default now(),
  unique (session_id, roll_no, task_idx)
);

-- Enable realtime
alter publication supabase_realtime add table public.students;
alter publication supabase_realtime add table public.submissions;
```

## Run locally
```
npm install
npm start
```
The app runs at http://localhost:3000.

## Deploy to Vercel
1) Push this repo or import it into Vercel.  
2) Set env vars in Vercel Project Settings → Environment Variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
3) Build command: `npm run build` (default for CRA)  
   Output directory: `build`
4) Redeploy. Vercel will inject env vars at build time.

## Scripts
- `npm start` – dev server
- `npm run build` – production build
- `npm test` – tests (CRA defaults)
