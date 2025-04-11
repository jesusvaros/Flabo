import { initImageCaptionModel } from "../transformers/modelLoader";

export async function getImageCaption(imageElement: HTMLImageElement | string): Promise<string> {
  try {
    const captioner = await initImageCaptionModel();
    const output = await captioner(imageElement);

    if (Array.isArray(output) && output.length > 0 && output[0].generated_text) {
      // Clean up the caption
      let caption = output[0].generated_text;
      
      // Capitalize first letter
      caption = caption.charAt(0).toUpperCase() + caption.slice(1);
      
      console.log("Caption:", caption);
      return caption;
    }
    
    throw new Error('Invalid caption output format');
  } catch (error) {
    throw error;
  }
}
