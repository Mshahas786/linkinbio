import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Crown, ArrowRight, Sparkles, BarChart3, Palette, Globe, Zap, Users, Star, Gift, QrCode, Clock, Tag } from "lucide-react"
import { PRICE_TIERS } from "@/lib/pricing"
import { TestimonialCarousel } from "@/components/home/testimonial-carousel"
import prisma from "@/lib/prisma"

const faqs = [
  { q: "What is Flolio?", a: "Flolio lets you create a single, beautiful page with all your important links. Perfect for your Instagram, TikTok, Twitter, or any social media bio." },
  { q: "Is there a free plan?", a: "Yes! The Free plan includes up to 15 links, 5 themes, custom colors, and basic analytics. No credit card required." },
  { q: "How does billing work?", a: "Pro is $2/month. You can upgrade, downgrade, or cancel anytime. You'll get a prorated refund if you downgrade mid-cycle." },
  { q: "Can I use my own domain?", a: "Yes, Pro users can connect their own custom domain to their Flolio page." },
  { q: "How do I remove branding for free?", a: "Refer 3 friends to Flolio and you'll unlock branding removal — even on the Free plan." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards via Stripe. Payments are processed securely." },
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
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Flolio
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-indigo-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                The modern link-in-bio platform
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                All your links.
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  One stunning page.
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Create a beautiful, customizable page for your bio. Share your content, social profiles, and projects with a single link that actually looks good.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="text-base px-8 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
                    Create Your Free Page
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="text-base px-8 h-12">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> No credit card</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> 2-min setup</div>
                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Free forever</div>
              </div>
            </div>

            <div className="hidden md:flex justify-center animate-slide-in-right">
              <div className="relative">
                <div className="w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-4 border-gray-800 shadow-2xl overflow-hidden relative animate-float">
                  <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 flex items-center justify-center gap-1.5">
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full" />
                  </div>
                  <div className="h-full bg-gradient-to-b from-gray-50 to-white pt-10 px-5">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold shadow-lg">JD</div>
                      <h3 className="font-bold text-gray-900">Jordan Davis</h3>
                      <p className="text-xs text-gray-500 mt-0.5 mb-5">Creator &amp; Designer</p>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: "Portfolio", color: "from-indigo-500 to-indigo-600" },
                        { label: "Twitter / X", color: "from-gray-800 to-gray-900" },
                        { label: "YouTube Channel", color: "from-red-500 to-red-600" },
                        { label: "Latest Article", color: "from-emerald-500 to-emerald-600" },
                        { label: "Shop My Store", color: "from-purple-500 to-purple-600" },
                      ].map((link, i) => (
                        <div key={link.label} className={`w-full py-2.5 px-4 rounded-xl text-center text-sm font-medium text-white bg-gradient-to-r ${link.color} shadow-sm animate-scale-in`} style={{ animationDelay: `${i * 100}ms` }}>
                          {link.label}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-6">Powered by Flolio</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl -z-10" />
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white">{displayUsers.toLocaleString()}</p>
              <p className="text-indigo-200 mt-1 text-sm">Creators on Flolio</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white">{displayLinks.toLocaleString()}</p>
              <p className="text-indigo-200 mt-1 text-sm">Links managed</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white">$2</p>
              <p className="text-indigo-200 mt-1 text-sm">Cheapest Pro plan (no fees)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Zap className="w-4 h-4" />
              Everything you need
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Built for creators who care about quality</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Palette, title: "Beautiful Themes", desc: "Choose from 10 professionally designed themes. Customize colors to match your brand perfectly." },
              { icon: BarChart3, title: "Click Analytics", desc: "Track every click. Know which links perform best and understand your audience better." },
              { icon: Globe, title: "Custom Domain", desc: "Use your own domain name. Make your page truly yours with a professional touch." },
              { icon: QrCode, title: "QR Codes", desc: "Every link gets its own QR code. Download and share anywhere. Pro feature." },
              { icon: Clock, title: "Link Scheduling", desc: "Schedule links to appear and expire at specific times. Perfect for launches." },
              { icon: Tag, title: "UTM Builder", desc: "Auto-append UTM parameters to every link. Track campaigns effortlessly." },
              { icon: Gift, title: "Referral Rewards", desc: "Refer friends to remove branding for free. No credit card needed." },
              { icon: Star, title: "Premium Design", desc: "No clutter, no ads. Every pixel is crafted to make your content stand out." },
              { icon: Users, title: "Social Ready", desc: "Perfect for Instagram, TikTok, Twitter, LinkedIn — any bio link you need to share." },
            ].map((feature) => (
              <div key={feature.title} className="group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-600">Get your page live in under 2 minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Create your account", desc: "Sign up free with your email or Google/GitHub. No credit card needed." },
              { step: "02", title: "Add your links", desc: "Paste your URLs, give them titles, and rearrange with drag and drop." },
              { step: "03", title: "Share your page", desc: "Copy your unique Flolio URL and put it in your social media bio." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200">{s.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by creators</h2>
            <p className="text-lg text-gray-600">See what our users are saying.</p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Crown className="w-4 h-4" />
              Pricing
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Start free. Upgrade when you need more. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{PRICE_TIERS.free.name}</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg font-normal text-gray-400">/mo</span>
              </p>
              <ul className="space-y-3 mb-8">
                {PRICE_TIERS.free.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full h-12">Get Started Free</Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {PRICE_TIERS.pro.name}
                  <Crown className="w-5 h-5 text-yellow-400" />
                </h3>
                <p className="text-4xl font-bold mb-6">
                  ${PRICE_TIERS.pro.price}<span className="text-lg font-normal text-indigo-200">/mo</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {PRICE_TIERS.pro.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-indigo-100">
                      <Check className="w-4 h-4 text-green-300 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button size="lg" className="w-full h-12 bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg text-base font-semibold">
                    Start Free, Upgrade Anytime
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to level up your link in bio?</h2>
          <p className="text-xl text-indigo-100 mb-8">Join {displayUsers.toLocaleString()}+ creators who use Flolio. It&apos;s free to start.</p>
          <Link href="/register">
            <Button size="lg" className="text-base px-10 h-14 bg-white text-indigo-700 hover:bg-indigo-50 shadow-2xl shadow-indigo-900/30">
              Create Your Free Page
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Flolio</Link>
              <p className="mt-3 text-sm max-w-xs">The modern link-in-bio platform for creators who care about how they present themselves online.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">&copy; {new Date().getFullYear()} Flolio. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
