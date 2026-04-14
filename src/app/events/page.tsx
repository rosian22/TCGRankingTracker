export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: {
        select: { entries: true, matches: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">Tournament events and results.</p>
        </div>
        <Link href="/events/new" className={buttonVariants()}>Create Event</Link>
      </div>

      {events.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No events yet. Create your first event to get started.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(event.startDate).toLocaleDateString()}
              </p>
              {event.location && (
                <p className="text-sm text-muted-foreground">{event.location}</p>
              )}
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{event.format}</Badge>
                <Badge variant="secondary">{event._count.entries} players</Badge>
                <Badge variant="secondary">{event._count.matches} matches</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
