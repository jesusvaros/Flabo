import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

// Types for our hook's state and return values
interface ImageAnalysisState {
  isAnalyzing: boolean;
  caption: string | null;
  extractedText: string | null;
  foodRecognition: string | null;
  error: Error | null;
}

interface ImageAnalysisResult {
  caption: string | null;
  extractedText: string | null;
  foodRecognition: string | null;
  error: Error | null;
  success: boolean;
}

/**
 * Clean up recipe text from OCR
 * @param text The OCR text to clean
 */
const cleanRecipeText = (text: string): string => {
  if (!text) return '';
  
  try {
    // Common OCR mistakes and replacements
    const replacements: [RegExp, string][] = [
      // Fix common number/letter confusions
      [/(\d)l(\d)/g, '$1/$2'],  // Fix 1l2 -> 1/2
      [/(\d)I(\d)/g, '$1/$2'],  // Fix 1I2 -> 1/2
      [/([0-9])O/g, '$10'],     // Fix 1O -> 10
      [/O([0-9])/g, '0$1'],     // Fix O1 -> 01
      
      // Fix formatting issues
      [/\s+/g, ' '],            // Replace multiple spaces with single space
      [/\n\s*\n/g, '\n\n'],     // Replace multiple blank lines with double line break
      
      // Fix common measurement mistakes
      [/(\d)\s*g\s+/g, '$1g '],       // Fix spacing in grams
      [/(\d)\s*ml\s+/g, '$1ml '],     // Fix spacing in milliliters
      [/(\d)\s*oz\s+/g, '$1oz '],     // Fix spacing in ounces
      [/(\d)\s*tbsp\s+/g, '$1 tbsp '], // Fix spacing in tablespoons
      [/(\d)\s*tsp\s+/g, '$1 tsp '],   // Fix spacing in teaspoons
      
      // Fix common recipe section markers
      [/ingredients:?/gi, '\nINGREDIENTS:\n'],
      [/directions:?|instructions:?|method:?/gi, '\nINSTRUCTIONS:\n'],
      [/preparation:?/gi, '\nPREPARATION:\n'],
      [/notes:?/gi, '\nNOTES:\n'],
    ];
    
    // Apply all replacements
    let cleanedText = text;
    for (const [pattern, replacement] of replacements) {
      cleanedText = cleanedText.replace(pattern, replacement);
    }
    
    // Remove any strange symbols that might have been misrecognized
    cleanedText = cleanedText.replace(/[^a-zA-Z0-9.,;:'"!?()[\]\s\/°-]/g, '');
    
    // Trim extra whitespace
    cleanedText = cleanedText.trim();
    
    return cleanedText;
  } catch (error) {
    console.error("Error cleaning recipe text:", error);
    return text; // Return original text if cleaning fails
  }
};

/**
 * Try to detect food items both from text and image filename
 * @param fileName The name of the image file
 * @param extractedText Text extracted from the image through OCR
 * @returns Identified food item or null
 */
const identifyFoodItems = (fileName: string, extractedText: string | null): string | null => {
  try {
    const foodTerms = [
      'sandwich', 'pizza', 'pasta', 'salad', 'soup', 'bread', 'cake', 
      'cookie', 'pie', 'meat', 'chicken', 'beef', 'fish', 'rice', 
      'vegetable', 'fruit', 'breakfast', 'lunch', 'dinner', 'dessert'
    ];
    
    // Check filename first
    const lowerFileName = fileName.toLowerCase();
    for (const term of foodTerms) {
      if (lowerFileName.includes(term)) {
        return term.charAt(0).toUpperCase() + term.slice(1);
      }
    }
    
    // Then check OCR text if available
    if (extractedText) {
      const lowerText = extractedText.toLowerCase();
      for (const term of foodTerms) {
        if (lowerText.includes(term)) {
          return term.charAt(0).toUpperCase() + term.slice(1);
        }
      }
      
      // Look for common recipe titles in first 100 characters
      const firstPart = lowerText.substring(0, 100);
      if (firstPart.includes('recipe for') || firstPart.includes('how to make')) {
        // Extract what comes after "recipe for" or "how to make"
        const recipeForMatch = firstPart.match(/recipe for\s+([a-z\s]+)/i);
        const howToMakeMatch = firstPart.match(/how to make\s+([a-z\s]+)/i);
        
        if (recipeForMatch && recipeForMatch[1]) {
          return recipeForMatch[1].trim();
        } else if (howToMakeMatch && howToMakeMatch[1]) {
          return howToMakeMatch[1].trim();
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error identifying food:", error);
    return null;
  }
};

/**
 * Custom hook for analyzing images to extract text and generate fallback titles
 * Uses tesseract.js for OCR and a simple fallback for image captioning
 */
export function useImageAnalysis() {
  const [state, setState] = useState<ImageAnalysisState>({
    isAnalyzing: false,
    caption: null,
    extractedText: null,
    foodRecognition: null,
    error: null,
  });

  /**
   * Reset the analysis state
   */
  const reset = useCallback(() => {
    setState({
      isAnalyzing: false,
      caption: null,
      extractedText: null,
      foodRecognition: null,
      error: null,
    });
  }, []);

  /**
   * Process an image file or URL to extract text and generate a title
   * This function will never throw errors, instead returning error information in the result
   * @param imageSource The image to analyze (File object or image URL)
   * @param performOcr Whether to perform OCR on the image (defaults to true)
   * @returns Promise with the analysis results, including success/error status
   */
  const analyzeImage = useCallback(async (
    imageSource: File | string,
    performOcr: boolean = true
  ): Promise<ImageAnalysisResult> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      // Results to return
      let captionResult: string | null = null;
      let ocrResult: string | null = null;
      let foodRecognitionResult: string | null = null;
      let errorResult: Error | null = null;
      
      // Get filename for fallback purposes
      const fileName = typeof imageSource === 'string'
        ? imageSource.split('/').pop() || 'Image'
        : imageSource.name || 'Image';
      
      // Convert File to URL if needed
      let imageUrl: string;
      try {
        imageUrl = typeof imageSource === 'string' 
          ? imageSource 
          : URL.createObjectURL(imageSource);
      } catch (error) {
        console.error("Error creating object URL:", error);
        // Set fallbacks and return error
        const result = {
          caption: `Image: ${fileName.replace(/\.[^/.]+$/, "")}`,
          extractedText: null,
          foodRecognition: null,
          error: new Error(`Failed to process image: ${error}`),
          success: false
        };
        setState({ 
          isAnalyzing: false, 
          caption: result.caption,
          extractedText: null,
          foodRecognition: null,
          error: result.error
        });
        return result;
      }
      
      // Perform OCR with tesseract.js if requested
      if (performOcr) {
        try {
          console.log("Starting OCR processing...");
          const result = await Tesseract.recognize(imageUrl, 'eng');
          
          // Apply text cleaning to OCR results
          const rawText = result.data.text;
          ocrResult = cleanRecipeText(rawText);
          
          console.log("OCR completed and text cleaned");
        } catch (error) {
          console.error("Error during OCR:", error);
          // Don't fail completely, just note the error
          ocrResult = "";
          errorResult = new Error(`OCR failed: ${error}`);
        }
      }
      
      // Identify food items from filename and text
      try {
        foodRecognitionResult = identifyFoodItems(fileName, ocrResult);
      } catch (error) {
        console.error("Error identifying food:", error);
        foodRecognitionResult = null;
      }
      
      // Generate final caption based on all available information
      try {
        if (foodRecognitionResult) {
          // If we identified a food item, use it as the main caption
          captionResult = `Recipe: ${foodRecognitionResult}`;
        } else if (ocrResult && ocrResult.trim().length > 0) {
          // Otherwise use first line of extracted text if available
          const firstLine = ocrResult.split('\n')[0].trim();
          if (firstLine.length > 0) {
            captionResult = firstLine.length <= 50 
              ? `Recipe: ${firstLine}` 
              : `Recipe: ${firstLine.substring(0, 47)}...`;
          } else {
            captionResult = `Image: ${fileName.replace(/\.[^/.]+$/, "")}`;
          }
        } else {
          // Fallback to image filename
          captionResult = `Image: ${fileName.replace(/\.[^/.]+$/, "")}`;
        }
      } catch (error) {
        console.error("Error generating caption:", error);
        captionResult = `Image: ${fileName.replace(/\.[^/.]+$/, "")}`;
      }
      
      // Clean up URL object if created from File
      if (typeof imageSource !== 'string') {
        try {
          URL.revokeObjectURL(imageUrl);
        } catch (error) {
          console.error("Error revoking object URL:", error);
        }
      }
      
      // Set final state
      setState({ 
        isAnalyzing: false, 
        caption: captionResult,
        extractedText: ocrResult,
        foodRecognition: foodRecognitionResult,
        error: errorResult
      });
      
      // Return results with success status
      return {
        caption: captionResult,
        extractedText: ocrResult,
        foodRecognition: foodRecognitionResult,
        error: errorResult,
        success: errorResult === null
      };
    } catch (error) {
      console.error("Error analyzing image:", error);
      
      // Get filename for fallback purposes
      const fileName = typeof imageSource === 'string'
        ? imageSource.split('/').pop() || 'Image'
        : imageSource.name || 'Image';
      
      // Create error result
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Set error state
      setState({ 
        isAnalyzing: false, 
        caption: `Image: ${fileName.replace(/\.[^/.]+$/, "")}`,
        extractedText: null,
        foodRecognition: null,
        error: errorObj
      });
      
      // Return error result but never throw
      return {
        caption: `Image: ${fileName.replace(/\.[^/.]+$/, "")}`,
        extractedText: null,
        foodRecognition: null,
        error: errorObj,
        success: false
      };
    }
  }, []);

  return {
    analyzeImage,
    isAnalyzing: state.isAnalyzing,
    caption: state.caption,
    extractedText: state.extractedText,
    foodRecognition: state.foodRecognition,
    error: state.error,
    reset
  };
}
