import { sql } from "@vercel/postgres";
import fs from "fs";
import path from "path";

export async function runMigrations() {
  const schemaPath = path.join(process.cwd(), "src/lib/db/schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");

  // Split on semicolons but keep statements that contain function bodies intact
  const statements = schema
    .split(/;(?:\s*\n|\s*$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    await sql.query(stmt);
  }
}
