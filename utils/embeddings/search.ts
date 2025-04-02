import { getLocalEmbedding } from './localEmbedding';
import { cosineSimilarity } from './similarity';

interface SearchResult {
  text: string;
  score: number;
  originalIndex?: number;
}

export async function searchLocally(query: string, recipeTexts: string[]): Promise<SearchResult[]> {
  try {
    console.log("Starting local search with query:", query);
    console.log("Number of texts to search:", recipeTexts.length);
    
    // Generate embedding for the query
    let queryVec: number[];
    try {
      queryVec = await getLocalEmbedding(query);
      console.log("Query vector generated successfully, length:", queryVec.length);
    } catch (error) {
      console.error("Failed to generate query embedding:", error);
      throw new Error("Could not generate embedding for search query");
    }
    
    // Generate embeddings for all recipes
    const recipeVecs: number[][] = [];
    const validRecipeIndices: number[] = [];
    
    for (let i = 0; i < recipeTexts.length; i++) {
      try {
        const vec = await getLocalEmbedding(recipeTexts[i]);
        recipeVecs.push(vec);
        validRecipeIndices.push(i);
      } catch (error) {
        console.error(`Error generating embedding for text at index ${i}:`, error);
        // Skip this recipe
      }
    }
    
    console.log("Successfully generated embeddings for", recipeVecs.length, "out of", recipeTexts.length, "texts");
    
    if (recipeVecs.length === 0) {
      console.warn("No valid embeddings were generated for any texts");
      return [];
    }

    // Calculate similarity scores only for valid recipes
    const scores: SearchResult[] = validRecipeIndices.map((originalIndex, i) => {
      const text = recipeTexts[originalIndex];
      const vec = recipeVecs[i];
      const score = cosineSimilarity(queryVec, vec);
      return { text, score, originalIndex };
    }).filter(result => !isNaN(result.score) && isFinite(result.score));

    console.log("Generated", scores.length, "valid similarity scores");
    
    // Sort by score in descending order
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    
    // Log some of the top results
    if (sortedScores.length > 0) {
      console.log("Top results:", sortedScores.slice(0, 3).map(r => ({ 
        score: r.score, 
        textPreview: r.text.substring(0, 50) + "..." 
      })));
    }
    
    return sortedScores;
  } catch (error) {
    console.error("Error in searchLocally:", error);
    throw error; // Rethrow to handle in the calling function
  }
}

export async function searchRecipes({
  query,
  recipeTexts,
}: {
  query: string;
  recipeTexts: string[];
}): Promise<SearchResult[]> {
  try {
    return await searchLocally(query, recipeTexts);
  } catch (error) {
    console.error("Error in searchRecipes:", error);
    return []; // Return empty array on error at this level
  }
}
