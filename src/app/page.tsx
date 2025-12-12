import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  LayoutTemplate,
  Link2,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { Reveal } from "@/components/landing/Reveal";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "LinkHub — The premium bio link for gamers",
  description:
    "A guns.lol-inspired, ultra-minimal bio link platform for gamers and creators. Custom themes, lightning-fast pages, and built-in analytics.",
  openGraph: {
    title: "LinkHub — The premium bio link for gamers",
    description:
      "A guns.lol-inspired, ultra-minimal bio link platform for gamers and creators.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkHub — The premium bio link for gamers",
    description:
      "A guns.lol-inspired, ultra-minimal bio link platform for gamers and creators.",
  },
};

const features = [
  {
    icon: LayoutTemplate,
    title: "Themes that look expensive",
    description:
      "Minimal, dark-first templates with premium spacing, typography, and motion — no clutter.",
  },
  {
    icon: Link2,
    title: "Links that feel instant",
    description:
      "Fast pages, optimized assets, and a clean layout that keeps attention on your content.",
  },
  {
    icon: BarChart3,
    title: "Built-in analytics",
    description:
      "Know what converts: clicks, referrers, devices, and link performance — without extra scripts.",
  },
  {
    icon: Wand2,
    title: "Custom blocks",
    description:
      "Drop in socials, embeds, highlights, and call-to-action buttons with pixel-perfect alignment.",
  },
  {
    icon: ShieldCheck,
    title: "Creator-grade security",
    description:
      "Modern auth, rate limits, and privacy-friendly defaults designed for high traffic.",
  },
  {
    icon: Zap,
    title: "Ship edits in seconds",
    description:
      "Update your page live — new links, new styling, new campaigns — without deployments.",
  },
];

