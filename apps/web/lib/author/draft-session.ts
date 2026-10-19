/** One writer per mounted chapter. Acknowledgements belong to exact revisions. */
export function createDraftSession<T>(
  write?: (value: T) => Promise<void>,
  changed: () => void = () => {},
) {
  let value: T | undefined;
  let revision = 0;
  let acknowledged = 0;
  let draining: Promise<void> | undefined;
  let saving = false;
  const listeners = new Set<() => void>();
  let current = {
    value,
    revision,
    dirty: revision !== acknowledged,
    saving,
  };
  const snapshot = () => current;
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  const publish = () => {
    current = { value, revision, dirty: revision !== acknowledged, saving };
    changed();
    listeners.forEach((listener) => listener());
  };
  function edit(next: T) {
    value = next;
    revision += 1;
    publish();
  }
  function load(next: T) {
    if (revision !== acknowledged || saving) return false;
    value = next;
    publish();
    return true;
  }
  function flush(writer = write): Promise<void> {
    if (draining) return draining;
    if (revision === acknowledged) return Promise.resolve();
    if (!writer)
      return Promise.reject(new Error("A draft writer is required."));
    saving = true;
    // Start after publishing the promise so a synchronous observer cannot reenter.
    draining = Promise.resolve().then(async () => {
      try {
        while (revision !== acknowledged) {
          const sentRevision = revision;
          await writer(value as T);
          acknowledged = sentRevision;
          publish();
        }
      } finally {
        saving = false;
        draining = undefined;
        publish();
      }
    });
    publish();
    return draining;
  }
  return { edit, load, flush, snapshot, subscribe };
}
