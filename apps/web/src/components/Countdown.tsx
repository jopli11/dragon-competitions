"use client";

import { useEffect, useMemo, useState } from "react";

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  parts.push(`${hours}h`, `${minutes}m`, `${seconds}s`);
  return parts.join(" ");
}

export function Countdown({ endAt }: { endAt: string }) {
  const end = useMemo(() => new Date(endAt).getTime(), [endAt]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = end - now;
  const ended = remaining <= 0;

  return (
    <span className="tabular-nums">
      {ended ? "Ended" : formatDuration(remaining)}
    </span>
  );
}

