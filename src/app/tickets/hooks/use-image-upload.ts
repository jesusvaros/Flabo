import { useState } from "react";
import { useTicketCard } from "../context/TicketCardContext";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import { createClient } from "../../../../utils/supabase/client";

export function useImageUpload() {
  const { ticket, state, addImage, removeImage, saveChanges } = useTicketCard();
  const { images } = state;
  const { analyzeImage, isAnalyzing } = useImageAnalysis();
  
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

    
    // Auth check - do it once for all files
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      console.error("User not authenticated");
      return;
    }
    
    // Process each file in parallel with unique timestamps
    await Promise.all(Array.from(files).map(async (file, index) => {
      try {
        // Create a truly unique filename with user ID, ticket ID, timestamp and uuid
        const fileExt = file.name.split('.').pop();
        const uniqueId = Date.now() + '-' + index + '-' + Math.random().toString(36).substring(2, 10);
        const fileName = `${userId}/${ticket.id}/${uniqueId}.${fileExt}`;
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
        
        // Analyze the image
        const analysisResult = await analyzeImage(file);
        const title = analysisResult.caption || file.name || `Image ${index + 1}`;
        const description = analysisResult.extractedText || '';
        
        // Add image to ticket_images table with all data at once
        const { data: imageData, error: dbError } = await supabase
          .from('ticket_images')
          .insert([
            { 
              image_url: publicUrl,
              storage_path: filePath,
              image_title: title,
              image_description: description,
              ticket_id: ticket.id
            }
          ])
          .select()
          .single();
          
        if (dbError) {
          console.error("Error saving to ticket_images:", dbError);
          return;
        }
        
        // Add to local state
        addImage({
          image_title: title,
          image_description: description,
          image_url: publicUrl,
          storage_path: filePath,
          id: imageData.id
        });
      } catch (err) {
        console.error("Error processing image:", err);
      }
    }));
    
    // Save changes once after all images are processed
    await saveChanges();
    
    // Reset input
    e.target.value = '';
  };

  return {
    images,
    isAnalyzing,
    handleImageUpload,
    handleDeleteImage
  };
}

