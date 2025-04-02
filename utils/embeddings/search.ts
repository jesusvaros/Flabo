import { getLocalEmbedding } from './localEmbedding';
import { cosineSimilarity } from './similarity';

export async function searchLocally(query: string, recipeTexts: string[]) {
  // Generate embedding for the query
  const queryVec = await getLocalEmbedding(query);

  // Generate embeddings for all recipes
  const recipeVecs = await Promise.all(recipeTexts.map(getLocalEmbedding));

  // Calculate similarity scores

  console.log("recipeVecs", recipeVecs, queryVec);
  const scores = recipeVecs.map((vec, i) => ({
    text: recipeTexts[i],
    score: cosineSimilarity(queryVec, vec),
  }));

  // Sort by score in descending order
  return scores.sort((a, b) => b.score - a.score);
}

export async function searchRecipes({
  query,
  recipeTexts,
}: {
  query: string;
  recipeTexts: string[];
}) {
  return await searchLocally(query, recipeTexts);

}
