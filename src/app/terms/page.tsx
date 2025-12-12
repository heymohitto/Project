import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — LinkHub",
  description: "LinkHub terms of service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-50">
          Back to home
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
          Terms of Service
        </h1>
        <p className="mt-4 text-zinc-300">
          This is a placeholder set of terms. Replace with your legal terms
          before launching.
        </p>

        <div className="mt-10 space-y-8">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-50">Usage</h2>
            <p className="text-zinc-300">
              You agree to use LinkHub in compliance with applicable laws and not
              to abuse, scrape, or disrupt the service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-50">Content</h2>
            <p className="text-zinc-300">
              You are responsible for the content and links you publish. We may
              take action on content that violates our policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-50">Availability</h2>
            <p className="text-zinc-300">
              We aim for high uptime but do not guarantee uninterrupted service.
              Features may change as the product evolves.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
