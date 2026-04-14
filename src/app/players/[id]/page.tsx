export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      eventEntries: {
        include: {
          event: true,
          leader: true,
        },
        orderBy: { event: { startDate: "desc" } },
      },
      matchesWon: true,
      _count: {
        select: { eventEntries: true, matchesWon: true },
      },
    },
  });

  if (!player) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{player.name}</h2>
          {player.nickname && (
            <p className="text-muted-foreground">&quot;{player.nickname}&quot;</p>
          )}
        </div>
        <Badge variant={player.isActive ? "default" : "secondary"}>
          {player.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="ELO Rating" value={Math.round(player.eloRating).toString()} />
        <StatCard label="Events Attended" value={player._count.eventEntries.toString()} />
        <StatCard label="Match Wins" value={player._count.matchesWon.toString()} />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Event History</h3>
        {player.eventEntries.length === 0 ? (
          <p className="text-muted-foreground">No events yet.</p>
        ) : (
          <div className="space-y-2">
            {player.eventEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{entry.event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.event.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {entry.leader && (
                    <Badge variant="outline">{entry.leader.name}</Badge>
                  )}
                  {entry.standing && (
                    <Badge>#{entry.standing}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
