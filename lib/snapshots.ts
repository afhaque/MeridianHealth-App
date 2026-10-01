import "server-only";
import { getSql } from "@/lib/db";
import type { Deal } from "@/lib/types";

export async function getSnapshot(id: string): Promise<{ data: Deal[]; label: string | null } | null> {
  const sql = getSql();
  try {
    const rows = await sql`SELECT data, label FROM meridian_snapshots WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return null;
    return { data: rows[0].data as Deal[], label: rows[0].label as string | null };
  } catch {
    // e.g. malformed uuid — treat like the previous client's "not found" error path
    return null;
  }
}
