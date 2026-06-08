import { NextResponse } from "next/server";
import { getRecentPosts } from "@/lib/db";

export async function GET() {
  const posts = await getRecentPosts(200);
  return NextResponse.json(posts);
}
