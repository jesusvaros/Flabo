"use client";

import { useCallback, useRef, useEffect } from "react";
import { createClient } from "../../../../utils/supabase/client";


export const useDrawingStorage = (ticketId: string) => {
  const isMountedRef = useRef(true);

  const saveDrawing = useCallback(async (drawingData: any) => {
    if (!drawingData) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Check if a drawing already exists for this ticket
      const { data: existingDrawing } = await supabase
        .from('ticket_drawings')
        .select('id')
        .eq('ticket_id', ticketId)
        .single();

      if (existingDrawing) {
        // Update existing drawing
        await supabase
          .from('ticket_drawings')
          .update({
            data: drawingData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDrawing.id);
      } else {
        // Insert new drawing
        await supabase
          .from('ticket_drawings')
          .insert({
            ticket_id: ticketId,
            data: drawingData,
            created_by: user.id
          });
      }

      if (isMountedRef.current) {
        console.log(`Drawing for ticket ${ticketId} saved to database`);
      }
    } catch (error) {
      console.error("Error saving drawing to database:", error);
    }
  }, [ticketId]);


  const loadDrawing = useCallback(async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('ticket_drawings')
        .select('data')
        .eq('ticket_id', ticketId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching drawing:", error);
        return null;
      }

      if (data && isMountedRef.current) {
        // Return the data - the editor will load it
        console.log(`Drawing for ticket ${ticketId} loaded from database`);
        return data.data;
      }

      return null;
    } catch (error) {
      console.error("Error loading drawing from database:", error);
      return null;
    }
  }, [ticketId]);


  // Set up effect to handle component unmounting
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    saveDrawing,
    loadDrawing,
  };
};

