"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate") || null,
        location: formData.get("location") || null,
        format: formData.get("format") || "CONSTRUCTED",
        description: formData.get("description") || null,
      }),
    });

    if (res.ok) {
      const event = await res.json();
      router.push(`/events/${event.id}`);
    } else {
      setLoading(false);
      alert("Failed to create event");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Event</h2>
        <p className="text-muted-foreground">Set up a new tournament event.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name *</Label>
          <Input id="name" name="name" required placeholder="e.g., Heroines Battle" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" name="endDate" type="datetime-local" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Flamey Gaming Bastion"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Format</Label>
          <Input
            id="format"
            name="format"
            placeholder="CONSTRUCTED"
            defaultValue="CONSTRUCTED"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" placeholder="Optional description" />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
