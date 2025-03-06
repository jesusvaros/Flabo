"use client";

import { useCallback } from "react";
import { TLEditorSnapshot } from "tldraw";
import { createClient } from "../../../../utils/supabase/client";

export const useDrawingStorage = (ticketId: string) => {
  const saveDrawing = useCallback(async (drawing: TLEditorSnapshot) => {
    console.log("Guardando dibujo en Supabase...");
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
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
            data: drawing,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingDrawing.id);
      } else {
        // Insert new drawing
        await supabase
          .from('ticket_drawings')
          .insert({
            ticket_id: ticketId,
            data: drawing,
            created_by: user.id
          });
      }
      console.log("Dibujo guardado correctamente");
    } catch (error) {
      console.error("Error saving drawing to database:", error);
    }
  }, [ticketId]);

  return {
    saveDrawing
  };
};

