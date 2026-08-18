# CarStore Parts — carstoreparts.nl

Webshop voor auto-onderdelen en banden. Opgericht als zelfstandig project naast CarStore Cuijk.

## Status

- **Tijdelijke hosting:** Vercel Hobby (gratis) — tot Hostinger Premium Shared Hosting is gekocht.
- **Domein:** `carstoreparts.nl` (geregistreerd via Hostinger).
- **Database/auth/storage:** Supabase.
- **Betalingen:** Mollie (nog in te stellen).
- **Verzending:** SendCloud (nog in te stellen).

## Lokale ontwikkeling

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Genereert een static export in `dist/` (voor latere Hostinger-deploy).

## Deploy

### Nu: Vercel

1. Push naar GitHub (`origin/master`).
2. Importeer de repo in Vercel.
3. Voeg environment variables toe (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Wijs `carstoreparts.nl` toe als custom domain.

### Later: Hostinger

Zodra Hostinger Premium Shared Hosting er is:

1. Voeg `carstoreparts.nl` toe aan het Hostinger pakket.
2. Pas `scripts/deploy-hostinger.sh` aan met je SSH-gegevens.
3. Draai `bash scripts/deploy-hostinger.sh`.

## Projectstructuur

```
src/
  app/              # Next.js App Router pagina's
  components/ui/    # shadcn/ui componenten
  lib/
    supabase/       # Supabase clients
```

## Migratieplan Vercel → Hostinger

- Frontend: static export (`output: 'export'`) werkt op beide platformen.
- API routes voor Mollie/SendCloud: op Vercel serverless, op Hostinger PHP endpoints.
- Supabase blijft hetzelfde; database hoeft niet te migreren.
