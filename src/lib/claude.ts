import Anthropic from "@anthropic-ai/sdk";

let anthropic: Anthropic | null = null;

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  if (!anthropic) {
    anthropic = new Anthropic({ apiKey });
  }

  return anthropic;
}

export default getAnthropicClient;
