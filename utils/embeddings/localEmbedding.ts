import { pipeline } from '@xenova/transformers';

let localEmbedder: any;

async function initLocalEmbedder() {
  if (!localEmbedder) {
    localEmbedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return localEmbedder;
}

export async function getLocalEmbedding(text: string): Promise<number[]> {
  const embedder = await initLocalEmbedder();
  const result = await embedder(text);
  return result.data[0]; // returns a flat array
}
