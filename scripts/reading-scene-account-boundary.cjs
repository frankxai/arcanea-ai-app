async function installSceneAccountBoundary(context, secondId) {
  await context.addInitScript(
    ({ secondId }) => {
      window.__readingSceneAccountBoundary = {
        armed: false,
        label: "",
        attempts: 0,
        connected: false,
        enabled: false,
        clickObserved: false,
        synchronousRecoveryWrites: 0,
        insideBoundary: false,
      };
      const nativeSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function (name, value) {
        const state = window.__readingSceneAccountBoundary;
        if (state.insideBoundary && name.startsWith("arcanea:reading-scene:"))
          state.synchronousRecoveryWrites++;
        return nativeSet.call(this, name, value);
      };
      const NativeChannel = window.BroadcastChannel;
      // Keep the actual SDK listener and real password session. Insert one browser
      // click after the listener runs, while the previous button is connected.
      window.BroadcastChannel = class extends NativeChannel {
        wrappedListeners = new WeakMap();
        addEventListener(type, listener, options) {
          if (
            type !== "message" ||
            !listener ||
            !/^sb-.*-auth-token$/.test(this.name)
          )
            return super.addEventListener(type, listener, options);
          let wrapped = this.wrappedListeners.get(listener);
          if (!wrapped) {
            wrapped = (event) => {
              const state = window.__readingSceneAccountBoundary;
              const oldButton =
                state.armed &&
                event.data?.event === "SIGNED_IN" &&
                event.data?.session?.user?.id === secondId
                  ? [...document.querySelectorAll("button")].find(
                      (button) => button.textContent.trim() === state.label,
                    )
                  : null;
              const returned =
                typeof listener === "function"
                  ? listener.call(this, event)
                  : listener.handleEvent(event);
              if (oldButton) {
                state.armed = false;
                state.connected = oldButton.isConnected;
                state.enabled = !oldButton.disabled;
                oldButton.addEventListener(
                  "click",
                  () => {
                    state.clickObserved = true;
                  },
                  { once: true },
                );
                state.attempts++;
                state.insideBoundary = true;
                try {
                  oldButton.click();
                } finally {
                  state.insideBoundary = false;
                }
              }
              return returned;
            };
            this.wrappedListeners.set(listener, wrapped);
          }
          return super.addEventListener(type, wrapped, options);
        }
        removeEventListener(type, listener, options) {
          return super.removeEventListener(
            type,
            this.wrappedListeners.get(listener) || listener,
            options,
          );
        }
      };
    },
    { secondId },
  );
}

async function readSceneDiagnostics(page) {
  if (!page) return null;
  return page.evaluate(() => {
    const selection = getSelection();
    const anchor = selection?.anchorNode;
    const element =
      anchor?.nodeType === Node.ELEMENT_NODE ? anchor : anchor?.parentElement;
    return {
      selectionCollapsed: selection?.isCollapsed,
      selectionLength: selection?.toString().length,
      selectionInChapter: Boolean(element?.closest("article .prose")),
      anchorConnected: anchor?.isConnected,
      actions: [...document.querySelectorAll("button")]
        .filter((button) =>
          /^Visualize (a passage|selection)$/.test(button.textContent.trim()),
        )
        .map((button) => ({
          label: button.textContent.trim(),
          disabled: button.disabled,
        })),
    };
  });
}

function observeSceneConsole(context, onError) {
  context.on("page", (tab) =>
    tab.on("console", (message) => {
      if (message.type() === "error") onError(message.text());
    }),
  );
}

module.exports = {
  installSceneAccountBoundary,
  readSceneDiagnostics,
  observeSceneConsole,
};
