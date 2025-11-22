# Hugging Face Integration (2025)

## Overview

The DevUX image analyzer now uses the **Hugging Face Router Chat Completions API** instead of the deprecated inference endpoint. This aligns with Hugging Face's new direction (GPT/Claude style schema) and gives us:

- Stable endpoint: `https://router.huggingface.co/v1/chat/completions`
- OpenAI-compatible payload shape
- Access to multi-modal (vision + text) models

## Environment Variables

```bash
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxx   # required
HUGGINGFACE_MODEL_ID=meta-llama/Llama-3.2-11B-Vision-Instruct  # optional override
```

- `HUGGINGFACE_API_TOKEN` can be generated at https://huggingface.co/settings/tokens (read scope)
- `HUGGINGFACE_MODEL_ID` is optional; defaults to `meta-llama/Llama-3.2-11B-Vision-Instruct`

## Request Payload

```jsonc
POST https://router.huggingface.co/v1/chat/completions
{
  "model": "meta-llama/Llama-3.2-11B-Vision-Instruct",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "<prompt>" },
        { "type": "image_url", "image_url": { "url": "data:<mime>;base64,<...>" } }
      ]
    }
  ],
  "max_tokens": 1200,
  "temperature": 0.2,
  "top_p": 0.9
}
```

Important details:
- `content` is an array of blocks (text + image)
- Images are embedded via `data:` URLs (base64)
- Responses follow the OpenAI Chat Completions format

## Response Handling

Router responses look like:

```json
{
  "id": "chatcmpl-123",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": [
          { "type": "text", "text": "{ ... JSON output ... }" }
        ]
      }
    }
  ]
}
```

We join all text blocks and feed them into our JSON extractors for tokens/components/layouts.

## Error Handling

- Non-2xx responses include an `error` field (e.g. rate limits, model loading)
- We surface the raw error in the Debug Log for visibility
- The client retries automatically inside the router (no manual retry yet)

Common errors:

| Status | Meaning | Action |
|--------|---------|--------|
| 401 | Invalid/missing token | Check `.env.local` |
| 403 | Scope or quota issue | Upgrade token or wait |
| 404 | Model not found | Set `HUGGINGFACE_MODEL_ID` to a valid router model |
| 429 | Rate limit | Wait a bit |
| 503 | Model loading | Wait 30s and retry |

## Model Recommendations

- Default: `meta-llama/Llama-3.2-11B-Vision-Instruct`
- Other tested options:
  - `llava-hf/llava-1.5-7b-hf` (lighter, but slower to load)
  - `anthropic/claude-3.5-sonnet` (if/when exposed via router)
  - `google/gemini-1.5-flash` (fast, pragmatic)

Use the model that best balances accuracy vs speed for your quota tier.

## Code Location

- Client: `lib/image-analyzer/huggingface-client.ts`
- Token Parser: `lib/image-analyzer/token-parser.ts`
- Component Parser: `lib/image-analyzer/component-parser.ts`
- Layout Parser: `lib/image-analyzer/layout-parser.ts`

All parsers consume the same helper (`callHuggingFaceVision`) which abstract the router call.

