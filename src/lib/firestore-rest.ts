// Lightweight Firestore REST API using native crypto for JWT
// No google-auth-library or firebase-admin needed - zero heavy deps
import * as crypto from "crypto";

const PROJECT_ID = "edm-fire-app";
const SCOPES = "https://www.googleapis.com/auth/datastore";

// Service account from env
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || "";
const PRIVATE_KEY =
  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";

// Cache token to avoid re-signing on every request
let cachedToken: string | null = null;
let tokenExpiry = 0;

// Create JWT and exchange for access token using Google OAuth2
async function getAccessToken(): Promise<string> {
  // Reuse cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  const now = Math.floor(Date.now() / 1000);

  // Build JWT header and payload
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" })
  ).toString("base64url");

  const payload = Buffer.from(
    JSON.stringify({
      iss: CLIENT_EMAIL,
      scope: SCOPES,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600, // 1 hour
    })
  ).toString("base64url");

  // Sign with RSA-SHA256
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(PRIVATE_KEY, "base64url");

  const jwt = `${header}.${payload}.${signature}`;

  // Exchange JWT for access token
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();

  if (!data.access_token) {
    throw new Error(
      `Failed to get access token: ${data.error_description || data.error || "Unknown"}`
    );
  }

  // Cache the token
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;

  return cachedToken;
}

// Create a document in Firestore
export async function createDocument(
  collection: string,
  docId: string,
  data: Record<string, unknown>
): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${docId}`;

    // Convert JS object to Firestore document format
    const fields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      fields[key] = toFirestoreValue(value);
    }

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Firestore create error response:", errText);
    }

    return res.ok;
  } catch (error) {
    console.error("Firestore create error:", error);
    return false;
  }
}

// Query documents by field
export async function queryDocuments(
  collection: string,
  field: string,
  value: string
): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;

    const body = {
      structuredQuery: {
        from: [{ collectionId: collection }],
        where: {
          fieldFilter: {
            field: { fieldPath: field },
            op: "EQUAL",
            value: { stringValue: value },
          },
        },
        limit: 1,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    // If any document found, return true
    return (
      Array.isArray(data) &&
      data.some(
        (d: unknown) =>
          d && typeof d === "object" && "document" in (d as Record<string, unknown>)
      )
    );
  } catch (error) {
    console.error("Firestore query error:", error);
    return false;
  }
}

// Convert JS value to Firestore value format
function toFirestoreValue(value: unknown): Record<string, unknown> {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((v) => toFirestoreValue(v)),
      },
    };
  }
  if (typeof value === "object") {
    const fields: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}