const testimonials = [
  {
    name: "Nova",
    role: "Twitch Partner",
    quote:
      "LinkHub is the first bio link that actually matches my brand — dark, clean, and ridiculously fast.",
  },
  {
    name: "Rex",
    role: "Esports org manager",
    quote:
      "Our roster links finally feel consistent. The layouts are premium and the analytics are surprisingly useful.",
  },
  {
    name: "Mina",
    role: "YouTube creator",
    quote:
      "The micro-interactions are subtle but make the page feel high-end. It converts way better than my old setup.",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "$0",
    subtitle: "Clean basics",
    features: [
      "Unlimited links",
      "Dark premium theme",
      "Custom social icons",
      "Mobile-first layout",
    ],
    cta: { label: "Start free", href: "/register" },
  },
  {
    name: "Pro",
    price: "$9",
    subtitle: "For creators",
    highlight: true,
    features: [
      "Everything in Starter",
      "Built-in analytics",
      "Advanced blocks & embeds",
      "Priority page speed",
      "Custom fonts & buttons",
    ],
    cta: { label: "Go Pro", href: "/register" },
  },
  {
    name: "Elite",
    price: "$19",
    subtitle: "For teams",
    features: [
      "Everything in Pro",
      "Team access",
      "Custom domain",
      "UTM & campaign tools",
      "Early feature drops",
    ],
    cta: { label: "Join Elite", href: "#waitlist" },
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.25),rgba(0,0,0,0)_60%)] blur-2xl" />
        <div className="absolute -bottom-56 right-[-10%] h-[520px] w-[720px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.22),rgba(0,0,0,0)_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.18] [mask-image:radial-gradient(circle_at_top,black,transparent_70%)]" />
      </div>

      <LandingHeader />

      <main>
        <section className="relative pt-14 sm:pt-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
                <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
                guns.lol-inspired. built for gamers.
              </div>

              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
                Your handle.
                <span className="block bg-gradient-to-r from-fuchsia-300 to-violet-300 bg-clip-text text-transparent">
                  One link.
                </span>
                A page that looks premium.
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-zinc-300">
                LinkHub is the minimalist bio link platform with a dark, high-end
                aesthetic — fast, responsive, and designed to convert.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  className="h-11 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-7 text-white shadow-sm shadow-fuchsia-500/20 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-fuchsia-400"
                >
                  <Link href="/register">
                    Claim your handle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border-white/10 bg-white/5 px-7 text-zinc-100 hover:bg-white/10"
                >
                  <a href="#pricing">See pricing</a>
                </Button>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
                {[{ k: "< 1s", v: "load times" }, { k: "99.9%", v: "uptime" }, { k: "0", v: "clutter" }].map(
                  (stat) => (
                    <div
                      key={stat.v}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="text-lg font-semibold text-zinc-50">
                        {stat.k}
                      </div>
                      <div className="text-xs text-zinc-400">{stat.v}</div>
                    </div>
                  )
                )}
              </div>
            </div>

            <Reveal className="lg:justify-self-end">
              <div className="relative">
                <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 blur-xl" />

                <div className="relative rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-50">
                        @yourhandle
                      </div>
                      <div className="text-xs text-zinc-400">
                        linkhub.gg/yourhandle
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {["Stream", "YouTube", "Merch", "Discord"].map((label) => (
                      <div
                        key={label}
                        className="group flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-white/15 hover:bg-zinc-950/60"
                      >
                        <span className="text-sm text-zinc-200">{label}</span>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-zinc-200 transition-colors group-hover:bg-white/10">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Today</span>
                      <span className="text-xs text-zinc-400">Clicks</span>
                    </div>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="text-2xl font-semibold">1,284</div>
                      <div className="flex items-center gap-1 text-xs text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        +12.4%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="features" className="relative border-t border-white/10 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                  Everything you need. Nothing you don’t.
                </h2>
                <p className="mt-4 text-lg text-zinc-300">
                  Built for creators who care about aesthetic, speed, and
                  conversion.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Reveal key={feature.title} delayMs={idx * 70}>
                    <Card className="h-full rounded-3xl border-white/10 bg-white/5 shadow-none backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/[0.07]">
                      <CardHeader className="space-y-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                          <Icon className="h-5 w-5 text-zinc-100" />
                        </div>
                        <CardTitle className="text-lg text-zinc-50">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm leading-6 text-zinc-300">
                        {feature.description}
                      </CardContent>
                    </Card>
                  </Reveal>
                );
              })}
            </div>

            <Reveal className="mt-10" delayMs={200}>
              <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-white/[0.02] px-6 py-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-zinc-50">
                    Want a page that feels like a product?
                  </p>
                  <p className="mt-1 text-sm text-zinc-300">
                    Start with a premium theme, then customize everything.
                  </p>
                </div>
                <Button
                  asChild
                  className="h-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:brightness-110"
                >
                  <Link href="/register">Build mine</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="social-proof"
          className="relative border-t border-white/10 py-20"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                    Social proof that doesn’t look cheesy.
                  </h2>
                  <p className="mt-4 text-lg text-zinc-300">
                    Subtle testimonials, clean stats, and a premium feel.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ k: "12k+", v: "pages" }, { k: "3.1M", v: "clicks" }, { k: "4.9/5", v: "rating" }].map(
                    (stat) => (
                      <div
                        key={stat.v}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center"
                      >
                        <div className="text-lg font-semibold">{stat.k}</div>
                        <div className="text-xs text-zinc-400">{stat.v}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {testimonials.map((t, idx) => (
                <Reveal key={t.name} delayMs={idx * 90}>
                  <Card className="h-full rounded-3xl border-white/10 bg-white/5 shadow-none backdrop-blur">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-base">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                          <span className="text-xs font-semibold text-zinc-100">
                            {t.name.slice(0, 1)}
                          </span>
                        </span>
                        <span>
                          <span className="block text-zinc-50">{t.name}</span>
                          <span className="block text-xs font-normal text-zinc-400">
                            {t.role}
                          </span>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-6 text-zinc-300">
                      
                      “{t.quote}”
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="relative border-t border-white/10 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                  Simple pricing. Premium result.
                </h2>
                <p className="mt-4 text-lg text-zinc-300">
                  Start free, upgrade when your audience grows.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {tiers.map((tier, idx) => (
                <Reveal key={tier.name} delayMs={idx * 80}>
                  <Card
                    className={cn(
                      "h-full rounded-3xl border-white/10 bg-white/5 shadow-none backdrop-blur",
                      tier.highlight &&
                        "relative border-fuchsia-400/40 bg-gradient-to-b from-fuchsia-500/10 to-white/[0.03]"
                    )}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-zinc-50">
                            {tier.name}
                          </CardTitle>
                          <p className="mt-1 text-sm text-zinc-400">
                            {tier.subtitle}
                          </p>
                        </div>
                        {tier.highlight ? (
                          <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-200">
                            Most popular
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-semibold text-zinc-50">
                          {tier.price}
                        </span>
                        <span className="pb-1 text-sm text-zinc-400">/mo</span>
                      </div>

                      <Button
                        asChild
                        className={cn(
                          "mt-2 h-11 w-full rounded-2xl",
                          tier.highlight
                            ? "bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white hover:brightness-110"
                            : "bg-white/10 text-zinc-50 hover:bg-white/15"
                        )}
                      >
                        {tier.cta.href.startsWith("#") ? (
                          <a href={tier.cta.href}>{tier.cta.label}</a>
                        ) : (
                          <Link href={tier.cta.href}>{tier.cta.label}</Link>
                        )}
                      </Button>
                    </CardHeader>

                    <CardContent>
                      <ul className="space-y-3 text-sm text-zinc-300">
                        {tier.features.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                              <Check className="h-3.5 w-3.5 text-emerald-300" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-10" delayMs={160}>
              <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6">
                <p className="text-sm text-zinc-300">
                  Want enterprise controls or custom rollouts?{" "}
                  <a
                    href="#waitlist"
                    className="font-medium text-zinc-50 underline underline-offset-4 hover:text-white"
                  >
                    Talk to us.
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="waitlist" className="relative border-t border-white/10 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                    Get early access.
                  </h2>
                  <p className="mt-4 text-lg text-zinc-300">
                    Join the waitlist for new templates, premium drops, and creator
                    features.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                    {["New themes", "Analytics updates", "Creator perks"].map(
                      (x) => (
                        <span
                          key={x}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
                        >
                          {x}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <WaitlistForm />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-400" />
              </span>
              <span className="font-semibold text-zinc-50">LinkHub</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
              A premium, dark-first bio link platform for gamers, streamers, and
              creators.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 md:col-span-2 md:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-zinc-50">Product</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>
                  <a href="#features" className="hover:text-zinc-50">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-zinc-50">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/register" className="hover:text-zinc-50">
                    Get started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-50">Company</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>
                  <a href="#waitlist" className="hover:text-zinc-50">
                    Waitlist
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-zinc-50">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-50">Legal</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>
                  <Link href="/privacy" className="hover:text-zinc-50">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-zinc-50">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
               {new Date().getFullYear()} LinkHub. All rights reserved.
            </p>
            <p>
              Crafted for speed. Styled for the spotlight.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
