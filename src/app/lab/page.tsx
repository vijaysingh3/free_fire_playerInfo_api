"use client";

import { useState } from "react";
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
import { VALID_REGIONS, API_BASE_URL } from "@/lib/constants";
import {
  Play,
  Copy,
  Check,
  Loader2,
  Clock,
  Zap,
  AlertCircle,
} from "lucide-react";

export default function LabPage() {
  const [apiKey, setApiKey] = useState("ff_free_c01e3124a7b44694a0ad2c72");
  const [uid, setUid] = useState("2732697922");
  const [region, setRegion] = useState("ind");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setTime] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleTest = async () => {
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
    } catch (err: unknown) {
      const elapsed = Date.now() - start;
      setTime(elapsed);
      setStatus(0);
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const curlCommand = `curl -X POST ${API_BASE_URL} \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"uid": "${uid}", "region": "${region}"}'`;

  const jsCode = `const response = await fetch("${API_BASE_URL}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${apiKey}"
  },
  body: JSON.stringify({ uid: "${uid}", region: "${region}" })
});
const data = await response.json();
console.log(data);`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          🔬 Live Testing Lab
        </h1>
        <p className="mt-3 text-muted-foreground">
          Test the FF Players Info API in real-time. Enter a player UID and see
          the response instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left - Input */}
        <div className="space-y-6">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-orange-500" />
                API Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uid">Player UID</Label>
                <Input
                  id="uid"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="e.g., 2732697922"
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleTest}
                disabled={loading || !uid || !region || !apiKey}
                className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {loading ? "Testing..." : "Test API"}
              </Button>
            </CardContent>
          </Card>

          {/* Code Snippets */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Code Snippets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* cURL */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    cURL
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => copyToClipboard(curlCommand, "curl")}
                  >
                    {copied === "curl" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied === "curl" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border/40 bg-background/80 p-3 text-xs">
                  <code>{curlCommand}</code>
                </pre>
              </div>

              {/* JavaScript */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    JavaScript
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => copyToClipboard(jsCode, "js")}
                  >
                    {copied === "js" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied === "js" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border/40 bg-background/80 p-3 text-xs">
                  <code>{jsCode}</code>
                </pre>
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
                  <Clock className="h-5 w-5 text-orange-500" />
                  Response
                </CardTitle>
                <div className="flex items-center gap-2">
                  {status !== null && (
                    <Badge
                      variant={status >= 200 && status < 300 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {status}
                    </Badge>
                  )}
                  {responseTime !== null && (
                    <Badge variant="outline" className="text-xs">
                      {responseTime}ms
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {response ? (
                <pre className="overflow-x-auto rounded-lg border border-green-500/20 bg-background/80 p-4 text-xs leading-relaxed">
                  <code className="text-green-400">{JSON.stringify(response, null, 2)}</code>
                </pre>
              ) : (
                <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-border/40 text-muted-foreground">
                  <p className="text-sm">
                    Click &quot;Test API&quot; to see the response
                  </p>
                </div>
              )}

              {response?.success && response?.meta && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Cached: {response.meta.cached ? "Yes" : "No"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    OB: {response.meta.obVersion}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Plan: {response.meta.plan}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Remaining: {response.meta.remainingRequests}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Base URL:</span>{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {API_BASE_URL}
                  </code>
                </p>
                <p>
                  <span className="font-medium text-foreground">Method:</span>{" "}
                  POST
                </p>
                <p>
                  <span className="font-medium text-foreground">Auth:</span>{" "}
                  x-api-key header
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Test Key:
                  </span>{" "}
                  Free plan - 50 requests/month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
