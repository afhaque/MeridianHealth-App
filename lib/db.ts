import "server-only";
import { neon } from "@neondatabase/serverless";

// Server-only: NEON_DATABASE_URL must never be exposed via a NEXT_PUBLIC_ variable.
export function getSql() {
  const url = process.env.NEON_DATABASE_URL;
  if (!url) throw new Error("NEON_DATABASE_URL is not set");
  return neon(url);
}
