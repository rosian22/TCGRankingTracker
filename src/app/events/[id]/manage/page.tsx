"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Player = { id: string; name: string };
type Leader = { id: string; name: string; cardNumber: string };
type EventEntry = {
  id: string;
  playerId: string;
  leaderId: string | null;
  player: Player;
  leader: Leader | null;
  standing: number | null;
};

export default function ManageEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [players, setPlayers] = useState<Player[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [entries, setEntries] = useState<EventEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Match entry state
  const [player1EntryId, setPlayer1EntryId] = useState("");
  const [player2EntryId, setPlayer2EntryId] = useState("");
  const [winnerId, setWinnerId] = useState("");
  const [roundNumber, setRoundNumber] = useState("");
  const [isDraw, setIsDraw] = useState(false);

  // Add entry state
  const [newPlayerId, setNewPlayerId] = useState("");
  const [newLeaderId, setNewLeaderId] = useState("");

  // CSV import state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/players").then((r) => r.json()),
      fetch("/api/leaders").then((r) => r.json()),
      fetch(`/api/events/${eventId}/entries`).then((r) => r.json()),
    ]).then(([p, l, e]) => {
      setPlayers(p);
      setLeaders(l);
      setEntries(e);
      setLoading(false);
    });
  }, [eventId]);

  async function addEntry() {
    if (!newPlayerId) return;
    const res = await fetch(`/api/events/${eventId}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: newPlayerId,
        leaderId: newLeaderId || null,
      }),
    });
    if (res.ok) {
      const entry = await res.json();
      setEntries((prev) => [...prev, entry]);
      setNewPlayerId("");
      setNewLeaderId("");
    }
  }

  async function recordMatch() {
    if (!player1EntryId || !player2EntryId) return;
    const res = await fetch(`/api/events/${eventId}/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player1EntryId,
        player2EntryId,
        winnerId: isDraw ? null : winnerId || null,
        isDraw,
        roundNumber: roundNumber ? parseInt(roundNumber) : null,
      }),
    });
    if (res.ok) {
      setPlayer1EntryId("");
      setPlayer2EntryId("");
      setWinnerId("");
      setRoundNumber("");
      setIsDraw(false);
      router.refresh();
    }
  }

  async function importCsv() {
    if (!csvFile) return;
    setImporting(true);
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("eventId", eventId);

    const res = await fetch("/api/import/csv", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      alert(`Imported ${result.count} entries`);
      // Refresh entries
      const e = await fetch(`/api/events/${eventId}/entries`).then((r) =>
        r.json()
      );
      setEntries(e);
    } else {
      const err = await res.json();
      alert(`Import failed: ${err.error}`);
    }
    setImporting(false);
    setCsvFile(null);
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  const p1Entry = entries.find((e) => e.id === player1EntryId);
  const p2Entry = entries.find((e) => e.id === player2EntryId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Manage Event</h2>
        <p className="text-muted-foreground">
          Add players, record matches, or import CSV standings.
        </p>
      </div>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">Player Entries</TabsTrigger>
          <TabsTrigger value="matches">Record Match</TabsTrigger>
          <TabsTrigger value="import">Import CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="space-y-1 flex-1">
              <Label>Player</Label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={newPlayerId}
                onChange={(e) => setNewPlayerId(e.target.value)}
              >
                <option value="">Select player...</option>
                {players
                  .filter((p) => !entries.some((e) => e.playerId === p.id))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-1 flex-1">
              <Label>Leader</Label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={newLeaderId}
                onChange={(e) => setNewLeaderId(e.target.value)}
              >
                <option value="">Select leader (optional)...</option>
                {leaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.cardNumber})
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={addEntry} disabled={!newPlayerId}>
              Add
            </Button>
          </div>

          <div className="rounded-md border divide-y">
            {entries.length === 0 ? (
              <p className="p-4 text-muted-foreground text-center">
                No entries yet.
              </p>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3"
                >
                  <span className="font-medium">{entry.player.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {entry.leader?.name ?? "No leader assigned"}
                  </span>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          {entries.length < 2 ? (
            <p className="text-muted-foreground">
              Add at least 2 player entries before recording matches.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Player 1</Label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={player1EntryId}
                    onChange={(e) => setPlayer1EntryId(e.target.value)}
                  >
                    <option value="">Select...</option>
                    {entries.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.player.name}
                        {e.leader ? ` (${e.leader.name})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Player 2</Label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={player2EntryId}
                    onChange={(e) => setPlayer2EntryId(e.target.value)}
                  >
                    <option value="">Select...</option>
                    {entries
                      .filter((e) => e.id !== player1EntryId)
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.player.name}
                          {e.leader ? ` (${e.leader.name})` : ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 items-end">
                <div className="space-y-1">
                  <Label>Round #</Label>
                  <Input
                    type="number"
                    min={1}
                    value={roundNumber}
                    onChange={(e) => setRoundNumber(e.target.value)}
                    className="w-24"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label>Winner</Label>
                  <select
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    value={isDraw ? "draw" : winnerId}
                    onChange={(e) => {
                      if (e.target.value === "draw") {
                        setIsDraw(true);
                        setWinnerId("");
                      } else {
                        setIsDraw(false);
                        setWinnerId(e.target.value);
                      }
                    }}
                    disabled={!player1EntryId || !player2EntryId}
                  >
                    <option value="">Select winner...</option>
                    {p1Entry && (
                      <option value={p1Entry.playerId}>
                        {p1Entry.player.name}
                      </option>
                    )}
                    {p2Entry && (
                      <option value={p2Entry.playerId}>
                        {p2Entry.player.name}
                      </option>
                    )}
                    <option value="draw">Draw</option>
                  </select>
                </div>
                <Button
                  onClick={recordMatch}
                  disabled={
                    !player1EntryId ||
                    !player2EntryId ||
                    (!winnerId && !isDraw)
                  }
                >
                  Record Match
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import standings from a Bandai tournament CSV export. This will
            create players that don&apos;t exist and add entries with standings data.
          </p>
          <div className="flex gap-2 items-end">
            <div className="space-y-1 flex-1">
              <Label>CSV File</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button onClick={importCsv} disabled={!csvFile || importing}>
              {importing ? "Importing..." : "Import"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
