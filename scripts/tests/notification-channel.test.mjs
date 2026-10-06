import test from "node:test";
import assert from "node:assert/strict";
import { subscribeToNotificationChanges } from "../../apps/web/lib/supabase/notification-channel.ts";

// Supabase reuses a channel with the same topic and rejects new Postgres handlers
// after it subscribes. Keep removals pending to cover rapid menu close/reopen.
function realtimeClient() {
  const channels = new Map();
  const removed = [];
  return {
    channels,
    removed,
    channel(topic) {
      if (channels.has(topic)) return channels.get(topic);
      const channel = {
        topic,
        subscribed: false,
        on(type, filter, handler) {
          if (this.subscribed) throw new Error("handler added after subscribe");
          Object.assign(this, { type, filter, handler });
          return this;
        },
        subscribe() {
          this.subscribed = true;
          return this;
        },
      };
      channels.set(topic, channel);
      return channel;
    },
    removeChannel(channel) {
      removed.push(channel);
      return Promise.resolve("ok");
    },
  };
}

test("desktop and mobile notification bells can subscribe concurrently", () => {
  const client = realtimeClient();
  let updates = 0;
  const stopDesktop = subscribeToNotificationChanges(
    client,
    "user-a",
    () => updates++,
  );
  const stopMobile = subscribeToNotificationChanges(
    client,
    "user-a",
    () => updates++,
  );
  assert.equal(client.channels.size, 2);
  for (const channel of client.channels.values()) {
    assert.equal(channel.type, "postgres_changes");
    assert.deepEqual(channel.filter, {
      event: "INSERT",
      schema: "public",
      table: "notifications",
      filter: "user_id=eq.user-a",
    });
    channel.handler();
  }
  assert.equal(updates, 2);
  stopMobile();
  assert.equal(client.removed.length, 1);
  assert.equal(client.removed[0], [...client.channels.values()][1]);
  stopDesktop();
  assert.equal(client.removed.length, 2);
});

test("remount does not reuse a channel while its cleanup is pending", () => {
  const client = realtimeClient();
  const stop = subscribeToNotificationChanges(client, "user-a", () => {});
  stop();
  subscribeToNotificationChanges(client, "user-b", () => {});
  const [oldChannel, newChannel] = [...client.channels.values()];
  assert.notEqual(oldChannel.topic, newChannel.topic);
  assert.equal(newChannel.filter.filter, "user_id=eq.user-b");
});
