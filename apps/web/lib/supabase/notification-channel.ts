import type { SupabaseClient } from "@supabase/supabase-js";

export function subscribeToNotificationChanges(
  client: Pick<SupabaseClient, "channel" | "removeChannel">,
  userId: string,
  onInsert: () => void,
) {
  // Desktop and mobile bells can coexist. A reused topic returns an already
  // subscribed channel; even a remount can race asynchronous channel teardown.
  const channel = client
    .channel(`notifications-realtime:${crypto.randomUUID()}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      onInsert,
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
