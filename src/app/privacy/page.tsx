import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — LinkHub",
  description: "LinkHub privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-50">
          Back to home
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-50">
          Privacy Policy
        </h1>
        <p className="mt-4 text-zinc-300">
          This is a placeholder policy. Replace with your legal terms before
          launching.
        </p>

        <div className="mt-10 space-y-8">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-50">
              What we collect
            </h2>
            <p className="text-zinc-300">
              We collect the information you provide (like your email on the
              waitlist) and basic usage data to improve product performance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-50">How we use it</h2>
            <p className="text-zinc-300">
              We use your information to operate LinkHub, communicate product
              updates, and prevent abuse.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-zinc-50">Contact</h2>
            <p className="text-zinc-300">
              If you have questions, contact support via the email listed in your
              deployment configuration.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
