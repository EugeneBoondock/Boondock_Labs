export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function sendToAssistant(
  message: string,
  history?: ChatTurn[],
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    reply?: string;
    error?: string;
  };

  if (!response.ok || !data.reply) {
    throw new Error(data.error ?? "The assistant is unavailable right now.");
  }

  return data.reply;
}
