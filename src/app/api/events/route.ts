import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = await prisma.event.create({
    data: {
      name: body.name,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      location: body.location ?? null,
      format: body.format ?? "CONSTRUCTED",
      description: body.description ?? null,
    },
  });
  return NextResponse.json(event, { status: 201 });
}
