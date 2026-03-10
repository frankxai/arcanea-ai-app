"use client";

import { useState, useEffect } from "react";
import { CouncilStats } from "./CouncilStats";

interface Session {
  id: string;
  created_at: string;
  depth_rating: number | null;
  imprint_notes: Record<string, string>;
  journal_entry: string | null;
  seats_addressed: string[];
}

interface StatsData {
  current_streak: number;
  total_convenings: number;
  council_depth_level: number;
  last_convening_at: string | null;
}

export function CouncilDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessRes, statsRes] = await Promise.all([
          fetch("/api/council/convenings?limit=5"),
          fetch("/api/council/stats"),
        ]);

        if (sessRes.ok) {
          const { data } = await sessRes.json();
          setSessions(data?.convenings ?? []);
        }

        if (statsRes.ok) {
          const { data } = await statsRes.json();
          setStats(data);
        }
      } catch {
        // Not authenticated or no council yet
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Stats */}
      <section className="max-w-3xl mx-auto">
        <CouncilStats
          streak={stats?.current_streak}
          totalSessions={stats?.total_convenings}
          depthLevel={stats?.council_depth_level}
          lastSession={
            stats?.last_convening_at
              ? formatDate(stats.last_convening_at)
              : undefined
          }
        />
      </section>

      {/* Recent Sessions */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-white">
            Recent Sessions
          </h2>
          <span className="font-mono text-xs text-white/30 tracking-wider uppercase">
            Journal
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5 h-24"
              />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md px-6 py-5 space-y-3 hover:border-white/[0.10] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white/40">
                      {formatDate(s.created_at)}
                    </span>
                    {s.depth_rating && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/[0.06] text-white/30">
                        Depth {s.depth_rating}
                      </span>
                    )}
                  </div>
                </div>
                {s.journal_entry && (
                  <p className="font-body text-sm text-white/60 leading-relaxed italic">
                    &ldquo;{s.journal_entry}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-center">
            <p className="font-body text-sm text-white/40">
              No sessions yet. Start your first session to see your journal
              here.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
