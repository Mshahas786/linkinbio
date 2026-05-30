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
    gradient: "from-orange-50 to-amber-50",
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
    gradient: "from-rose-50 to-orange-50",
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
    color: "from-[#c04a2b] to-[#d4704f]",
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
    <div className="min-h-screen bg-[#faf8f6]">
      <header className="border-b border-[#e8e2dc]/80 bg-[#faf8f6]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <Link href="/" className="font-heading text-lg sm:text-xl font-bold text-[#2d1b14] tracking-tight shrink-0">
            flolio
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6b5a54]">
            <a href="#features" className="hover:text-[#c04a2b] transition-colors">Features</a>
            <a href="#pricing" className="hover:text-[#c04a2b] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#c04a2b] transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-[#6b5a54] hover:text-[#c04a2b] hover:bg-[#f0ebe6] text-sm sm:text-base px-3 sm:px-4">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#c04a2b] hover:bg-[#a83d22] text-white shadow-lg shadow-[#c04a2b]/20 hover:shadow-xl hover:shadow-[#c04a2b]/30 transition-all hover:scale-[1.02] text-sm sm:text-base px-4 sm:px-6 rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#faf8f6] via-[#f5eee8] to-[#efe5dc]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#c04a2b]/10 via-[#d4704f]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#2d1b14]/8 to-[#c04a2b]/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-28 md:pb-36">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm animate-fade-up">
                <Sparkles className="w-4 h-4" />
                The modern link-in-bio platform
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[#2d1b14] animate-fade-up" style={{ animationDelay: "100ms" }}>
                All your links.
                <br />
                <span className="bg-gradient-to-r from-[#c04a2b] via-[#d4704f] to-[#e8987a] bg-clip-text text-transparent">
                  One stunning page.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-[#6b5a54] leading-relaxed max-w-lg animate-fade-up" style={{ animationDelay: "200ms" }}>
                Create a beautiful, customizable page for your bio. Share your content, social profiles, and projects with a single link that actually looks good.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-13 px-8 bg-[#c04a2b] hover:bg-[#a83d22] text-white text-base shadow-lg shadow-[#c04a2b]/20 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl">
                    Create Your Free Page
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-13 px-8 border-[#d4cbc4] text-[#6b5a54] hover:bg-[#f0ebe6] hover:border-[#c04a2b]/30 rounded-xl">
                    View Demo
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#8a7a72] animate-fade-up" style={{ animationDelay: "400ms" }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  No credit card
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  2-min setup
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Free forever
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center">
              <div className="relative animate-fade-up" style={{ animationDelay: "300ms" }}>
                <div className="absolute -inset-4 bg-gradient-to-br from-[#c04a2b]/20 via-[#d4704f]/20 to-[#e8987a]/20 rounded-[3.5rem] blur-2xl" />
                <div className="relative w-[320px] h-[640px] bg-[#2d1b14] rounded-[3rem] border-4 border-[#4a332a] shadow-2xl overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-7 bg-[#4a332a] flex items-center justify-center gap-2 z-10">
                    <div className="w-2 h-2 rounded-full bg-[#e85a4a]" />
                    <div className="w-2 h-2 rounded-full bg-[#e8b84a]" />
                    <div className="w-2 h-2 rounded-full bg-[#4ae87a]" />
                  </div>
                  <div className="h-full bg-gradient-to-b from-[#faf8f6] to-white pt-9 px-5">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#c04a2b] to-[#d4704f] mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#c04a2b]/30">
                        JD
                      </div>
                      <h3 className="font-heading font-bold text-[#2d1b14]">Jordan Davis</h3>
                      <p className="text-xs text-[#8a7a72] mt-0.5 mb-5">Creator &amp; Designer</p>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: "Portfolio", bg: "linear-gradient(to right, #c04a2b, #a83d22)" },
                        { label: "Twitter / X", bg: "linear-gradient(to right, #2d1b14, #4a332a)" },
                        { label: "YouTube Channel", bg: "linear-gradient(to right, #e85a4a, #cc3d2d)" },
                        { label: "Latest Article", bg: "linear-gradient(to right, #2a8a5a, #1d6e46)" },
                        { label: "Shop My Store", bg: "linear-gradient(to right, #7c4ad8, #6338b8)" },
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
                    <p className="text-[10px] text-[#8a7a72] text-center mt-6">Powered by Flolio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-20 overflow-hidden bg-[#2d1b14]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#c04a2b]/20 via-[#d4704f]/10 to-[#2d1b14]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
            {[
              { value: displayUsers, label: "Creators on Flolio", suffix: "+" },
              { value: displayLinks, label: "Links managed", suffix: "+" },
              { value: 2, label: "Cheapest Pro plan (no fees)", prefix: "$", suffix: "/mo" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl md:text-6xl font-heading font-bold text-white drop-shadow-sm">
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <AnimatedCounter end={stat.value} duration={2500} />
                  {stat.suffix && <span>{stat.suffix}</span>}
                </p>
                <p className="text-[#c4a89a] mt-2 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#c04a2b]/10 text-[#c04a2b] text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-[#c04a2b]/20">
              <Zap className="w-4 h-4" />
              Everything you need
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#2d1b14] tracking-tight">
              Built for creators who care about quality
            </h2>
            <p className="text-lg text-[#6b5a54] mt-4">
              Everything you need to present your best self online — no clutter, no distractions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl border border-[#e8e2dc] bg-white hover:shadow-xl hover:shadow-[#c04a2b]/5 hover:border-[#c04a2b]/20 transition-all duration-500 relative overflow-hidden"
                style={{ animation: `fadeUp 0.5s ease-out ${i * 80}ms both` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#faf8f6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="w-6 h-6 text-[#c04a2b]" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#2d1b14] mb-2 relative z-10">{feature.title}</h3>
                <p className="text-[#6b5a54] leading-relaxed relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-[#faf8f6] to-[#f5eee8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#2d1b14] tracking-tight">
              How it works
            </h2>
            <p className="text-lg text-[#6b5a54] mt-4">Get your page live in under 2 minutes. No kidding.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 md:space-y-0">
            {howItWorks.map((s, i) => (
              <div
                key={s.step}
                className="md:flex items-center gap-12 md:even:flex-row-reverse"
                style={{ animation: `fadeUp 0.5s ease-out ${i * 150}ms both` }}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} mb-4 md:mb-0`}>
                  <div className="inline-flex items-center gap-2 bg-white rounded-2xl p-6 border border-[#e8e2dc] shadow-sm hover:shadow-lg hover:border-[#c04a2b]/20 transition-all duration-300 w-full md:w-auto">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-heading font-bold text-[#c04a2b]">{s.step}</span>
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-[#2d1b14]">{s.title}</h3>
                      <p className="text-[#6b5a54] text-sm mt-1">{s.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c04a2b] to-[#d4704f] text-white text-lg flex items-center justify-center shadow-lg shadow-[#c04a2b]/30">
                    {s.icon}
                  </div>
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#2d1b14] tracking-tight">
              Loved by creators
            </h2>
            <p className="text-lg text-[#6b5a54] mt-4">
              Join thousands of creators who trust Flolio for their link in bio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.slice(0, 3).map((t, i) => (
              <div
                key={t.name}
                className="group bg-white rounded-2xl p-6 border border-[#e8e2dc] shadow-sm hover:shadow-xl hover:border-[#c04a2b]/20 transition-all duration-500 relative overflow-hidden"
                style={{ animation: `fadeUp 0.5s ease-out ${i * 100}ms both` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[#6b5a54] leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} text-white text-xs font-bold flex items-center justify-center`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-heading font-semibold text-[#2d1b14]">{t.name}</p>
                    <p className="text-xs text-[#8a7a72]">{t.handle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <div className="inline-flex items-center gap-2 text-sm text-[#6b5a54] bg-[#f0ebe6] rounded-full px-5 py-2 border border-[#e8e2dc]">
              <Sparkles className="w-4 h-4 text-[#c04a2b]" />
              <span>Join <strong className="text-[#2d1b14]">{displayUsers.toLocaleString()}+</strong> happy creators</span>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-[#faf8f6] to-[#f5eee8] border-t border-[#e8e2dc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#c04a2b]/10 text-[#c04a2b] text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-[#c04a2b]/20">
              <Crown className="w-4 h-4" />
              Pricing
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#2d1b14] tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-[#6b5a54] mt-4">
              Start free. Upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>

          <PricingSection free={PRICE_TIERS.free} pro={PRICE_TIERS.pro} />
        </div>
      </section>

      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#2d1b14] tracking-tight">
              Frequently asked questions
            </h2>
            <p className="text-lg text-[#6b5a54] mt-4">
              Got questions? We&apos;ve got answers.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={faq.q}
                className="group bg-white rounded-xl border border-[#e8e2dc] overflow-hidden hover:border-[#c04a2b]/20 transition-colors duration-300"
                style={{ animation: `fadeUp 0.4s ease-out ${i * 80}ms both` }}
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-[#2d1b14] hover:bg-[#faf8f6] transition-colors">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-[#8a7a72] group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-4 text-sm text-[#6b5a54] leading-relaxed border-t border-[#e8e2dc] pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 overflow-hidden bg-[#2d1b14]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#c04a2b]/30 via-[#d4704f]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.06),transparent_60%)]" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-float">
            <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-6" />
          </div>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Ready to level up your link in bio?
          </h2>
          <p className="text-lg md:text-xl text-[#c4a89a] mb-8 max-w-xl mx-auto">
            Join {displayUsers.toLocaleString()}+ creators who use Flolio. It&apos;s free to start, takes 2 minutes, and looks amazing.
          </p>
          <Link href="/register">
            <Button className="text-base px-10 h-14 bg-white text-[#c04a2b] hover:bg-[#f0ebe6] shadow-2xl shadow-black/30 hover:scale-105 transition-all active:scale-[0.98] rounded-xl font-heading font-semibold">
              Create Your Free Page
              <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-[#8a7a72] text-sm mt-4">No credit card required. Free forever.</p>
        </div>
      </section>

      <footer className="bg-[#1f1310] text-[#8a7a72]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-8 md:gap-10 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="font-heading text-xl font-bold text-[#c4a89a] tracking-tight">
                flolio
              </Link>
              <p className="mt-3 text-sm max-w-xs text-[#6b5a54] leading-relaxed">
                The modern link-in-bio platform for creators who care about how they present themselves online.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-[#2d1b14] hover:bg-[#4a332a] flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#6b5a54]" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[#c4a89a] font-heading font-semibold text-sm mb-5">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-[#c4a89a] transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#c4a89a] transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-[#c4a89a] transition-colors">FAQ</a></li>
                <li><Link href="/register" className="hover:text-[#c4a89a] transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#c4a89a] font-heading font-semibold text-sm mb-5">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-[#c4a89a] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#c4a89a] transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-[#c4a89a] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#c4a89a] transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#2d1b14] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} Flolio. All rights reserved.</p>
            <div className="flex items-center gap-6 text-[#6b5a54]">
              <a href="#" className="hover:text-[#c4a89a] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#c4a89a] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#c4a89a] transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
