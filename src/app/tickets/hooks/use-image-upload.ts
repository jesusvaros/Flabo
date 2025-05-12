import { useState } from "react";
import { useTicketCard } from "../context/TicketCardContext";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { createClient } from "../../../../utils/supabase/client";

export function useImageUpload() {
  const { ticket, state, addImage, removeImage, saveChanges } = useTicketCard();
  console.log('state',state)
  const { images } = state;
  const { analyzeImage, isAnalyzing } = useImageAnalysis();
  const [backgroundProcessing, setBackgroundProcessing] = useState(0);
  
  // Function to delete an image
  const handleDeleteImage = async (ticket_image_id?: string) => {
    if (!ticket_image_id) return;
    
    try {
      const supabase = createClient();
      
      // 1. Get the image record to find the storage path
      const { data: imageRecord, error: fetchError } = await supabase
        .from('ticket_images')
        .select('storage_path')
        .eq('id', ticket_image_id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching image record:", fetchError);
        return;
      }
      
      if (imageRecord?.storage_path) {
        // Extract the path within the bucket
        // storage_path format is 'ticket-images/userId/ticketId/file.ext'
        const pathParts = imageRecord.storage_path.split('/');
        
        // The fileName should be in format 'userId/ticketId/timestamp-index.ext'
        // for the remove function (without the bucket name prefix)
        const fileName = pathParts.slice(1).join('/');
        
        // 2. Delete from storage bucket
        const { error: storageError } = await supabase.storage
          .from('ticket-images')
          .remove([fileName]);
          
        if (storageError) {
          console.error("Error deleting from storage:", storageError);
        }
      }
      
      // 3. Delete from ticket_images table
      const { error: dbError } = await supabase
        .from('ticket_images')
        .delete()
        .eq('id', ticket_image_id);
        
      if (dbError) {
        console.error("Error deleting from database:", dbError);
        return;
      }
      
      // 4. Update local state - find the index of the image with this ID
      const imageIndex = images.findIndex(img => img.id === ticket_image_id);
      if (imageIndex !== -1) {
        removeImage(imageIndex);
      }
      
    } catch (error) {
      console.error("Error in handleDeleteImage:", error);
    }
  };

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
      
      // Create a unique filename with user ID prefix
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${ticket.id}/${Date.now()}-${index}.${fileExt}`;
      const filePath = `ticket-images/${fileName}`;
      
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
        
        // Save changes
        await saveChanges();
      } finally {
        setBackgroundProcessing(prev => prev - 1);
      }
    }));
    
    // Reset input
    e.target.value = '';
  };

  return {
    images,
    isAnalyzing,
    backgroundProcessing,
    handleImageUpload,
    handleDeleteImage
  };
}

