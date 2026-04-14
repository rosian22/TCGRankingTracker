import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Papa from "papaparse";

interface CsvRow {
  Ranking: string;
  "Membership Number": string;
  "User Name": string;
  "Win Points": string;
  "OMW %": string;
  "OOMW %": string;
  Memo: string;
  "Deck URLs": string;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const eventId = formData.get("eventId") as string | null;

  if (!file || !eventId) {
    return NextResponse.json(
      { error: "file and eventId are required" },
      { status: 400 }
    );
  }

  const text = await file.text();
  const { data, errors } = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "CSV parse error", details: errors },
      { status: 400 }
    );
  }

  let count = 0;

  for (const row of data) {
    const name = row["User Name"]?.trim();
    const membershipNumber = row["Membership Number"]?.trim();
    if (!name) continue;

    // Find or create player by membership number or name
    let player = membershipNumber
      ? await prisma.player.findUnique({ where: { membershipNumber } })
      : null;

    if (!player) {
      player = await prisma.player.findFirst({
        where: { name: { equals: name, mode: "insensitive" } },
      });
    }

    if (!player) {
      player = await prisma.player.create({
        data: {
          name,
          membershipNumber: membershipNumber || null,
        },
      });
    } else if (membershipNumber && !player.membershipNumber) {
      await prisma.player.update({
        where: { id: player.id },
        data: { membershipNumber },
      });
    }

    // Parse numeric fields
    const ranking = parseInt(row["Ranking"]);
    const winPoints = parseInt(row["Win Points"]);
    const omwStr = row["OMW %"]?.replace("%", "").trim();
    const oomwStr = row["OOMW %"]?.replace("%", "").trim();
    const omwPercent = omwStr ? parseFloat(omwStr) : null;
    const oomwPercent = oomwStr ? parseFloat(oomwStr) : null;

    // Create or update event entry
    await prisma.eventEntry.upsert({
      where: {
        eventId_playerId: {
          eventId,
          playerId: player.id,
        },
      },
      create: {
        eventId,
        playerId: player.id,
        standing: isNaN(ranking) ? null : ranking,
        winPoints: isNaN(winPoints) ? null : winPoints,
        omwPercent,
        oomwPercent,
      },
      update: {
        standing: isNaN(ranking) ? null : ranking,
        winPoints: isNaN(winPoints) ? null : winPoints,
        omwPercent,
        oomwPercent,
      },
    });

    count++;
  }

  return NextResponse.json({ count });
}
