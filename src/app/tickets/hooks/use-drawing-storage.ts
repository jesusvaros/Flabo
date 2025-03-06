"use client";

import { useCallback } from "react";
import { TLEditorSnapshot } from "tldraw";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCollection } from "@/app/collections/context/CollectionContext";

export const useDrawingStorage = (ticketId: string) => {
  const router = useRouter();
  const { refetchTicket } = useCollection();

  const saveDrawing = useCallback(
    async (drawing: TLEditorSnapshot) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User not authenticated");
        return;
      }

      try {
        // Check if a drawing already exists for this ticket
        const { data: existingDrawing } = await supabase
          .from("ticket_drawings")
          .select("id")
          .eq("ticket_id", ticketId)
          .single();

        if (existingDrawing) {
          // Update existing drawing
          await supabase
            .from("ticket_drawings")
            .update({
              data: drawing,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingDrawing.id);
        } else {
          // Insert new drawing
          await supabase.from("ticket_drawings").insert({
            ticket_id: ticketId,
            data: drawing,
            created_by: user.id,
          });
        }

        // Refresh the ticket data in the collection context
        try {
          await refetchTicket(ticketId);
        } catch (refreshError) {
          console.error("Error refreshing ticket data:", refreshError);
        }
      } catch (error) {
        console.error("Error saving drawing to database:", error);
      }
    },
    [ticketId, refetchTicket, router]
  );

  return {
    saveDrawing,
  };
};
