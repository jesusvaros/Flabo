import { getLocalEmbedding } from "./localEmbedding";
import { cosineSimilarity } from "./similarity";

export interface SearchResult {
  text: string;
  score: number;
  originalIndex?: number;
}

export async function searchLocally(query: string, recipeTexts: string[]): Promise<SearchResult[]> {
  try {
    console.log(`Searching ${recipeTexts.length} texts for: "${query}"`);
    
    // Generate embedding for the query
    const queryVec = await getLocalEmbedding(query);
    
    // Generate embeddings for all recipes
    const recipeVecs: number[][] = [];
    const validRecipeIndices: number[] = [];
    
    for (let i = 0; i < recipeTexts.length; i++) {
      try {
        const vec = await getLocalEmbedding(recipeTexts[i]);
        recipeVecs.push(vec);
        validRecipeIndices.push(i);
      } catch (error) {
        // Skip this recipe if embedding fails
        console.log(`Skipping text #${i} - embedding failed`);
      }
    }
    
    if (recipeVecs.length === 0) {
      return [];
    }

    // Calculate similarity scores
    const scores = validRecipeIndices.map((originalIndex, i) => ({
      text: recipeTexts[originalIndex],
      score: cosineSimilarity(queryVec, recipeVecs[i]),
      originalIndex
    })).filter(result => !isNaN(result.score));
    
    // Sort by score in descending order
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    
    // Log top results
    console.log(`Found ${sortedScores.length} results. Top score: ${sortedScores[0]?.score.toFixed(3) || 'none'}`);
    
    return sortedScores;
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}

export interface SearchRecipesOptions {
  query: string;
  recipeTexts: string[];
}

export async function searchRecipes({ query, recipeTexts }: SearchRecipesOptions): Promise<SearchResult[]> {
  return searchLocally(query, recipeTexts);
}
