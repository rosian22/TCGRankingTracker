export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { eventEntries: true, matchesWon: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Players</h2>
          <p className="text-muted-foreground">
            Manage your player roster.
          </p>
        </div>
        <Link href="/players/new" className={buttonVariants()}>Add Player</Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Membership #</TableHead>
              <TableHead className="text-right">Events</TableHead>
              <TableHead className="text-right">Wins</TableHead>
              <TableHead className="text-right">ELO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No players yet. Add your first player to get started.
                </TableCell>
              </TableRow>
            ) : (
              players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <Link
                      href={`/players/${player.id}`}
                      className="font-medium hover:underline"
                    >
                      {player.name}
                    </Link>
                  </TableCell>
                  <TableCell>{player.nickname ?? "—"}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {player.membershipNumber ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {player._count.eventEntries}
                  </TableCell>
                  <TableCell className="text-right">
                    {player._count.matchesWon}
                  </TableCell>
                  <TableCell className="text-right">
                    {Math.round(player.eloRating)}
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
