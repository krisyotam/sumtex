import "server-only";

export interface AIProvider {
  name: string;
  screenshotToLatex(imageBase64: string, apiKey: string): Promise<string>;
}

const SYSTEM_PROMPT =
  "Convert the mathematical content in this image to LaTeX notation. Return only the raw LaTeX string with no explanation, no code fences, no surrounding text.";

const openai: AIProvider = {
  name: "openai",
  async screenshotToLatex(imageBase64: string, apiKey: string) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: SYSTEM_PROMPT },
              {
                type: "image_url",
                image_url: { url: `data:image/png;base64,${imageBase64}` },
              },
            ],
          },
        ],
        max_tokens: 2048,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  },
};

const anthropic: AIProvider = {
  name: "anthropic",
  async screenshotToLatex(imageBase64: string, apiKey: string) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/png",
                  data: imageBase64,
                },
              },
              { type: "text", text: SYSTEM_PROMPT },
            ],
          },
        ],
      }),
    });
    const data = await res.json();
    const block = data.content?.find(
      (b: { type: string }) => b.type === "text"
    );
    return block?.text?.trim() || "";
  },
};

const google: AIProvider = {
  name: "google",
  async screenshotToLatex(imageBase64: string, apiKey: string) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                {
                  inline_data: {
                    mime_type: "image/png",
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await res.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ""
    );
  },
};

const providers: Record<string, AIProvider> = { openai, anthropic, google };

export function getProvider(name: string): AIProvider | undefined {
  return providers[name];
}
