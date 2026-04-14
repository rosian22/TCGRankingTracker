export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function LeaderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const leader = await prisma.leader.findUnique({
    where: { id },
    include: {
      eventEntries: {
        include: {
          player: true,
          event: true,
          matchesAsPlayer1: { include: { winner: true } },
          matchesAsPlayer2: { include: { winner: true } },
        },
      },
    },
  });

  if (!leader) return notFound();

  let totalWins = 0;
  let totalLosses = 0;
  let totalDraws = 0;

  for (const entry of leader.eventEntries) {
    for (const match of entry.matchesAsPlayer1) {
      if (match.isDraw) totalDraws++;
      else if (match.winnerId === entry.playerId) totalWins++;
      else totalLosses++;
    }
    for (const match of entry.matchesAsPlayer2) {
      if (match.isDraw) totalDraws++;
      else if (match.winnerId === entry.playerId) totalWins++;
      else totalLosses++;
    }
  }

  const totalMatches = totalWins + totalLosses + totalDraws;
  const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{leader.name}</h2>
        <p className="text-sm text-muted-foreground font-mono">
          {leader.cardNumber} · {leader.setCode}
        </p>
        <div className="flex gap-1 mt-1">
          <Badge>{leader.color}</Badge>
          {leader.secondColor && <Badge>{leader.secondColor}</Badge>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Times Played" value={leader.eventEntries.length.toString()} />
        <StatCard label="Wins" value={totalWins.toString()} />
        <StatCard label="Win Rate" value={totalMatches > 0 ? `${winRate.toFixed(1)}%` : "—"} />
        <StatCard label="Power / Life" value={`${leader.power} / ${leader.life}`} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Players Who Used This Leader</h3>
        <div className="space-y-2">
          {leader.eventEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <Link
                href={`/players/${entry.playerId}`}
                className="font-medium hover:underline"
              >
                {entry.player.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                {entry.event.name} · {new Date(entry.event.startDate).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
