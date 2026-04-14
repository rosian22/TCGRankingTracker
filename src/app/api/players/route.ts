import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const players = await prisma.player.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(players);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const player = await prisma.player.create({
    data: {
      name: body.name,
      nickname: body.nickname ?? null,
      membershipNumber: body.membershipNumber ?? null,
      notes: body.notes ?? null,
    },
  });
  return NextResponse.json(player, { status: 201 });
}
