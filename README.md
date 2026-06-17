# EXOCORTEX v9

A Vercel-deployable minimal-but-real implementation of an Exocortex system.

## Features

✔ Voice input (browser)  
✔ FFT feature extraction (lightweight)  
✔ agentField simulation  
✔ PSI vector generation  
✔ Supabase memory layer (optional but wired)  
✔ Real-time UI visualization  
✔ Vercel deploy compatible  

## Setup

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials (optional):

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

Deploy directly to Vercel:

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

- `app/` - Next.js 14 app directory with pages and API routes
- `lib/` - Core logic (DSP, agents, fields, PSI generation)
- `components/` - React components for UI
