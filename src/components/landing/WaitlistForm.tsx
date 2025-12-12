"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const waitlistSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const isLoading = status.state === "loading";

  const helperText = useMemo(() => {
    if (status.state === "error") return status.message;
    if (status.state === "success") return status.message;
    return "No spam. Unsubscribe anytime.";
  }, [status]);

  const helperTone =
    status.state === "error"
      ? "text-red-300"
      : status.state === "success"
        ? "text-emerald-300"
        : "text-zinc-400";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = waitlistSchema.safeParse({ email });
    if (!parsed.success) {
      setStatus({
        state: "error",
        message: parsed.error.issues[0]?.message ?? "Invalid email",
      });
      return;
    }

    setStatus({ state: "loading" });

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error || "Failed to join waitlist");
      }

      setStatus({
        state: "success",
        message: "You're in — we'll email you when the next drop ships.",
      });
      setEmail("");
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.state !== "idle") setStatus({ state: "idle" });
          }}
          disabled={isLoading}
          aria-label="Email address"
          className="h-11 rounded-xl border-white/10 bg-white/5 text-zinc-50 placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-fuchsia-400"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-6 text-white shadow-sm shadow-fuchsia-500/20 hover:brightness-110"
        >
          {isLoading ? "Joining..." : "Join waitlist"}
        </Button>
      </div>

      <p className={`mt-2 text-sm ${helperTone}`} aria-live="polite">
        {helperText}
      </p>
    </form>
  );
}
