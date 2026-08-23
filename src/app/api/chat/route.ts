import { NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./persona";

/**
 * Model id is env-overridable so it can be corrected without a deploy of this
 * file. Set OPENAI_MODEL to pin a different one.
 */
const DEFAULT_MODEL = "gpt-5.6-terra";

const MAX_MESSAGE_CHARS = 4000;
const MAX_HISTORY_TURNS = 20;

type Turn = { role: "user" | "assistant"; content: string };

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable not set.");
  }
  return new OpenAI({ apiKey });
}

/** Trust nothing from the client: clamp roles, lengths, and history depth. */
function sanitiseHistory(history: unknown): Turn[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (t): t is Turn =>
        !!t &&
        typeof t === "object" &&
        typeof (t as Turn).content === "string" &&
        ((t as Turn).role === "user" || (t as Turn).role === "assistant"),
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((t) => ({
      role: t.role,
      content: t.content.slice(0, MAX_MESSAGE_CHARS),
    }));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: string;
      history?: unknown;
    };

    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const client = getClient();
    const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

    const response = await client.responses.create({
      model,
      instructions: SYSTEM_PROMPT,
      input: [
        ...sanitiseHistory(body.history),
        { role: "user" as const, content: message.slice(0, MAX_MESSAGE_CHARS) },
      ],
      max_output_tokens: 1024,
    });

    const reply = response.output_text?.trim();
    if (!reply) {
      throw new Error("Empty response from the model");
    }

    return NextResponse.json({ reply });
  } catch (error) {
    // Log the detail server-side; return something safe to the browser so the
    // response never leaks key material or provider internals.
    console.error("[chat] request failed:", error);
    const isConfig =
      error instanceof Error && error.message.includes("OPENAI_API_KEY");
    return NextResponse.json(
      {
        error: isConfig
          ? "The assistant is not configured yet."
          : "The assistant is unavailable right now. Please try again.",
      },
      { status: isConfig ? 503 : 500 },
    );
  }
}
