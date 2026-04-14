import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const leaders = await prisma.leader.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(leaders);
}
