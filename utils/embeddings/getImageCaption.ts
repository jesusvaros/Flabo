import { initImageCaptionModel } from "../transformers/modelLoader";

/**
 * Get a caption for an image
 * @param imageElement HTML Image element or image URL
 * @returns Promise with the generated caption text
 */
export async function getImageCaption(imageElement: HTMLImageElement | string): Promise<string> {
  try {
    const captioner = await initImageCaptionModel();
    const output = await captioner(imageElement);
    console.log("Image caption output:", output);
    
    // The output should be an array of generated captions with confidence scores
    if (Array.isArray(output) && output.length > 0 && output[0].generated_text) {
      // Clean up the caption
      let caption = output[0].generated_text;
      
      // Capitalize first letter
      caption = caption.charAt(0).toUpperCase() + caption.slice(1);
      
      return caption;
    }
    
    throw new Error('Invalid caption output format');
  } catch (error) {
    console.error('Error generating image caption:', error);
    throw error;
  }
}
