import { RecipeSource } from '@/app/tickets/api/recipeConversions';
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
    maxTokens = 1000
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

  CONVERT_RECIPE: `You are a recipe conversion assistant. Convert text and images into structured recipes.
ALWAYS respond with a JSON object in this exact format AND ALWAYS ON THE SAME LANGUAJE AS THE INPUT TEXT:
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
10. The response has to be always in the same language as the input text

IMPORTANT HANDLING OCR TEXT ERRORS:
1. The images may contain text extracted by OCR with errors and typos
2. Try to correct obvious OCR errors in the image descriptions
3. Focus on extracting meaningful information even when text is fragmented
4. Identify recipe components (title, ingredients, instructions) even from poorly formatted OCR text
5. Skip irrelevant or unintelligible parts of the OCR text
6. If multiple images contain the same recipe information, combine and deduplicate
7. Prioritize clear, readable information over garbled text
8. Use additional context from ticket title and ticket info to help with interpretation
9. If the title appears in multiple places, choose the clearest instance
10. When extracting quantities, correct obvious OCR errors in numbers and units`
};


// Process recipe content with AI (client-side)
export function processRecipeWithAI(sources: RecipeSource): string {
  console.log('Processing recipe with AI using multiple sources:', sources);
  
  // Extract image data: only use image_description and image_title
  const imageData = sources.images?.map(img => ({
    title: img.image_title || '',
    description: img.image_description || ''
  })) || [];
  
  // Extract ticket data: use text_content and content
  const ticketContent = sources.ticketData?.content || '';
  const ticketTextContent = sources.ticketData?.text_content || '';
  
  // For link source: use placeholder for now
  const linkSource = sources.linkUrl ? `Link source: ${sources.linkUrl}` : 'No link provided';
  
  // Format all the data into a structured recipe
  let processedRecipe = `# Recipe extracted from ticket\n\n`;
  
  // Add ticket content
  if (ticketContent) {
    processedRecipe += `## Ticket title\n${ticketContent}\n\n`;
  }
  
  // Add ticket text content
  if (ticketTextContent) {
    processedRecipe += `## Ticket additional info\n${ticketTextContent}\n\n`;
  }
  
  // Add image data
  if (imageData.length > 0) {
    processedRecipe += `## Images\n`;
    imageData.forEach((img, index) => {
      if (img.title || img.description) {
        processedRecipe += `### Image ${index + 1}\n`;
        if (img.title) processedRecipe += `**Title:** ${img.title}\n`;
        if (img.description) processedRecipe += `**Description:** ${img.description}\n`;
        processedRecipe += '\n';
      }
    });
  }
  
  if(linkSource) {
    processedRecipe += `## Link Source\n${linkSource}\n\n`;
  }
 
  console.log('processedRecipe', processedRecipe);
  return processedRecipe;
}