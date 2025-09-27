import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Run Ollama model locally (gemma:2b or mistral)
    const ollama = spawn("ollama", ["run", "gemma:2b"]);

    // Send user message to Ollama
    ollama.stdin.write(message + "\n");
    ollama.stdin.end();

    let output = "";
    for await (const chunk of ollama.stdout) {
      output += chunk.toString();
    }

    return NextResponse.json({ reply: output.trim() });
  } catch (error) {
    console.error("Ollama API error:", error);
    return NextResponse.json(
      { reply: "⚠️ Failed to connect to Ollama." },
      { status: 500 }
    );
  }
}