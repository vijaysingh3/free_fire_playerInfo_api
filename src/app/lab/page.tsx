"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VALID_REGIONS, API_BASE_URL, LOCAL_API_URL, FREE_PLAN_LIMITS } from "@/lib/constants";
import {
  Play,
  Copy,
  Check,
  Loader2,
  Clock,
  Zap,
  AlertCircle,
  Key,
  Gauge,
  Shield,
  User,
  ClipboardCopy,
} from "lucide-react";

// Browser Fingerprint Generator
async function generateFingerprint(): Promise<string> {
  const components: string[] = [];

  // User Agent
  components.push(navigator.userAgent);

  // Screen
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);
  components.push(navigator.languages?.join(",") || "");

  // Platform
  components.push(navigator.platform || "");

  // Hardware
  components.push(String(navigator.hardwareConcurrency || 0));
  components.push(String((navigator as unknown as Record<string, unknown>).deviceMemory || 0));

  // Touch support
  components.push(String(navigator.maxTouchPoints || 0));

  // Canvas fingerprint
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(0, 0, 200, 50);
      ctx.fillStyle = "#069";
      ctx.fillText("FF-API-FP", 2, 15);
      ctx.fillStyle = "rgba(102,204,0,0.7)";
      ctx.fillText("FF-API-FP", 4, 17);
      components.push(canvas.toDataURL());
    }
  } catch {
    components.push("canvas-blocked");
  }

  // WebGL fingerprint
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const glCtx = gl as WebGLRenderingContext;
      const debugInfo = glCtx.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        components.push(glCtx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "");
        components.push(glCtx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
      }
    }
  } catch {
    components.push("webgl-blocked");
  }

  // Combine and hash using SubtleCrypto
  const combined = components.join("|||");
  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return `fp_${hashHex}`;
}

// BasicInfo field labels
const BASIC_INFO_LABELS: Record<string, string> = {
  accountid: "Account ID",
  accounttype: "Account Type",
  nickname: "Nickname",
  externalid: "External ID",
  region: "Region",
  level: "Level",
  exp: "Experience",
  liked: "Likes",
  lastloginat: "Last Login",
  createat: "Created At",
};

function formatTimestamp(ts: string | number): string {
  const num = Number(ts);
  if (isNaN(num) || num === 0) return "N/A";
  if (num > 1e12) return new Date(num).toLocaleString();
  return new Date(num * 1000).toLocaleString();
}

function formatBasicInfoValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "N/A";
  if (key === "lastloginat" || key === "createat") return formatTimestamp(String(value));
  if (key === "accounttype") return Number(value) === 1 ? "Normal" : Number(value) === 2 ? "Facebook" : String(value);
  if (key === "liked" || key === "exp") return Number(value).toLocaleString();
  return String(value);
}

// Extended response type for free tier
interface FreeTierMeta {
  freeTier?: boolean;
  monthlyLimit?: number;
  monthlyUsed?: number;
  monthlyRemaining?: number;
  resetsOn?: string;
  cached?: boolean;
  obVersion?: string;
  plan?: string;
  remainingRequests?: number;
}

interface ApiResponse {
  success?: boolean;
  error?: string;
  meta?: FreeTierMeta;
  [key: string]: unknown;
}

