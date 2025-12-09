export type GeminiHistoryItem = { role: "user" | "model"; content: string };

export async function sendToGemini(message: string, history?: GeminiHistoryItem[]): Promise<string> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to reach Gemini API");
  }

  if (!data.reply) {
    throw new Error(data.error ?? "No response from Gemini API");
  }

  return data.reply as string;
}
