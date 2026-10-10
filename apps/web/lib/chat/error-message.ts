export interface ChatErrorMessage {
  title: string;
  action: string;
}

/** Fixed recovery copy: provider responses may contain credentials or private text. */
export function getErrorMessage(error: string | Error): ChatErrorMessage {
  const message = (
    typeof error === "string" ? error : error.message
  ).toLowerCase();
  if (
    message.includes("connect your provider key") ||
    message.includes("customer_key_required") ||
    message.includes("no api key")
  ) {
    return {
      title: "Connect your provider",
      action:
        "Add your own provider key in Settings → Providers, then send your message when you’re ready.",
    };
  }
  if (
    message.includes("api key") ||
    message.includes("401") ||
    message.includes("403")
  ) {
    return {
      title: "Check your provider key",
      action:
        "Check the selected provider and key in Settings → Providers before sending again.",
    };
  }
  if (message.includes("rate") || message.includes("429")) {
    return {
      title: "Provider rate limit reached",
      action:
        "Wait a moment, or check your provider’s usage limit before sending again.",
    };
  }
  if (message.includes("network") || message.includes("fetch")) {
    return {
      title: "Connection lost",
      action: "Check your connection before sending again.",
    };
  }
  if (
    message.includes("token") ||
    message.includes("length") ||
    message.includes("too long")
  ) {
    return {
      title: "Message too long",
      action: "Shorten your message or start a new chat.",
    };
  }
  if (message.includes("timeout") || message.includes("etimedout")) {
    return {
      title: "Response timed out",
      action:
        "Check your provider before sending again. It may charge for work already started.",
    };
  }
  return {
    title: "Response interrupted",
    action:
      "Check your provider before sending again. Text already received remains available.",
  };
}
