# OpenAI function calls

What are function calls for in a nutshell?

Function calls can extract structured arguments from natural language.
for example for the function get_weather(city) the following user question would generate the following function call:

> What is the weather in Berlin tomorrow?

OpenAIs API would return structured data like:

```json
{
  "choices": [
    {
      "finish_reason": "function_call",
      "index": 0,
      "message": {
        "content": null,
        "function_call": {
          "arguments": "{\n  \"city\": \"Berlin\"\n}",
          "name": "get_weather"
        },
        "role": "assistant"
      }
    }
  ],
	// ...
  }
}



```

This response could then be plugged into an actual function we implemented to call a weather API.

---

## Implementation in Node.js

To use the example in this repo you need to have

- Node.js 20 installed
- Have an OpenAI API key exported in your environment as `OPENAPI_API_KEY`

```bash
# install dependencies
npm ci
# run the script
npx tsx index.ts --topic wisdom
```

---

Related articles:

- https://platform.openai.com/docs/api-reference/chat/create?lang=curl
- https://platform.openai.com/docs/guides/gpt/function-calling
- https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models
- https://cookbook.openai.com/examples/how_to_call_functions_for_knowledge_retrieval
