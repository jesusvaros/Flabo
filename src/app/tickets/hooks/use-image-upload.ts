import { useState } from "react";
import { useTicketCard } from "../context/TicketCardContext";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { createClient } from "../../../../utils/supabase/client";

export function useImageUpload() {
  const { ticket, state, addImage, removeImage, saveChanges } = useTicketCard();
  const { images } = state;
  const { analyzeImage, isAnalyzing } = useImageAnalysis();
  const [backgroundProcessing, setBackgroundProcessing] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Set loading state
    setBackgroundProcessing(prev => prev + files.length);
    
    // Process each file in parallel
    await Promise.all(Array.from(files).map(async (file, index) => {
      // 1. Upload to Supabase immediately
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        console.error("User not authenticated");
        return;
      }
      
      // Create a unique filename with the required folder structure
      const fileExt = file.name.split('.').pop();
      // First folder must be 'private' according to the policy rule
      const fileName = `private/${userId}/${Date.now()}-${index}.${fileExt}`;
      const filePath = fileName; // Store the path for reference
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('ticket-images')
        .upload(fileName, file);
        
      if (uploadError) {
        console.error("Error uploading to storage:", uploadError);
        return;
      }
      
      // Get public URL for display
      const { data: { publicUrl } } = supabase.storage
        .from('ticket-images')
        .getPublicUrl(fileName);
      
      // 2. Add image to ticket_images table with initial data
      const { data: imageData, error: dbError } = await supabase
        .from('ticket_images')
        .insert([
          { 
            image_url: publicUrl,
            storage_path: filePath,
            image_title: file.name || `Image ${images.length + 1}`,
            image_description: 'Analyzing...',
            ticket_id: ticket.id
          }
        ])
        .select()
        .single();
        
      if (dbError) {
        console.error("Error saving to ticket_images:", dbError);
        return;
      }
      
      // 3. Add image to ticket with initial data
      const imageIndex = images.length;
      addImage({
        image_title: file.name || `Image ${index + 1}`,
        image_description: 'Analyzing...',
        image_url: publicUrl,
        storage_path: filePath,
        id: imageData?.id
      });
      
      // 4. Start analysis in parallel
      try {
        const analysisResult = await analyzeImage(file);
        
        // When analysis completes, update with final data
        const title = analysisResult.caption || file.name || `Image ${index + 1}`;
        const description = analysisResult.extractedText || '';
        
        // Update the image in the ticket_images table with analysis results
        const { error: updateError } = await supabase
          .from('ticket_images')
          .update({ 
            image_title: title,
            image_description: description
          })
          .eq('id', imageData.id);
          
        if (updateError) {
          console.error("Error updating ticket_images:", updateError);
        }
        
        // Update the ticket data
        removeImage(imageIndex);
        addImage({
          image_title: title,
          image_description: description,
          image_url: publicUrl,
          storage_path: filePath,
          id: imageData.id
        });
        
        // Save changes to persist the updates
        await saveChanges();
      } catch (err) {
        console.error("Error analyzing image:", err);
        
        // Update with error message
        const { error: updateError } = await supabase
          .from('ticket_images')
          .update({ 
            image_description: 'Failed to analyze image'
          })
          .eq('id', imageData.id);
          
        if (updateError) {
          console.error("Error updating ticket_images with error status:", updateError);
        }
        
        // Update the ticket data
        removeImage(imageIndex);
        addImage({
          image_title: file.name || `Image ${index + 1}`,
          image_description: 'Failed to analyze image',
          image_url: publicUrl,
          storage_path: filePath,
          id: imageData.id
        });
        
        // Save changes
        await saveChanges();
      } finally {
        setBackgroundProcessing(prev => prev - 1);
      }
    }));
    
    // Reset input
    e.target.value = '';
  };

  // Helper to check if an image is processing
  const getImagePreview = (index: number): string | null => {
    // Images now come directly from Supabase, so preview is null
    return null;
  };
  
  const isImageProcessing = (index: number): boolean => {
    // Simplified: just check if backgroundProcessing > 0
    return backgroundProcessing > 0;
  };

  return {
    images,
    isAnalyzing,
    backgroundProcessing,
    handleImageUpload,
    getImagePreview,
    isImageProcessing
  };
}

