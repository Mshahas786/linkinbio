# Flolio

A modern Link-in-Bio SaaS application with subscription billing, referral rewards, link scheduling, UTM builder, QR codes, and custom domain support. Built with Next.js 14, Prisma, NextAuth, and Stripe.

Live at: [flolio.vercel.app](https://flolio.vercel.app)

## Pricing

| Feature | Free | Pro |
|---|---|---|
| Links | Up to 15 | Unlimited |
| Themes | 2 | All themes |
| Analytics | Basic clicks | Full analytics |
| Link Scheduling | — | ✅ |
| UTM Builder | — | ✅ |
| QR Codes | — | ✅ |
| Social Preview Image | — | ✅ |
| Custom Domain | — | ✅ |
| Flolio Branding | Shown | Removable (or 3 referrals) |
| **Price** | **$0** | **$2/month** |

## Features

- **Drag-and-drop reordering** — Rearrange links by dragging the grip handle
- **Link scheduling** — Set start/expire dates per link
- **UTM builder** — Auto-append utm_source/medium/campaign/content to links
- **QR code generation** — Download QR codes per link
- **Referral program** — Refer 3 friends to unlock branding removal for free
- **Live creator counter** — Landing page shows total users and links
- **Social preview images** — OG meta tags per profile (Pro)
- **Custom domains** — Connect your own domain (Pro)
- **Analytics** — Track clicks per link
- **Multiple auth providers** — Email/password, Google, GitHub
- **Stripe subscriptions** — $2/month Pro with Stripe Checkout
- **Themes & accent colors** — Customize your public page
- **Public profile** — Share your page at `/username`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Auth | [NextAuth.js](https://next-auth.js.org/) v4 |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Prisma](https://www.prisma.io/) |
| Payments | [Stripe](https://stripe.com/) |
| Drag & Drop | [dnd-kit](https://dndkit.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Validation | [Zod](https://zod.dev/) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech) free tier)
- Stripe account (test mode)
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Setup

```bash
git clone https://github.com/Mshahas786/linkinbio.git
cd linkinbio
npm install
cp .env.example .env
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://flolio.vercel.app"
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"

STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### Database

```bash
npx prisma db push
npx prisma studio
```

### Run

```bash
npm run dev
```

## Deployment

Deployed on [Vercel](https://vercel.com/). For updates:

```bash
npx vercel --prod --yes
```

## License

MIT
