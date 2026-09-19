const COOKIE_NAME = "dm_cms_session";
const SESSION_MS = 1000 * 60 * 60 * 12;

let warnedMissingSessionSecret = false;

function sessionSecret() {
  if (process.env.CMS_SESSION_SECRET) return process.env.CMS_SESSION_SECRET;
  if (process.env.NODE_ENV === "production" && !warnedMissingSessionSecret) {
    warnedMissingSessionSecret = true;
    console.warn("[cms] CMS_SESSION_SECRET chưa được đặt. Hãy đổi secret trước khi public.");
  }
  return "diamond-model-cms-dev-secret";
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sign(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

export function getAdminCredentials() {
  const username = process.env.CMS_ADMIN_USER || "admin";
  const password = process.env.CMS_ADMIN_PASSWORD || "diamondmodel";
  const isDefault = !process.env.CMS_ADMIN_USER && !process.env.CMS_ADMIN_PASSWORD;
  return { username, password, isDefault };
}

export async function createSessionToken(username: string) {
  const expiresAt = Date.now() + SESSION_MS;
  const payload = `${username}.${expiresAt}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token?: string | null) {
  if (!token) return null;
  const [username, expiresAt, signature] = token.split(".");
  if (!username || !expiresAt || !signature) return null;
  if (Number(expiresAt) < Date.now()) return null;

  const expected = await sign(`${username}.${expiresAt}`);
  if (expected.length !== signature.length) return null;

  const left = new TextEncoder().encode(expected);
  const right = new TextEncoder().encode(signature);
  if (left.length !== right.length) return null;

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }

  return mismatch === 0 ? username : null;
}

export async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`));
  return verifySessionToken(match?.[1] ? decodeURIComponent(match[1]) : null);
}

async function sha256Hex(value: string) {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

export async function hashPassword(password: string) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  return `${salt}:${await sha256Hex(`${salt}:${password}`)}`;
}

export async function verifyPassword(password: string, stored?: string | null) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = await sha256Hex(`${salt}:${password}`);
  if (expected.length !== hash.length) return false;
  const left = new TextEncoder().encode(expected);
  const right = new TextEncoder().encode(hash);
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index];
  }
  return mismatch === 0;
}

export function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes].map((byte) => chars[byte % chars.length]).join("");
}

export function sessionCookieName() {
  return COOKIE_NAME;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MS / 1000,
  };
}
