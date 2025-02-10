# Sticky Notes App

Built a real-time sticky notes application built with Next.js 14, Supabase, and TypeScript. Did this to practice auth and full stack.

## Features

- 🔐 Email Authentication
- 📝 Create and edit sticky notes
- 🖱️ Drag and drop functionality
- 💾 Real-time updates
- 🔄 Optimistic UI updates
- 🎨 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account

### Environment Variables

Create a `.env.local` file in the root directory with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a new Supabase project
2. Run this SQL in your Supabase SQL editor:

```sql
-- Create notes table
create table notes (
  id text primary key,
  text text not null,
  x float not null,
  y float not null,
  user_id text references auth.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table notes enable row level security;

-- Create policy for authenticated users
create policy "Users can manage their own notes" on notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### Installation

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts    # Auth callback handler
│   ├── login/
│   │   └── page.tsx       # Login page
│   ├── page.tsx           # Home page with sticky notes
│   └── layout.tsx         # Root layout
├── components/
│   └── StickyNote.tsx     # Sticky note component
├── middleware.ts          # Auth middleware
└── utils/
    └── supabase.ts        # Supabase client configuration
```

## Features in Detail

### Authentication

- Email-based authentication
- Protected routes with middleware
- Secure session management

### Sticky Notes

- Create new notes with the "Add Note" button
- Click to edit note content
- Drag to reposition
- Real-time updates across users
- Optimistic UI updates for smooth interaction

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
