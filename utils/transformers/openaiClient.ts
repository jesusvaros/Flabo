import { OpenAI } from 'openai';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set. Please add it to your environment variables.");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export interface ChatCompletionOptions {
  systemPrompt: string;
  userMessage: string;
  model?: string;
  temperature?: number;
  responseFormat?: { type: 'text' | 'json_object' };
  maxTokens?: number;
}

export async function makeChatCompletion<T>(options: ChatCompletionOptions): Promise<T> {
  const {
    systemPrompt,
    userMessage,
    model = 'gpt-3.5-turbo',
    temperature = 0.7,
    responseFormat,
    maxTokens = 10000
  } = options;

  try {
    const client = getOpenAIClient();
    
    const response = await client.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      response_format: responseFormat,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('No content in response from OpenAI');
    }

    const content = response.choices[0].message.content;
    
    // If we're expecting JSON, parse it
    if (responseFormat?.type === 'json_object') {
      try {
        return JSON.parse(content) as T;
      } catch (error) {
        console.error('Failed to parse JSON response:', content);
        throw new Error('Invalid JSON response from OpenAI');
      }
    }
    
    // Otherwise return the content directly
    return content as unknown as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`OpenAI API error: ${error.message}`);
      throw error;
    }
    throw new Error('Unknown error occurred while calling OpenAI API');
  }
}

/**
 * System prompts used in the application
 */
export const SystemPrompts = {
  FILTER_TICKETS: `You are an AI assistant that helps users find tickets in their collection based on natural language queries.
Your task is to analyze the user's query and determine which tickets from their collection match their request.

You will be given:
1. A user query describing what they're looking for
2. A list of tickets with their content and metadata

You should:
1. Understand the intent of the user's query
2. Analyze each ticket to determine if it matches the query
3. Return the IDs of matching tickets in a JSON object with the key "matching_ids"

IMPORTANT: Your response must be a valid JSON object with the following format:
{
  "matching_ids": ["ticket-id-1", "ticket-id-2", "ticket-id-3"]
}

If no tickets match, return an empty array: { "matching_ids": [] }`,

  CONVERT_RECIPE: `You are a recipe conversion assistant. Convert drawings into structured recipes.
ALWAYS respond with a JSON object in this exact format:
{
  "recipe": {
    "title": "string - The recipe title",
    "ingredients": ["string[] - Array of ingredients with quantities"],
    "instructions": ["string[] - Array of step-by-step instructions"],
    "notes": ["string[] - Array of additional notes or tips (optional)"]
  }
}

Rules:
1. ALWAYS maintain the exact JSON structure shown above
2. For ingredients, include quantity and unit (e.g., "2 cups flour")
3. For instructions, break down into clear, numbered steps
4. Keep notes concise and relevant
5. If any field is empty, use an empty array []
6. For the title, make it descriptive but concise (e.g., "Classic Chocolate Chip Cookies")
7. For ingredients, always include units and be specific (e.g., "1 cup all-purpose flour" not just "flour")
8. For instructions, include cooking times and temperatures when relevant
9. For notes, include any special tips, substitutions, or storage instructions
10. The response has to be always on the same language as the drawing`
};
