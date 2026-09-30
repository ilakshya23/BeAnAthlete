import "server-only";

import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { databaseConfigured, ensureSchema, getDatabase } from "@/lib/database";

const COOKIE_NAME = "baa_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

type SessionPayload = { username: string; version: number; expires: number };

function secret() {
  const value = process.env.ADMIN_AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_AUTH_SECRET must be at least 32 characters.");
  }
  return value;
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${key}`;
}

function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, key] = stored.split(":");
  if (algorithm !== "scrypt" || !salt || !key) return false;
  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

async function ensureInitialAdmin() {
  if (!databaseConfigured()) throw new Error("The database has not been connected yet.");
  await ensureSchema();
  const sql = getDatabase();
  const rows = await sql`SELECT COUNT(*)::int AS count FROM admin_users`;
  if (Number(rows[0]?.count || 0) > 0) return;

  const username = process.env.ADMIN_INITIAL_USERNAME?.trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!username || !password || password.length < 10) {
    throw new Error("Initial admin credentials have not been configured.");
  }
  const passwordHash = hashPassword(password);
  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    ON CONFLICT (username) DO NOTHING
  `;
}

function sign(payload: SessionPayload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function decode(token: string): SessionPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = createHmac("sha256", secret()).update(encoded).digest();
  const received = Buffer.from(signature, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export async function loginRateLimitKey(username: string, ip: string) {
  return createHash("sha256").update(`${username.toLowerCase()}|${ip}`).digest("hex");
}

export async function isLoginLocked(attemptKey: string) {
  await ensureSchema();
  const sql = getDatabase();
  const rows = await sql`
    SELECT locked_until > NOW() AS locked
    FROM admin_login_attempts WHERE attempt_key = ${attemptKey}
  `;
  return Boolean(rows[0]?.locked);
}

export async function recordLoginFailure(attemptKey: string) {
  await ensureSchema();
  const sql = getDatabase();
  await sql`
    INSERT INTO admin_login_attempts (attempt_key, attempts, window_started_at, locked_until)
    VALUES (${attemptKey}, 1, NOW(), NULL)
    ON CONFLICT (attempt_key) DO UPDATE SET
      attempts = CASE
        WHEN admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1
        ELSE admin_login_attempts.attempts + 1
      END,
      window_started_at = CASE
        WHEN admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN NOW()
        ELSE admin_login_attempts.window_started_at
      END,
      locked_until = CASE
        WHEN (CASE WHEN admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1 ELSE admin_login_attempts.attempts + 1 END) >= 5
        THEN NOW() + INTERVAL '15 minutes'
        ELSE admin_login_attempts.locked_until
      END
  `;
}

export async function authenticate(username: string, password: string) {
  await ensureInitialAdmin();
  const sql = getDatabase();
  const rows = await sql`
    SELECT username, password_hash, session_version
    FROM admin_users WHERE LOWER(username) = LOWER(${username}) LIMIT 1
  `;
  const user = rows[0];
  if (!user || !verifyPassword(password, String(user.password_hash))) return false;
  return { username: String(user.username), version: Number(user.session_version) };
}

export async function setAdminSession(user: { username: string; version: number }) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sign({ ...user, expires }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "strict", path: "/", maxAge: 0 });
}

export async function getAdminSession() {
  if (!databaseConfigured()) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  let payload: SessionPayload | null = null;
  try {
    payload = decode(token);
  } catch {
    return null;
  }
  if (!payload || payload.expires < Math.floor(Date.now() / 1000)) return null;
  await ensureSchema();
  const sql = getDatabase();
  const rows = await sql`
    SELECT session_version FROM admin_users WHERE username = ${payload.username} LIMIT 1
  `;
  if (!rows[0] || Number(rows[0].session_version) !== payload.version) return null;
  return payload;
}

export async function changeAdminPassword(username: string, currentPassword: string, nextPassword: string) {
  if (nextPassword.length < 10) throw new Error("The new password must be at least 10 characters.");
  const user = await authenticate(username, currentPassword);
  if (!user) throw new Error("The current password is incorrect.");
  const passwordHash = hashPassword(nextPassword);
  const sql = getDatabase();
  const rows = await sql`
    UPDATE admin_users
    SET password_hash = ${passwordHash}, session_version = session_version + 1, updated_at = NOW()
    WHERE username = ${username}
    RETURNING session_version
  `;
  return { username, version: Number(rows[0].session_version) };
}

export async function clearLoginFailures(attemptKey: string) {
  const sql = getDatabase();
  await sql`DELETE FROM admin_login_attempts WHERE attempt_key = ${attemptKey}`;
}
