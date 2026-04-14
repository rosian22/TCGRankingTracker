export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function RankingsPage() {
  const players = await prisma.player.findMany({
    where: { isActive: true },
    include: {
      eventEntries: {
        include: {
          matchesAsPlayer1: { include: { winner: true } },
          matchesAsPlayer2: { include: { winner: true } },
        },
      },
    },
    orderBy: { eloRating: "desc" },
  });

  const rankings = players.map((player) => {
    let wins = 0;
    let losses = 0;
    let draws = 0;

    for (const entry of player.eventEntries) {
      for (const match of entry.matchesAsPlayer1) {
        if (match.isDraw) draws++;
        else if (match.winnerId === player.id) wins++;
        else losses++;
      }
      for (const match of entry.matchesAsPlayer2) {
        if (match.isDraw) draws++;
        else if (match.winnerId === player.id) wins++;
        else losses++;
      }
    }

    const total = wins + losses + draws;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return {
      ...player,
      wins,
      losses,
      draws,
      total,
      winRate,
      eventsCount: player.eventEntries.length,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Rankings</h2>
        <p className="text-muted-foreground">
          Player rankings based on ELO rating and match performance.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">ELO</TableHead>
              <TableHead className="text-right">W</TableHead>
              <TableHead className="text-right">L</TableHead>
              <TableHead className="text-right">D</TableHead>
              <TableHead className="text-right">Win%</TableHead>
              <TableHead className="text-right">Events</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No ranking data yet. Record some matches first.
                </TableCell>
              </TableRow>
            ) : (
              rankings.map((player, index) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/players/${player.id}`}
                      className="hover:underline font-medium"
                    >
                      {player.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {Math.round(player.eloRating)}
                  </TableCell>
                  <TableCell className="text-right">{player.wins}</TableCell>
                  <TableCell className="text-right">{player.losses}</TableCell>
                  <TableCell className="text-right">{player.draws}</TableCell>
                  <TableCell className="text-right">
                    {player.total > 0 ? `${player.winRate.toFixed(1)}%` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {player.eventsCount}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
