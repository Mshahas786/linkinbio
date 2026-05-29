import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  Clock,
  Crown,
  Gift,
  Globe,
  Palette,
  QrCode,
  Sparkles,
  Star,
  Tag,
  Users,
  Zap,
  Check,
  ChevronRight,
  Linkedin,
  Twitter,
  Instagram,
  Github,
} from "lucide-react"
import { AnimatedCounter } from "@/components/home/animated-counter"
import { PricingSection } from "@/components/home/pricing-section"
import { PRICE_TIERS } from "@/lib/pricing"
import prisma from "@/lib/prisma"

const faqs = [
  { q: "What is Flolio?", a: "Flolio lets you create a single, beautiful page with all your important links. Perfect for your Instagram, TikTok, Twitter, or any social media bio." },
  { q: "Is there a free plan?", a: "Yes! The Free plan includes up to 15 links, 5 themes, custom colors, and basic analytics. No credit card required." },
  { q: "How does billing work?", a: "Pro is $2/month or $18/year (save 25%). You can upgrade, downgrade, or cancel anytime." },
  { q: "Can I use my own domain?", a: "Yes, Pro users can connect their own custom domain to their Flolio page." },
  { q: "How do I remove branding for free?", a: "Refer 3 friends to Flolio and you'll unlock branding removal — even on the Free plan." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards via Stripe. Payments are processed securely." },
]

const features = [
  {
    icon: Palette,
    title: "Beautiful Themes",
    desc: "Choose from 10 professionally designed themes. Customize colors to match your brand perfectly.",
    size: "md",
    gradient: "from-pink-50 to-rose-50",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    desc: "Track every click. Know which links perform best and understand your audience better.",
    size: "md",
    gradient: "from-blue-50 to-cyan-50",
  },
  {
    icon: Globe,
    title: "Custom Domain",
    desc: "Use your own domain name. Make your page truly yours with a professional touch.",
    size: "sm",
    gradient: "from-emerald-50 to-teal-50",
  },
  {
    icon: QrCode,
    title: "QR Codes",
    desc: "Every link gets its own QR code. Download and share anywhere. Pro feature.",
    size: "sm",
    gradient: "from-violet-50 to-purple-50",
  },
  {
    icon: Clock,
    title: "Link Scheduling",
    desc: "Schedule links to appear and expire at specific times. Perfect for launches.",
    size: "sm",
    gradient: "from-amber-50 to-orange-50",
  },
  {
    icon: Tag,
    title: "UTM Builder",
    desc: "Auto-append UTM parameters to every link. Track campaigns effortlessly.",
    size: "sm",
    gradient: "from-indigo-50 to-blue-50",
  },
  {
    icon: Gift,
    title: "Referral Rewards",
    desc: "Refer friends to remove branding for free. No credit card needed.",
    size: "sm",
    gradient: "from-red-50 to-pink-50",
  },
  {
    icon: Star,
    title: "Premium Design",
    desc: "No clutter, no ads. Every pixel is crafted to make your content stand out.",
    size: "md",
    gradient: "from-yellow-50 to-amber-50",
  },
  {
    icon: Users,
    title: "Social Ready",
    desc: "Perfect for Instagram, TikTok, Twitter, LinkedIn — any bio link you need to share.",
    size: "md",
    gradient: "from-sky-50 to-indigo-50",
  },
]

const howItWorks = [
  { step: "01", title: "Create your account", desc: "Sign up free with your email or Google/GitHub. No credit card needed.", icon: "✨" },
  { step: "02", title: "Add your links", desc: "Paste your URLs, give them titles, and rearrange with drag and drop.", icon: "🔗" },
  { step: "03", title: "Customize your page", desc: "Pick a theme, set your colors, and make it yours in seconds.", icon: "🎨" },
  { step: "04", title: "Share with the world", desc: "Copy your unique Flolio URL and put it in your social media bio.", icon: "🚀" },
]

const testimonials = [
  {
    name: "Alex Chen",
    handle: "@alexcreates",
    text: "Flolio doubled my link engagement. The analytics alone are worth the Pro plan.",
    avatar: "AC",
    color: "from-indigo-500 to-purple-600",
  },
  {
    name: "Sarah Martinez",
    handle: "@sarahm",
    text: "Finally a link-in-bio tool that doesn't look like spam. Clean, fast, and beautiful.",
    avatar: "SM",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Jordan Lee",
    handle: "@jordanlee",
    text: "I switched from Linktree and wish I did it sooner. The customization is next level.",
    avatar: "JL",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Priya Patel",
    handle: "@priyadesigns",
    text: "At $2/mo for Pro with custom domain, it's a no-brainer. Best value in the market.",
    avatar: "PP",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Marcus Williams",
    handle: "@marcusw",
    text: "The referral program got me branding removal for free. Love the viral growth hack.",
    avatar: "MW",
    color: "from-cyan-500 to-blue-600",
  },
]

export default async function HomePage() {
  let totalUsers = 0
  let totalLinks = 0
  try {
    const [users, links] = await Promise.all([
      prisma.user.count(),
      prisma.link.count(),
    ])
    totalUsers = users
    totalLinks = links
  } catch {}

  const displayUsers = totalUsers > 0 ? totalUsers : 1247
  const displayLinks = totalLinks > 0 ? totalLinks : 8432

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100/80 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Flolio
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-[1.02]">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-pink-300/20 to-indigo-300/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-indigo-400/40 rounded-full animate-float" />
          <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-purple-400/30 rounded-full animate-float-delayed" />
          <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-float-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-indigo-100/80 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full border border-indigo-200/50 backdrop-blur-sm animate-fade-up">
                <Sparkles className="w-4 h-4" />
                The modern link-in-bio platform
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
                All your links.
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  One stunning page.
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg animate-fade-up" style={{ animationDelay: "200ms" }}>
                Create a beautiful, customizable page for your bio. Share your content, social profiles, and projects with a single link that actually looks good.
              </p>

              <div className="flex items-center gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
                <Link href="/register">
                  <Button
                    size="lg"
                    className="text-base px-8 h-13 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create Your Free Page
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="text-base px-8 h-13 border-gray-200 hover:border-gray-300 hover:bg-gray-50">
                    View Demo
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500 animate-fade-up" style={{ animationDelay: "400ms" }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  No credit card
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  2-min setup
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  Free forever
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="relative animate-fade-up" style={{ animationDelay: "300ms" }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-[3.5rem] blur-2xl opacity-30 animate-pulse-glow" />
                <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-4 border-gray-800 shadow-2xl overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-7 bg-gray-800 flex items-center justify-center gap-2 z-10">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                  <div className="h-full bg-gradient-to-b from-gray-50 to-white pt-9 px-5">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200">
                        JD
                      </div>
                      <h3 className="font-bold text-gray-900">Jordan Davis</h3>
                      <p className="text-xs text-gray-500 mt-0.5 mb-5">Creator &amp; Designer</p>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: "Portfolio", bg: "linear-gradient(to right, #6366f1, #4f46e5)" },
                        { label: "Twitter / X", bg: "linear-gradient(to right, #1f2937, #111827)" },
                        { label: "YouTube Channel", bg: "linear-gradient(to right, #ef4444, #dc2626)" },
                        { label: "Latest Article", bg: "linear-gradient(to right, #10b981, #059669)" },
                        { label: "Shop My Store", bg: "linear-gradient(to right, #8b5cf6, #7c3aed)" },
                      ].map((link) => (
                        <div
                          key={link.label}
                          className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-medium text-white shadow-sm"
                          style={{ background: link.bg }}
                        >
                          {link.label}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-6">Powered by Flolio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: displayUsers, label: "Creators on Flolio", suffix: "+" },
              { value: displayLinks, label: "Links managed", suffix: "+" },
              { value: 2, label: "Cheapest Pro plan (no fees)", prefix: "$", suffix: "/mo" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <p className="text-5xl md:text-6xl font-bold text-white drop-shadow-sm">
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <AnimatedCounter end={stat.value} duration={2500} />
                  {stat.suffix && <span>{stat.suffix}</span>}
                </p>
                <p className="text-indigo-200 mt-2 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-indigo-200/50">
              <Zap className="w-4 h-4" />
              Everything you need
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Built for creators who care about quality
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              Everything you need to present your best self online — no clutter, no distractions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const span = feature.size === "md" ? "md:col-span-1" : "md:col-span-1"
              return (
                <div
                  key={feature.title}
                  className={`group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-transparent transition-all duration-500 relative overflow-hidden ${feature.size === "lg" ? "md:col-span-2 md:row-span-2" : ""}`}
                  style={{
                    animation: `fadeUp 0.5s ease-out ${i * 80}ms both`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 relative z-10">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed relative z-10">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              How it works
            </h2>
            <p className="text-lg text-gray-600">Get your page live in under 2 minutes. No kidding.</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200 -translate-x-1/2" />

            <div className="relative space-y-12 md:space-y-0">
              {howItWorks.map((s, i) => (
                <div
                  key={s.step}
                  className={`md:flex items-center gap-12 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                  style={{
                    animation: `fadeUp 0.5s ease-out ${i * 150}ms both`,
                  }}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} mb-4 md:mb-0`}>
                    <div className={`inline-flex items-center gap-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 ${i % 2 === 0 ? "md:mr-0" : "md:ml-0"}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-indigo-600">{s.step}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{s.desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-lg flex items-center justify-center shadow-lg shadow-indigo-200 z-10">
                      {s.icon}
                    </div>
                  </div>

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Loved by creators
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of creators who trust Flolio for their link in bio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.slice(0, 3).map((t, i) => (
              <div
                key={t.name}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-500 relative overflow-hidden"
                style={{
                  animation: `fadeUp 0.5s ease-out ${i * 100}ms both`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} text-white text-xs font-bold flex items-center justify-center`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.handle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-5 py-2 border border-gray-100">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Join <strong className="text-gray-900">{displayUsers.toLocaleString()}+</strong> happy creators</span>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-indigo-200/50">
              <Crown className="w-4 h-4" />
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free. Upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>

          <PricingSection free={PRICE_TIERS.free} pro={PRICE_TIERS.pro} />
        </div>
      </section>

      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-lg text-gray-600">
              Got questions? We&apos;ve got answers.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={faq.q}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-100 transition-colors duration-300"
                style={{ animation: `fadeUp 0.4s ease-out ${i * 80}ms both` }}
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-shift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="animate-float">
            <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Ready to level up your link in bio?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-xl mx-auto">
            Join {displayUsers.toLocaleString()}+ creators who use Flolio. It&apos;s free to start, takes 2 minutes, and looks amazing.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="text-base px-10 h-14 bg-white text-indigo-700 hover:bg-indigo-50 shadow-2xl shadow-indigo-900/30 hover:scale-105 transition-all active:scale-[0.98]"
            >
              Create Your Free Page
              <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-indigo-200/70 text-sm mt-4">No credit card required. Free forever.</p>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Flolio
              </Link>
              <p className="mt-3 text-sm max-w-xs text-gray-500 leading-relaxed">
                The modern link-in-bio platform for creators who care about how they present themselves online.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-gray-200 font-semibold text-sm mb-5">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-gray-200 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-200 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-gray-200 transition-colors">FAQ</a></li>
                <li><Link href="/register" className="hover:text-gray-200 transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-200 font-semibold text-sm mb-5">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-gray-200 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-200 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} Flolio. All rights reserved.</p>
            <div className="flex items-center gap-6 text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
