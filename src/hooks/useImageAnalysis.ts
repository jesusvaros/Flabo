import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';
import { getImageCaption } from '../../utils/embeddings/getImageCaption';
import { generateText } from '../../utils/transformers/modelLoader';

// Types for our hook's state and return values
interface ImageAnalysisState {
  isAnalyzing: boolean;
  caption: string | null;
  extractedText: string | null;
  error: Error | null;
}

interface ImageAnalysisResult {
  caption: string | null;
  extractedText: string | null;
  error: Error | null;
  success: boolean;
}

/**
 * Generate a title based on OCR text and image caption
 * @param ocrText The cleaned OCR text
 * @param imageCaption The image caption from model
 * @returns A suitable title for the image
 */
const generateTitle = async (ocrText: string | null, imageCaption: string | null): Promise<string> => {
  if (!ocrText && !imageCaption) {
    return 'Food Image';
  }
  
  try {
    // Create a prompt for the DistilGPT2 model
    let prompt = "Generate a short, descriptive title for an image based on the following information.\n";
    
    if (imageCaption) {
      prompt += `Image caption: ${imageCaption}\n`;
    }
    
    if (ocrText) {
      // Limit OCR text to avoid overwhelming the model
      const truncatedText = ocrText.length > 300 
        ? ocrText.substring(0, 300) + "..." 
        : ocrText;
      prompt += `Text detected in image: ${truncatedText}\n`;
    }
    
    prompt += "Title: ";
    
    // Generate title with DistilGPT2
    const title = await generateText(prompt, {
      maxLength: 20,
      temperature: 0.7,
    });
    
    // Clean up the generated title
    return title
      .replace(/^Title:?\s*/i, '')   // Remove any "Title:" prefix
      .replace(/[\n\r]/g, ' ')       // Replace newlines with spaces
      .trim();
  } catch (error) {
    console.error("Error generating title with DistilGPT2:", error);
    
    // Fallback to basic title creation if model fails
    if (imageCaption) {
      return imageCaption;
    } else if (ocrText) {
      const firstLine = ocrText.split('\n')[0].trim();
      if (firstLine.length > 0 && firstLine.length <= 50) {
        return firstLine;
      }
    }
    
    return 'Food Image';
  }
};

export function useImageAnalysis() {
  const [state, setState] = useState<ImageAnalysisState>({
    isAnalyzing: false,
    caption: null,
    extractedText: null,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      isAnalyzing: false,
      caption: null,
      extractedText: null,
      error: null,
    });
  }, []);

  /**
   * Process an image to extract text and generate a caption
   * @param imageSource The image to analyze (File object or image URL)
   * @returns Promise with the analysis results
   */
  const analyzeImage = useCallback(async (
    imageSource: File | string
  ): Promise<ImageAnalysisResult> => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      // Convert File to URL if needed
      const imageUrl = typeof imageSource === 'string' 
        ? imageSource 
        : URL.createObjectURL(imageSource);
      
      // Run OCR and Image Captioning in parallel
      const [ocrResult, captionResult] = await Promise.all([
        // Run OCR using Tesseract
        Tesseract.recognize(imageUrl, 'eng+spa')
          .then(result => result.data.text)
          .catch(error => {
            console.error("OCR error:", error);
            return null;
          }),
        
        // Get image caption using transformer model
        getImageCaption(imageUrl)
          .catch(error => {
            console.error("Caption error:", error);
            return null;
          })
      ]);
      
      console.log("OCR Result:", ocrResult);
      console.log("Caption Result:", captionResult);
      
      // Generate title using DistilGPT2
      const title = await generateTitle(ocrResult, captionResult);
      
      // Clean up URL object if created from File
      if (typeof imageSource !== 'string') {
        URL.revokeObjectURL(imageUrl);
      }
      
      // Set final state
      setState({ 
        isAnalyzing: false, 
        caption: title,
        extractedText: ocrResult,
        error: null
      });
      
      // Return results with success status
      return {
        caption: title,
        extractedText: ocrResult,
        error: null,
        success: true
      };
    } catch (error) {
      console.error("Error analyzing image:", error);
      
      // Set error state
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({ 
        isAnalyzing: false, 
        caption: null,
        extractedText: null,
        error: errorObj
      });
      
      // Return error result
      return {
        caption: null,
        extractedText: null,
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
    error: state.error,
    reset
  };
}
