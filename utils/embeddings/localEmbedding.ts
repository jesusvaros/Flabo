import { pipeline } from '@xenova/transformers';

let localEmbedder: any;

async function initLocalEmbedder() {
  if (!localEmbedder) {
    try {
      console.log("Initializing local embedder...");
      localEmbedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      console.log("Local embedder initialized successfully");
    } catch (error) {
      console.error("Failed to initialize local embedder:", error);
      throw error;
    }
  }
  return localEmbedder;
}

export async function getLocalEmbedding(text: string): Promise<number[]> {
  try {
    console.log("Getting embedding for text:", text.substring(0, 50) + "...");
    const embedder = await initLocalEmbedder();
    
    // Get the embedding result
    const result = await embedder(text, { pooling: 'mean', normalize: true });
    
    // Direct access to the Float32Array data from the Proxy(Tensor) object
    if (result && typeof result === 'object' && 'data' in result) {
      // Access the data property directly
      const data = result.data;
      
      // If it's a Float32Array, convert it to a regular array
      if (data instanceof Float32Array) {
        console.log("Successfully extracted Float32Array data, length:", data.length);
        return Array.from(data);
      }
    }
    
    // If we couldn't extract the data directly, try to access it as a property
    if (result && typeof result === 'object') {
      try {
        // Try to access the data as a property
        // @ts-ignore - We're using runtime checks to handle the Proxy object
        const dataArray = Array.from(result.data).map(Number);
        console.log("Extracted data using Array.from, length:", dataArray.length);
        return dataArray;
      } catch (e) {
        console.error("Failed to convert data using Array.from:", e);
      }
      
      // Try to manually copy the data
      if ('size' in result && typeof result.size === 'number' && 'data' in result) {
        try {
          const size = result.size as number;
          const dataArray: number[] = new Array(size);
          // @ts-ignore - We're using runtime checks to handle the Proxy object
          for (let i = 0; i < size; i++) {
            dataArray[i] = Number(result.data[i]);
          }
          console.log("Manually copied data array, length:", dataArray.length);
          return dataArray;
        } catch (e) {
          console.error("Failed to manually copy data:", e);
        }
      }
    }
    
    // Last resort: try to stringify and parse the result
    try {
      // This is a hack, but might work for some Proxy objects
      const stringified = JSON.stringify(result);
      const parsed = JSON.parse(stringified);
      if (parsed && parsed.data && Array.isArray(parsed.data)) {
        console.log("Extracted data using JSON stringify/parse, length:", parsed.data.length);
        return parsed.data.map(Number);
      }
    } catch (e) {
      console.error("Failed to extract data using JSON stringify/parse:", e);
    }
    
    console.error('Could not extract embedding data from result:', result);
    throw new Error('Failed to extract embedding data');
  } catch (error) {
    console.error('Error generating local embedding:', error);
    throw error;
  }
}
