"use server";
import { getSql } from "@/lib/db";
import type { Deal } from "@/lib/types";

// Anonymous insert, matching the previous Supabase "public insert" policy.
export async function createSnapshot(deals: Deal[], label: string): Promise<string> {
  if (!Array.isArray(deals)) throw new Error("Invalid snapshot data");
  const sql = getSql();
  const rows = await sql`
    INSERT INTO meridian_snapshots (data, label)
    VALUES (${JSON.stringify(deals)}::jsonb, ${label})
    RETURNING id`;
  return rows[0].id as string;
}
