export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      entries: {
        include: { player: true, leader: true },
        orderBy: { standing: { sort: "asc", nulls: "last" } },
      },
      matches: {
        include: {
          player1Entry: { include: { player: true, leader: true } },
          player2Entry: { include: { player: true, leader: true } },
          winner: true,
        },
        orderBy: { roundNumber: { sort: "asc", nulls: "last" } },
      },
    },
  });

  if (!event) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{event.name}</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(event.startDate).toLocaleDateString()}
            {event.location && ` · ${event.location}`}
          </p>
          <Badge variant="outline" className="mt-1">{event.format}</Badge>
        </div>
        <Link href={`/events/${event.id}/manage`} className={buttonVariants()}>Manage Event</Link>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">
          Standings ({event.entries.length} players)
        </h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead className="text-right">Win Points</TableHead>
                <TableHead className="text-right">OMW%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.entries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No players registered. Go to Manage Event to add players or import a CSV.
                  </TableCell>
                </TableRow>
              ) : (
                event.entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.standing ?? "—"}</TableCell>
                    <TableCell>
                      <Link
                        href={`/players/${entry.playerId}`}
                        className="hover:underline"
                      >
                        {entry.player.name}
                      </Link>
                    </TableCell>
                    <TableCell>{entry.leader?.name ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {entry.winPoints ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {entry.omwPercent != null
                        ? `${entry.omwPercent.toFixed(1)}%`
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {event.matches.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Matches ({event.matches.length})
          </h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Round</TableHead>
                  <TableHead>Player 1</TableHead>
                  <TableHead className="text-center">vs</TableHead>
                  <TableHead>Player 2</TableHead>
                  <TableHead>Winner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>{match.roundNumber ?? "—"}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">
                          {match.player1Entry.player.name}
                        </span>
                        {match.player1Entry.leader && (
                          <span className="text-sm text-muted-foreground ml-1">
                            ({match.player1Entry.leader.name})
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      vs
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">
                          {match.player2Entry.player.name}
                        </span>
                        {match.player2Entry.leader && (
                          <span className="text-sm text-muted-foreground ml-1">
                            ({match.player2Entry.leader.name})
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {match.isDraw ? (
                        <Badge variant="secondary">Draw</Badge>
                      ) : match.winner ? (
                        <Badge>{match.winner.name}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
