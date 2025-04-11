import { pipeline } from '@xenova/transformers';

// Cache for transformer models
interface ModelCache {
  imageCaption?: any;
  embedder?: any;
  textGenerator?: any;
  ocr?: any;
  // Add more models as needed
}

// Global model cache
const modelCache: ModelCache = {};

/**
 * Initialize and cache the image captioning model
 * @returns The image captioning pipeline
 */
export async function initImageCaptionModel() {
  if (!modelCache.imageCaption) {
    try {
      console.log("Initializing image caption model...");
      modelCache.imageCaption = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
      console.log("Image caption model initialized successfully");
    } catch (error) {
      console.error("Failed to initialize image caption model:", error);
      throw error;
    }
  }
  return modelCache.imageCaption;
}

/**
 * Initialize and cache the embedding model
 * @returns The embedding pipeline
 */
export async function initEmbeddingModel() {
  if (!modelCache.embedder) {
    try {
      console.log("Initializing embedding model...");
      modelCache.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log("Embedding model initialized successfully");
    } catch (error) {
      console.error("Failed to initialize embedding model:", error);
      throw error;
    }
  }
  return modelCache.embedder;
}

/**
 * Initialize and cache the text generation model (flan-t5)
 * @returns The text generation pipeline
 */
export async function initTextGenerationModel() {
  if (!modelCache.textGenerator) {
    try {
      console.log("Initializing text generation model...");
      modelCache.textGenerator = await pipeline('text2text-generation', 'Xenova/flan-t5-base');
      console.log("Text generation model initialized successfully");
    } catch (error) {
      console.error("Failed to initialize text generation model:", error);
      throw error;
    }
  }
  return modelCache.textGenerator;
}

/**
 * Generate text based on a prompt using flan-t5-base
 * @param prompt The prompt to generate text from
 * @param options Generation options
 * @returns The generated text
 */
export async function generateText(
  prompt: string, 
  options: {
    maxLength?: number,
    numReturn?: number,
    temperature?: number
  } = {}
): Promise<string> {
  try {
    const generator = await initTextGenerationModel();
    
    // Set default options
    const genOptions = {
      max_new_tokens: options.maxLength || 30,
      num_return_sequences: options.numReturn || 1,
      temperature: options.temperature || 0.7,
      do_sample: true
    };
    
    // Generate text
    console.log('Prompt:', prompt);
    const result = await generator(prompt, genOptions);

    console.log("Generated Text:", result[0].generated_text);
    
    if (Array.isArray(result) && result.length > 0) {
      // Return the generated text (flan-t5 doesn't include the prompt in output)
      return result[0].generated_text.trim();
    }
    
    throw new Error('Invalid text generation result format');
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
}
