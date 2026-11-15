# Mindixo — Digital Book Store

Mindixo is an independent digital bookstore built with TanStack Start, React 19, and Tailwind CSS.

## Features

- Modern, sleek bookstore interface
- Digital ebook catalog and categories
- Responsive design with dark aesthetic
- Shopping cart and wishlist
- Admin management for catalog and store settings
- Powered by Supabase for authentication, database, and storage

## Development

Install dependencies and start the dev server:

```sh
npm install
npm run dev
```

The application runs on `http://localhost:8080/`.

## Deployment on Vercel

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set your environment variables in the Vercel project settings:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://<project-id>.supabase.co`)
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase Publishable / Anon Key
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_PUBLISHABLE_KEY`: Your Supabase Publishable / Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (for admin operations)
   - `DATABASE_URL`: Your PostgreSQL direct/pooler connection string (optional, for migrations)
4. Deploy!
