export function cosineSimilarity(a: number[] | null | undefined, b: number[] | null | undefined): number {
  // Check if inputs are valid
  if (!a || !b) {
    console.error('Null or undefined inputs for cosineSimilarity:', { a, b });
    return 0;
  }

  // Check if inputs are arrays
  if (!Array.isArray(a) || !Array.isArray(b)) {
    console.error('Invalid input types for cosineSimilarity:', { 
      aType: typeof a, 
      bType: typeof b,
      aIsArray: Array.isArray(a),
      bIsArray: Array.isArray(b)
    });
    return 0; // Return 0 similarity for invalid inputs
  }

  // Check if arrays have elements
  if (a.length === 0 || b.length === 0) {
    console.error('Empty vector(s) provided to cosineSimilarity:', { aLength: a.length, bLength: b.length });
    return 0;
  }

  // Check if arrays have the same length
  if (a.length !== b.length) {
    console.error('Vector dimensions do not match:', { aLength: a.length, bLength: b.length });
    return 0; // Return 0 similarity for mismatched dimensions
  }

  try {
    // Check if all elements are numbers
    const allNumbersA = a.every(item => typeof item === 'number' && !isNaN(item));
    const allNumbersB = b.every(item => typeof item === 'number' && !isNaN(item));
    
    if (!allNumbersA || !allNumbersB) {
      console.error('Vector contains non-numeric values:', { 
        allNumbersA, 
        allNumbersB,
        sampleA: a.slice(0, 3),
        sampleB: b.slice(0, 3)
      });
      return 0;
    }

    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    
    // Handle division by zero
    if (magA === 0 || magB === 0) {
      console.warn('Zero magnitude vector(s) in cosineSimilarity:', { magA, magB });
      return 0;
    }
    
    const similarity = dot / (magA * magB);
    
    // Check for NaN or invalid result
    if (isNaN(similarity) || !isFinite(similarity)) {
      console.error('Invalid similarity result:', { similarity, dot, magA, magB });
      return 0;
    }
    
    return similarity;
  } catch (error) {
    console.error('Error calculating cosine similarity:', error);
    return 0; // Return 0 similarity on error
  }
}
