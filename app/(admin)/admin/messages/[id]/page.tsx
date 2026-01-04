"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AdminMessageDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [message, setMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function load(messageId: string) {
    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setMessage(data.message);
      // Auto mark as read after fetching
      try { await fetch(`/api/admin/messages/${messageId}` , { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }), credentials: "include" }); } catch (_) { /* ignore */ }
    } catch (e: any) {
      setError(e.message || "Failed to load");
    }
  }

  useEffect(() => {
    if (typeof id === "string") {
      load(id);
    }
  }, [id]);

  if (error) return (
    <div className="space-y-3">
      <p className="text-red-600">{error}</p>
      {(error.toLowerCase().includes("unauthorized") || error.toLowerCase().includes("forbidden")) && (
        <a className="underline text-sm" href="/login">Go to Login</a>
      )}
    </div>
  );
  if (!message) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Message Detail</h1>
        <Link className="text-sm underline" href="/admin/messages">Back to list</Link>
      </div>

      <div className="border rounded p-4 space-y-2">
        <p><span className="font-medium">From:</span> {message.name} ({message.email})</p>
        {message.phone && <p><span className="font-medium">Phone:</span> {message.phone}</p>}
        {message.subject && <p><span className="font-medium">Subject:</span> {message.subject}</p>}
        <p><span className="font-medium">Received:</span> {new Date(message.createdAt).toLocaleString()}</p>
        <div className="pt-2">
          <p className="whitespace-pre-wrap">{message.message}</p>
        </div>
      </div>
    </div>
  );
}
