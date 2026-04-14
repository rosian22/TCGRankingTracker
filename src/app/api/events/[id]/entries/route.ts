import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entries = await prisma.eventEntry.findMany({
    where: { eventId: id },
    include: { player: true, leader: true },
    orderBy: { standing: { sort: "asc", nulls: "last" } },
  });
  return NextResponse.json(entries);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const entry = await prisma.eventEntry.create({
    data: {
      eventId: id,
      playerId: body.playerId,
      leaderId: body.leaderId ?? null,
    },
    include: { player: true, leader: true },
  });
  return NextResponse.json(entry, { status: 201 });
}
