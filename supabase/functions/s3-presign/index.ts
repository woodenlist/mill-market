import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BUCKET = "millmarket-s3";
const REGION = "us-east-2";
const SERVICE = "s3";
const HOST = `${BUCKET}.s3.${REGION}.amazonaws.com`;
const EXPIRY_SECONDS = 900; // 15 minutes

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ---------------------------------------------------------------------------
// Crypto helpers (Web Crypto API available in Deno)
// ---------------------------------------------------------------------------

async function hmacSHA256(
  key: ArrayBuffer | Uint8Array,
  message: string,
): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
}

async function sha256Hex(data: string): Promise<string> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(data),
  );
  return hexEncode(new Uint8Array(hash));
}

function hexEncode(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------------------------------------------------------------
// AWS Signature V4 – presigned URL
// ---------------------------------------------------------------------------

async function getSigningKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string,
): Promise<ArrayBuffer> {
  const kDate = await hmacSHA256(
    new TextEncoder().encode("AWS4" + secretKey),
    dateStamp,
  );
  const kRegion = await hmacSHA256(kDate, region);
  const kService = await hmacSHA256(kRegion, service);
  return hmacSHA256(kService, "aws4_request");
}

function uriEncode(str: string): string {
  return encodeURIComponent(str).replace(/%2F/g, "/");
}

async function generatePresignedPutUrl(
  key: string,
  contentType: string,
  accessKeyId: string,
  secretAccessKey: string,
): Promise<string> {
  const now = new Date();
  const dateStamp = now.toISOString().replace(/[-:]/g, "").slice(0, 8); // YYYYMMDD
  const amzDate = dateStamp + "T" + now.toISOString().replace(/[-:]/g, "").slice(9, 15) + "Z"; // YYYYMMDDTHHMMSSZ

  const credential = `${accessKeyId}/${dateStamp}/${REGION}/${SERVICE}/aws4_request`;
  const encodedKey = key
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");

  const canonicalUri = `/${encodedKey}`;

  // Query parameters must be sorted by name
  const queryParams: [string, string][] = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD"],
    ["X-Amz-Credential", credential],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(EXPIRY_SECONDS)],
    ["X-Amz-SignedHeaders", "content-type;host"],
  ];
  queryParams.sort((a, b) => a[0].localeCompare(b[0]));

  const canonicalQueryString = queryParams
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const canonicalHeaders =
    `content-type:${contentType}\n` + `host:${HOST}\n`;

  const signedHeaders = "content-type;host";

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const credentialScope = `${dateStamp}/${REGION}/${SERVICE}/aws4_request`;

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = await getSigningKey(
    secretAccessKey,
    dateStamp,
    REGION,
    SERVICE,
  );

  const signatureBytes = await hmacSHA256(signingKey, stringToSign);
  const signature = hexEncode(new Uint8Array(signatureBytes));

  const presignedUrl =
    `https://${HOST}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;

  return presignedUrl;
}

// ---------------------------------------------------------------------------
// Edge Function handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // ---- Authenticate the user via Supabase JWT ----
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Parse request body ----
    const { key, contentType } = (await req.json()) as {
      key: string;
      contentType: string;
    };

    if (!key || !contentType) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: key, contentType" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // ---- Generate presigned URL ----
    const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
    const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");

    if (!accessKeyId || !secretAccessKey) {
      return new Response(
        JSON.stringify({ error: "AWS credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const url = await generatePresignedPutUrl(
      key,
      contentType,
      accessKeyId,
      secretAccessKey,
    );

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("s3-presign error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
