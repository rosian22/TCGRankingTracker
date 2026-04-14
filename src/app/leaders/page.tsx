export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const colorClasses: Record<string, string> = {
  RED: "bg-red-100 text-red-800 border-red-200",
  GREEN: "bg-green-100 text-green-800 border-green-200",
  BLUE: "bg-blue-100 text-blue-800 border-blue-200",
  PURPLE: "bg-purple-100 text-purple-800 border-purple-200",
  BLACK: "bg-gray-100 text-gray-800 border-gray-200",
  YELLOW: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export default async function LeadersPage() {
  const leaders = await prisma.leader.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { eventEntries: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Leaders</h2>
        <p className="text-muted-foreground">
          All available leaders and their usage stats.
        </p>
      </div>

      {leaders.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          No leaders in database. Run the seed script or import card data.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leaders.map((leader) => (
            <Link
              key={leader.id}
              href={`/leaders/${leader.id}`}
              className="rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{leader.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {leader.cardNumber}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Badge className={colorClasses[leader.color] ?? ""}>
                    {leader.color}
                  </Badge>
                  {leader.secondColor && (
                    <Badge className={colorClasses[leader.secondColor] ?? ""}>
                      {leader.secondColor}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <span>Power: {leader.power}</span>
                <span>Life: {leader.life}</span>
                <span>Used: {leader._count.eventEntries}x</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
