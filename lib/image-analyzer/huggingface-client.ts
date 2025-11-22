const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Available vision models (in order of capability vs cost):
// - "gpt-4o" - Most capable, ~$0.005/image (recommended)
// - "gpt-4o-mini" - Fast and cheap, ~$0.0003/image (budget option)
// - "gpt-4-turbo" - Previous generation, ~$0.01/image
// - "gpt-4-vision-preview" - Older, being deprecated
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o"; // Using full GPT-4o for best results

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string; detail?: "low" | "high" | "auto" } }
      >;
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    type?: string;
  };
}

const OPENAI_CHAT_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function callHuggingFaceVision(
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Create one at https://platform.openai.com/api-keys and add it to .env.local"
    );
  }

  const payload = {
    model: OPENAI_MODEL,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { 
              url: `data:${mimeType};base64,${base64Image}`,
              detail: "high" // High detail for better UI analysis
            },
          },
        ],
      } satisfies OpenAIMessage,
    ],
    max_tokens: 2000,
    temperature: 0.2,
  };

  const response = await fetch(OPENAI_CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as OpenAIResponse;

  if (!response.ok) {
    const errorMessage =
      result?.error?.message ||
      `OpenAI API error ${response.status}: ${JSON.stringify(result)}`;
    throw new Error(errorMessage);
  }

  const content = result.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI API returned no content");
  }

  return content;
}

/**
 * Basic connectivity test for OpenAI API
 */
export async function testHuggingFaceConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      message: "OPENAI_API_KEY environment variable is not set",
    };
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/models",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (response.ok) {
      return {
        success: true,
        message: `Successfully connected to OpenAI API using ${OPENAI_MODEL}`,
      };
    } else {
      const result = await response.json();
      return {
        success: false,
        message: `Failed to connect: ${result.error?.message || response.statusText}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Connection error: ${error.message}`,
    };
  }
}

