"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VALID_REGIONS, API_BASE_URL } from "@/lib/constants";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const codeExamples = {
  curl: `curl -X POST ${API_BASE_URL} \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"uid": "2732697922", "region": "ind"}'`,

  javascript: `const response = await fetch("${API_BASE_URL}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "YOUR_API_KEY"
  },
  body: JSON.stringify({
    uid: "2732697922",
    region: "ind"
  })
});

const data = await response.json();
console.log(data);`,

  python: `import requests

response = requests.post(
    "${API_BASE_URL}",
    headers={
        "Content-Type": "application/json",
        "x-api-key": "YOUR_API_KEY"
    },
    json={
        "uid": "2732697922",
        "region": "ind"
    }
)

data = response.json()
print(data)`,

  java: `import java.net.http.*;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();

String body = """
    {"uid": "2732697922", "region": "ind"}
    """;

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${API_BASE_URL}"))
    .header("Content-Type", "application/json")
    .header("x-api-key", "YOUR_API_KEY")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response = client.send(
    request, HttpResponse.BodyHandlers.ofString()
);
System.out.println(response.body());`,
};

const errorCodes = [
  {
    code: 401,
    error: "API key required",
    desc: "Missing x-api-key header in request",
  },
  {
    code: 401,
    error: "Invalid API key",
    desc: "The provided API key does not exist",
  },
  {
    code: 401,
    error: "API key deactivated",
    desc: "The API key has been revoked by admin",
  },
  {
    code: 429,
    error: "Monthly request limit exceeded",
    desc: "Your plan's monthly request quota is used",
  },
  {
    code: 429,
    error: "Rate limit exceeded",
    desc: "Too many requests in a short time period",
  },
  {
    code: 400,
    error: "uid and region required",
    desc: "Missing required parameters in request body",
  },
  {
    code: 400,
    error: "Invalid region",
    desc: "Region is not in the supported list",
  },
  {
    code: 200,
    error: "INVALID_UID",
    desc: "Player UID does not exist in the specified region",
  },
  {
    code: 500,
    error: "SERVER_ERROR",
    desc: "Internal server error, try again later",
  },
];

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">API Documentation</h1>
      <p className="mt-3 text-muted-foreground">
        Everything you need to integrate the FF Players Info API.
      </p>

      {/* Base URL */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Base URL</h2>
        <div className="mt-3 flex items-center gap-2">
          <code className="rounded-lg border border-border/40 bg-card/50 px-4 py-2 text-sm">
            {API_BASE_URL}
          </code>
        </div>
      </section>

      {/* Authentication */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Authentication</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          There are two ways to access the API:
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-green-400">
                Free Tier (No Signup)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>
                Use the <code className="rounded bg-muted px-1 py-0.5">/api/player</code> endpoint
                for instant access. No API key needed — just send your request and get
                50 free requests/month automatically. Visit the{" "}
                <a href="/lab" className="text-orange-500 hover:underline">Lab page</a> to test instantly.
              </p>
              <pre className="mt-2 overflow-x-auto rounded bg-background/80 p-2 text-xs">
                <code>{`POST /api/player
{
  "uid": "2732697922",
  "region": "ind"
}`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                API Key (Higher Limits)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              <p>
                For production use and higher limits, use the direct Cloud Function
                endpoint with an API key via the{" "}
                <code className="rounded bg-muted px-1 py-0.5">x-api-key</code> header.
                Get your key from the{" "}
                <a href="/pricing" className="text-orange-500 hover:underline">Pricing page</a>.
              </p>
              <pre className="mt-2 overflow-x-auto rounded bg-background/80 p-2 text-xs">
                <code>{`POST ${API_BASE_URL}
x-api-key: ff_free_xxxxx
{"uid": "...", "region": "ind"}`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Request Format */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Request Format</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Send a POST request with JSON body containing the player UID and
          region.
        </p>
        <Card className="mt-4 border-border/40 bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Request Body
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto text-sm">
              <code>{JSON.stringify(
                { uid: "string (required)", region: "string (required)" },
                null,
                2
              )}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Response Format */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Response Format</h2>

        <div className="mt-4 space-y-4">
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400">200</Badge>
                <CardTitle className="text-sm">Success Response</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs leading-relaxed">
                <code>{`{
  "success": true,
  "data": {
    "basicinfo": {
      "accountid": 2732697922,
      "accounttype": 1,
      "nickname": "Player_Name",
      "region": "IND",
      "level": 63,
      "exp": 1375572,
      "liked": 5360,
      "lastloginat": "1661916740",
      "createat": "1610687275"
    }
  },
  "meta": {
    "cached": false,
    "obVersion": "OB53",
    "plan": "free",
    "remainingRequests": 49
  }
}`}</code>
              </pre>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Error</Badge>
                <CardTitle className="text-sm">Error Response</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto text-xs">
                <code>{`{
  "success": false,
  "error": "INVALID_UID",
  "message": "Player not found"
}`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Supported Regions */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Supported Regions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {VALID_REGIONS.map((r) => (
            <Badge key={r.value} variant="outline" className="text-xs">
              {r.label}
            </Badge>
          ))}
        </div>
      </section>

      {/* Error Codes */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Error Codes</h2>
        <div className="mt-4 space-y-2">
          {errorCodes.map((e, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border/40 bg-card/50 p-3"
            >
              <Badge
                variant={e.code >= 400 ? "destructive" : "secondary"}
                className="shrink-0 text-xs"
              >
                {e.code}
              </Badge>
              <div>
                <p className="text-sm font-medium">{e.error}</p>
                <p className="text-xs text-muted-foreground">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rate Limiting */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Rate Limiting</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Each plan has a per-minute rate limit. If you exceed it, you will
          receive a 429 status code. Rate limits reset every minute. Monthly
          request limits reset at the beginning of each billing cycle.
        </p>
      </section>

      {/* Code Examples */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Code Examples</h2>
        <div className="mt-4 space-y-4">
          {Object.entries(codeExamples).map(([lang, code]) => (
            <Card key={lang} className="border-border/40 bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm capitalize">{lang}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => copyCode(code, lang)}
                  >
                    {copied === lang ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied === lang ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto text-xs leading-relaxed">
                  <code>{code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
