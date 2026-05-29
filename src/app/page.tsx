"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Flame,
  Zap,
  Shield,
  Globe,
  Clock,
  Key,
  ArrowRight,
  Code2,
  Activity,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Average response time under 2 seconds. NPM-based primary layer with automatic fallback for maximum reliability.",
  },
  {
    icon: Globe,
    title: "12 Regions",
    description:
      "Support for all Free Fire regions including IND, BR, SG, RU, ID, TW, US, VN, TH, ME, PK, CIS, and BD.",
  },
  {
    icon: Key,
    title: "API Key Auth",
    description:
      "Secure API key authentication. Each developer gets a unique key with plan-based rate limiting and usage tracking.",
  },
  {
    icon: Shield,
    title: "Rate Limiting",
    description:
      "Automatic rate limiting per plan. Prevents abuse and ensures fair usage across all API consumers.",
  },
  {
    icon: Activity,
    title: "99.9% Uptime",
    description:
      "Multi-layer fallback architecture with auto version upgrade on 503 errors ensures maximum availability.",
  },
  {
    icon: Clock,
    title: "Auto Versioning",
    description:
      "Automatic OB version upgrade when Free Fire updates. No manual intervention needed, no downtime.",
  },
];

const stats = [
  { value: "10K+", label: "API Requests Served" },
  { value: "12", label: "Regions Supported" },
  { value: "<2s", label: "Avg Response Time" },
  { value: "99.9%", label: "Uptime" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-400">
              <Flame className="h-4 w-4" />
              Free Fire Player Data API
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Player Data,{" "}
              <span className="text-orange-500">One API Call</span> Away
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              Get Free Fire player nickname, level, region, and full profile
              data through a simple REST API. Built for developers, by
              developers.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/lab">
                <Button
                  size="lg"
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Code2 className="h-4 w-4" />
                  Try Live Lab
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="gap-2">
                  Read Docs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Code Preview */}
            <div className="mt-12 rounded-xl border border-border/60 bg-card/50 p-1 text-left">
              <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-muted-foreground">
                  terminal
                </span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm">
                <code>
                  <span className="text-green-400">$</span>{" "}
                  <span className="text-foreground">curl -X POST</span>{" "}
                  <span className="text-orange-400">
                    https://asia-south1-edm-fire-app.cloudfunctions.net/ff_players_info_v1
                  </span>
                  {"\n"}
                  {"  "}
                  <span className="text-foreground">-H</span>{" "}
                  <span className="text-yellow-300">
                    &quot;x-api-key: YOUR_KEY&quot;
                  </span>{" "}
                  <span className="text-foreground">-H</span>{" "}
                  <span className="text-yellow-300">
                    &quot;Content-Type: application/json&quot;
                  </span>{" "}
                  {"\n"}
                  {"  "}
                  <span className="text-foreground">-d</span>{" "}
                  <span className="text-yellow-300">
                    &apos;&#123;&quot;uid&quot;: &quot;2732697922&quot;,
                    &quot;region&quot;: &quot;ind&quot;&#125;&apos;
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Why Developers Choose{" "}
              <span className="text-orange-500">FF Players Info</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Enterprise-grade reliability with developer-friendly simplicity.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/40 bg-card/50 transition-colors hover:border-orange-500/30"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5 p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mt-4 text-muted-foreground">
              Get your free API key in seconds. No credit card required.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Get Free API Key
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
