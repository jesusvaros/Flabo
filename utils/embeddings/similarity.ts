export function cosineSimilarity(a: number[] | null | undefined, b: number[] | null | undefined): number {
  // Basic input validation
  if (!a || !b || !Array.isArray(a) || !Array.isArray(b)) {
    return 0;
  }

  // Check if arrays have the same length
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  try {
    // Calculate dot product
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    
    // Calculate magnitudes
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    
    // Handle division by zero and return similarity
    if (magA === 0 || magB === 0 || isNaN(dot) || !isFinite(dot)) {
      return 0;
    }
    
    return dot / (magA * magB);
  } catch (error) {
    return 0;
  }
}
