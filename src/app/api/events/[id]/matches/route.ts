import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const matches = await prisma.match.findMany({
    where: { eventId: id },
    include: {
      player1Entry: { include: { player: true, leader: true } },
      player2Entry: { include: { player: true, leader: true } },
      winner: true,
    },
    orderBy: { roundNumber: { sort: "asc", nulls: "last" } },
  });
  return NextResponse.json(matches);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const match = await prisma.match.create({
    data: {
      eventId: id,
      player1EntryId: body.player1EntryId,
      player2EntryId: body.player2EntryId,
      winnerId: body.winnerId ?? null,
      isDraw: body.isDraw ?? false,
      roundNumber: body.roundNumber ?? null,
      notes: body.notes ?? null,
    },
    include: {
      player1Entry: { include: { player: true } },
      player2Entry: { include: { player: true } },
      winner: true,
    },
  });
  return NextResponse.json(match, { status: 201 });
}