export default function LabPage() {
  // Mode
  const [mode, setMode] = useState<"quick" | "apikey">("quick");

  // Fingerprint state
  const [fingerprint, setFingerprint] = useState<string>("");
  const [fpLoading, setFpLoading] = useState(true);
  const [monthlyUsed, setMonthlyUsed] = useState<number>(0);
  const [monthlyRemaining, setMonthlyRemaining] = useState<number>(FREE_PLAN_LIMITS.requestsPerMonth);

  // API Key mode
  const [apiKey, setApiKey] = useState("");

  // Common fields
  const [uid, setUid] = useState("2732697922");
  const [region, setRegion] = useState("ind");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setTime] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Generate fingerprint on mount
  useEffect(() => {
    generateFingerprint()
      .then((fp) => {
        setFingerprint(fp);
        setFpLoading(false);
      })
      .catch(() => {
        setFpLoading(false);
      });
  }, []);

  // Security: Disable DevTools, right-click, keyboard shortcuts
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => { e.preventDefault(); };
    const disableKeyboard = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") { e.preventDefault(); return; }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) { e.preventDefault(); return; }
      // Ctrl+U (view source)
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) { e.preventDefault(); return; }
      // Ctrl+S (save)
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) { e.preventDefault(); return; }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeyboard);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKeyboard);
    };
  }, []);

  const updateUsageFromResponse = useCallback((data: ApiResponse) => {
    if (data?.meta) {
      const meta = data.meta;
      if (meta.monthlyUsed !== undefined) {
        setMonthlyUsed(meta.monthlyUsed);
        setMonthlyRemaining(meta.monthlyRemaining ?? 0);
      } else if (meta.remainingRequests !== undefined) {
        setMonthlyRemaining(meta.remainingRequests);
        setMonthlyUsed(FREE_PLAN_LIMITS.requestsPerMonth - meta.remainingRequests);
      }
    }
  }, []);

  // Quick Test handler (fingerprint-based, no API key)
  const handleQuickTest = async () => {
    if (!uid || !region || !fingerprint) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatus(null);

    const start = Date.now();

    try {
      const res = await fetch(LOCAL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, region, fingerprint }),
      });

      const elapsed = Date.now() - start;
      setTime(elapsed);
      setStatus(res.status);

      const data = await res.json();
      setResponse(data);

      if (!data.success) {
        setError(data.error || "Unknown error");
      }

      updateUsageFromResponse(data);
    } catch (err: unknown) {
      const elapsed = Date.now() - start;
      setTime(elapsed);
      setStatus(0);
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  // API Key handler (direct to Cloud Function)
  const handleApiKeyTest = async () => {
    if (!uid || !region || !apiKey) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatus(null);

    const start = Date.now();

    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ uid, region }),
      });

      const elapsed = Date.now() - start;
      setTime(elapsed);
      setStatus(res.status);

      const data = await res.json();
      setResponse(data);

      if (!data.success) {
        setError(data.error || "Unknown error");
      }

      updateUsageFromResponse(data);
    } catch (err: unknown) {
      const elapsed = Date.now() - start;
      setTime(elapsed);
      setStatus(0);
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = mode === "quick" ? handleQuickTest : handleApiKeyTest;
  const canTest = mode === "quick" ? !loading && !!uid && !!region && !!fingerprint : !loading && !!uid && !!region && !!apiKey;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Extract basicinfo from response
  const basicInfo = response?.data && typeof response.data === "object"
    ? (response.data as Record<string, unknown>).basicinfo as Record<string, unknown> | undefined
    : undefined;

  // Filtered response (without basicinfo, shown below)
  const filteredResponse = response ? (() => {
    if (!response.data || typeof response.data !== "object") return response;
    const data = response.data as Record<string, unknown>;
    const { basicinfo, ...rest } = data;
    return { ...response, data: rest };
  })() : null;

  const quickCurl = `curl -X POST https://your-domain.com/api/player \\
  -H "Content-Type: application/json" \\
  -d '{"uid": "${uid}", "region": "${region}", "fingerprint": "${fingerprint || "YOUR_FINGERPRINT"}"}'`;

  const quickJs = `const response = await fetch("/api/player", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uid: "${uid}",
    region: "${region}",
    fingerprint: "${fingerprint || "YOUR_FINGERPRINT"}"
  })
});
const data = await response.json();`;

  const apiKeyCurl = `curl -X POST ${API_BASE_URL} \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"uid": "${uid}", "region": "${region}"}'`;

  const apiKeyJs = `const response = await fetch("${API_BASE_URL}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${apiKey}"
  },
  body: JSON.stringify({ uid: "${uid}", region: "${region}" })
});
const data = await response.json();`;

  const currentCurl = mode === "quick" ? quickCurl : apiKeyCurl;
  const currentJs = mode === "quick" ? quickJs : apiKeyJs;

  const usagePercent = (monthlyUsed / FREE_PLAN_LIMITS.requestsPerMonth) * 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6" onContextMenu={(e) => e.preventDefault()}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">🔬 Live Testing Lab</h1>
        <p className="mt-3 text-muted-foreground">Test the FF Players Info API instantly. No signup needed.</p>
      </div>

      {/* Mode Toggle + Usage Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={mode} onValueChange={(v) => setMode(v as "quick" | "apikey")} className="w-fit">
          <TabsList>
            <TabsTrigger value="quick" className="gap-1.5"><Zap className="h-4 w-4" />Quick Test (Free)</TabsTrigger>
            <TabsTrigger value="apikey" className="gap-1.5"><Key className="h-4 w-4" />With API Key</TabsTrigger>
          </TabsList>
        </Tabs>
        {mode === "quick" && (
          <div className="flex items-center gap-3">
            <Gauge className="h-4 w-4 text-orange-500" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{monthlyUsed}/{FREE_PLAN_LIMITS.requestsPerMonth} used</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                <div className={`h-full rounded-full transition-all ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 70 ? "bg-orange-500" : "bg-green-500"}`} style={{ width: `${Math.min(usagePercent, 100)}%` }} />
              </div>
              <Badge variant="outline" className="text-xs">{monthlyRemaining} left</Badge>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left - Input */}
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-orange-500" />
                {mode === "quick" ? "Quick Test (No Key Needed)" : "API Request"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode === "quick" ? (
                <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2.5">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-400">Free access active — {FREE_PLAN_LIMITS.requestsPerMonth} requests/month, no signup needed</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="ff_free_xxxxxxxxxxxxxxxxxxxxxx" className="font-mono text-sm" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="uid">Player UID</Label>
                <Input id="uid" value={uid} onChange={(e) => setUid(e.target.value)} placeholder="e.g., 2732697922" className="font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
                  <SelectContent>
                    {VALID_REGIONS.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleTest} disabled={!canTest} className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white" size="lg">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {loading ? "Testing..." : mode === "quick" ? "Test Now (Free)" : "Test API"}
              </Button>
              {mode === "quick" && monthlyRemaining <= 5 && monthlyRemaining > 0 && (
                <p className="text-center text-xs text-orange-400">Only {monthlyRemaining} requests remaining this month. <a href="/pricing" className="underline hover:text-orange-300">Get an API key</a> for more.</p>
              )}
              {mode === "quick" && monthlyRemaining === 0 && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-xs text-red-400">
                  Monthly free limit reached. <a href="/pricing" className="underline hover:text-red-300">Get an API key</a> for unlimited access.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code Snippets */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader><CardTitle className="text-lg">Code Snippets</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">cURL</span>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => copyToClipboard(currentCurl, "curl")}>
                    {copied === "curl" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied === "curl" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border/40 bg-background/80 p-3 text-xs"><code>{currentCurl}</code></pre>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">JavaScript</span>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => copyToClipboard(currentJs, "js")}>
                    {copied === "js" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied === "js" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border/40 bg-background/80 p-3 text-xs"><code>{currentJs}</code></pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right - Response */}
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-orange-500" />Response
                </CardTitle>
                <div className="flex items-center gap-2">
                  {status !== null && <Badge variant={status >= 200 && status < 300 ? "default" : "destructive"} className="text-xs">{status}</Badge>}
                  {responseTime !== null && <Badge variant="outline" className="text-xs">{responseTime}ms</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <p className="text-sm font-medium text-red-400">{error}</p>
                </div>
              )}

              {/* === BASICINFO GREEN HIGHLIGHT === */}
              {basicInfo && (
                <div className="mb-4 overflow-hidden rounded-lg border border-green-500/30 bg-green-500/5">
                  <div className="flex items-center justify-between border-b border-green-500/20 bg-green-500/10 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">Player Info</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      onClick={() => copyToClipboard(JSON.stringify(basicInfo, null, 2), "basicinfo")}
                    >
                      {copied === "basicinfo" ? <Check className="h-3 w-3" /> : <ClipboardCopy className="h-3 w-3" />}
                      {copied === "basicinfo" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <div className="grid gap-0 divide-y divide-green-500/10">
                    {Object.entries(BASIC_INFO_LABELS).map(([key, label]) => {
                      const rawValue = basicInfo[key];
                      const displayValue = formatBasicInfoValue(key, rawValue);
                      return (
                        <div key={key} className="flex items-center justify-between px-4 py-2">
                          <span className="text-xs text-green-400/70">{label}</span>
                          <span className={`text-sm font-medium ${key === "nickname" ? "text-green-300 text-base" : "text-green-400"}`}>{displayValue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* === FULL RESPONSE (filtered) with Copy button === */}
              {filteredResponse ? (
                <div className="relative">
                  <div className="absolute right-2 top-2 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-xs bg-background/80 hover:bg-background"
                      onClick={() => copyToClipboard(JSON.stringify(response, null, 2), "response")}
                    >
                      {copied === "response" ? <Check className="h-3 w-3" /> : <ClipboardCopy className="h-3 w-3" />}
                      {copied === "response" ? "Copied!" : "Copy JSON"}
                    </Button>
                  </div>
                  <pre className="overflow-x-auto rounded-lg border border-green-500/20 bg-background/80 p-4 pr-24 text-xs leading-relaxed">
                    <code className="text-green-400">{JSON.stringify(filteredResponse, null, 2)}</code>
                  </pre>
                </div>
              ) : !response ? (
                <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border/40 text-muted-foreground">
                  <p className="text-sm">Click &quot;{mode === "quick" ? "Test Now" : "Test API"}&quot; to see the response</p>
                </div>
              ) : null}

              {/* Meta badges */}
              {response?.success && response?.meta && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {response.meta.freeTier && <Badge className="bg-green-500/20 text-green-400 text-xs">Free Tier</Badge>}
                  <Badge variant="outline" className="text-xs">Cached: {response.meta.cached ? "Yes" : "No"}</Badge>
                  {response.meta.obVersion && <Badge variant="outline" className="text-xs">OB: {response.meta.obVersion}</Badge>}
                  <Badge variant="outline" className="text-xs">Plan: {response.meta.plan || "free"}</Badge>
                  {response.meta.monthlyRemaining !== undefined ? (
                    <Badge variant="outline" className="text-xs">Monthly: {response.meta.monthlyRemaining} left</Badge>
                  ) : (
                    response.meta.remainingRequests !== undefined && <Badge variant="outline" className="text-xs">Remaining: {response.meta.remainingRequests}</Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader><CardTitle className="text-lg">Quick Info</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                {mode === "quick" ? (
                  <>
                    <p><span className="font-medium text-foreground">Endpoint:</span> <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/player</code></p>
                    <p><span className="font-medium text-foreground">Auth:</span> Automatic (no key needed)</p>
                    <p><span className="font-medium text-foreground">Free Limit:</span> {FREE_PLAN_LIMITS.requestsPerMonth} requests/month</p>
                    <p><span className="font-medium text-foreground">Rate Limit:</span> {FREE_PLAN_LIMITS.rateLimitPerMinute} req/min</p>
                    <p><span className="font-medium text-foreground">Signup:</span> Not required</p>
                  </>
                ) : (
                  <>
                    <p><span className="font-medium text-foreground">Base URL:</span> <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{API_BASE_URL}</code></p>
                    <p><span className="font-medium text-foreground">Method:</span> POST</p>
                    <p><span className="font-medium text-foreground">Auth:</span> x-api-key header</p>
                    <p><span className="font-medium text-foreground">Get Key:</span> <a href="/pricing" className="text-orange-500 hover:underline">Pricing page</a></p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
