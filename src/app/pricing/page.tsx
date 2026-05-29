"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/constants";
import { Check, Flame, Loader2 } from "lucide-react";

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyError, setKeyError] = useState<string | null>(null);

  const handleGenerateKey = async () => {
    if (!email) return;
    setGenerating(true);
    setKeyError(null);
    setGeneratedKey(null);

    try {
      const res = await fetch("/api/generate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan: "free" }),
      });

      const data = await res.json();

      if (data.success) {
        setGeneratedKey(data.apiKey);
      } else {
        setKeyError(data.error || "Failed to generate key");
      }
    } catch {
      setKeyError("Network error. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-muted-foreground">
          Start free with 50 requests/month. Upgrade when you need more.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={`relative border-border/40 bg-card/50 transition-colors ${
              plan.popular
                ? "border-orange-500/50 ring-1 ring-orange-500/20"
                : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-orange-500 text-white">
                  <Flame className="mr-1 h-3 w-3" /> Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-4xl font-bold">{plan.priceLabel}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {plan.requestsPerMonth}
                </span>{" "}
                requests/month
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {plan.rateLimit}
                </span>{" "}
                rate limit
              </div>

              <div className="border-t border-border/40 pt-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                {plan.name === "Free" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setGeneratedKey(null);
                          setKeyError(null);
                        }}
                      >
                        {plan.buttonText}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Get Your Free API Key</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="keyEmail">Email Address</Label>
                          <Input
                            id="keyEmail"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <Button
                          onClick={handleGenerateKey}
                          disabled={generating || !email}
                          className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          {generating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : null}
                          {generating
                            ? "Generating..."
                            : "Generate API Key"}
                        </Button>

                        {keyError && (
                          <p className="text-sm text-red-400">{keyError}</p>
                        )}

                        {generatedKey && (
                          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                            <p className="mb-2 text-sm font-medium text-green-400">
                              Your API Key:
                            </p>
                            <code className="block rounded bg-background/80 p-2 text-xs break-all">
                              {generatedKey}
                            </code>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Save this key securely. You won&apos;t see it again.
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : plan.name === "Enterprise" ? (
                  <Button variant="outline" className="w-full">
                    {plan.buttonText}
                  </Button>
                ) : (
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full ${
                      plan.popular
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : ""
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="mb-8 text-center text-2xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "What happens when I exceed my monthly limit?",
              a: "You will receive a 429 error with a message indicating your monthly request limit has been exceeded. You can upgrade your plan or wait for the next billing cycle.",
            },
            {
              q: "Can I use the API in my mobile app?",
              a: "Yes! The API is platform-agnostic. You can use it in web apps, mobile apps, servers, or any environment that supports HTTP requests.",
            },
            {
              q: "How fast is the API?",
              a: "Average response time is under 2 seconds. Cached responses return in under 100ms. The API uses a multi-layer fallback system for maximum reliability.",
            },
            {
              q: "What data does the API return?",
              a: "The API returns the complete Free Fire server response including nickname, level, region, experience, likes, account type, creation date, and last login time.",
            },
            {
              q: "Is there a refund policy?",
              a: "Yes, we offer a 7-day money-back guarantee on all paid plans. Contact support if you are not satisfied.",
            },
            {
              q: "Can I upgrade or downgrade my plan anytime?",
              a: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.",
            },
          ].map((faq) => (
            <Card
              key={faq.q}
              className="border-border/40 bg-card/50"
            >
              <CardContent className="p-5">
                <h3 className="font-medium">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
