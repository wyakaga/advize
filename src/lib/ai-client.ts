import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getAiClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.SUMOPOD_API_KEY || "placeholder",
      baseURL: "https://ai.sumopod.com/",
    });
  }
  return _client;
}

/** @deprecated use getAiClient() */
export const aiClient = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return (getAiClient() as never)[prop];
  },
});
