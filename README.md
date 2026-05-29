# Linkinbio

A modern Link-in-Bio SaaS application with subscription billing, referral rewards, link scheduling, UTM builder, QR codes, and custom domain support. Built with Next.js 14, Prisma, NextAuth, and Stripe.

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
| Linkinbio Branding | Shown | Removable (or 3 referrals) |
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
# Clone the repo
git clone https://github.com/Mshahas786/linkinbio.git
cd linkinbio

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"

# Stripe (get from Stripe dashboard)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."  # $2/month price in Stripe

# OAuth (optional — email signup works without these)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### Database

```bash
# Push schema to your database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### Run

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

For Stripe webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Deployment

Deploy to [Vercel](https://vercel.com/) with the following steps:

1. Push this repo to GitHub
2. Import into Vercel
3. Add all environment variables
4. Set `NEXTAUTH_URL` to your production URL
5. Create a Stripe Pro product with a $2/month price and add the price ID
6. Configure Stripe webhook pointing to `/api/webhooks/stripe`
7. Push the Prisma schema: `npx prisma db push`

### Custom Domains

After deploying, add custom domains in Vercel (Settings → Domains). The middleware handles routing automatically. Users connect their domain in the dashboard Settings page (Pro feature).

## Project Structure

```
src/
├── app/
│   ├── [username]/          # Public profile page
│   ├── api/
│   │   ├── auth/            # NextAuth route handler
│   │   ├── domain/          # Custom domain connect/disconnect
│   │   ├── links/           # Link CRUD + reorder
│   │   ├── referral/        # Referral code management
│   │   ├── register/        # Email/password signup
│   │   ├── settings/        # User settings
│   │   ├── stats/           # Global creator stats
│   │   └── webhooks/        # Stripe webhook
│   ├── dashboard/           # Dashboard (links, analytics, appearance, billing, settings)
│   ├── domain/[domain]/     # Custom domain profile route
│   ├── login/               # Login page
│   ├── onboarding/          # Username setup
│   └── register/            # Registration with referral support
├── components/
│   ├── dashboard/           # Sidebar
│   ├── home/                # Landing page components (testimonial carousel)
│   ├── public-page/         # Public profile component
│   └── ui/                  # UI primitives (button, card, input, badge)
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── pricing.ts           # Pricing tiers
│   ├── prisma.ts            # Prisma client
│   ├── stripe.ts            # Stripe client
│   └── utils.ts             # Tailwind utility
└── middleware.ts            # Custom domain routing
```

## License

MIT
