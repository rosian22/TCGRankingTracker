"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewPlayerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        nickname: formData.get("nickname") || null,
        membershipNumber: formData.get("membershipNumber") || null,
        notes: formData.get("notes") || null,
      }),
    });

    if (res.ok) {
      router.push("/players");
      router.refresh();
    } else {
      setLoading(false);
      alert("Failed to create player");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Player</h2>
        <p className="text-muted-foreground">Register a new player.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" required placeholder="Player name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname</Label>
          <Input id="nickname" name="nickname" placeholder="Optional nickname" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="membershipNumber">Membership Number</Label>
          <Input
            id="membershipNumber"
            name="membershipNumber"
            placeholder="Bandai membership # (e.g., 0000737996)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" placeholder="Optional notes" />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Player"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
