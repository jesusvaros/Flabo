import { useState, useRef, useCallback, useEffect } from "react";
import { TicketWithPosition } from "@/types/collections";
import { createClient } from "../../../../../../utils/supabase/client";

interface UseTicketPositionsProps {
  collectionId: string;
  tickets: TicketWithPosition[];
}

export const useTicketPositions = ({
  collectionId,
  tickets,
}: UseTicketPositionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();
  const debounceTimer = useRef<NodeJS.Timeout>();
  const isSavingRef = useRef(false);

  const savePositions = async (tickets: TicketWithPosition[]) => {
    if (!collectionId || isSavingRef.current) return;
    
    try {
      isSavingRef.current = true;
      setIsUpdating(true);
      
      const updates = tickets.map((ticket, index) => ({
        collection_id: collectionId,
        ticket_id: ticket.id,
        position: index,
        position_x: ticket.position_x,
        position_y: ticket.position_y,
        z_index: ticket.z_index,
      }));

      const { error } = await supabase
        .from("collections_tickets")
        .upsert(updates, {
          onConflict: "collection_id,ticket_id",
          ignoreDuplicates: false,
        });

      if (error) {
        console.error("Error updating positions:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in savePositions:", error);
      throw error;
    } finally {
      isSavingRef.current = false;
      setIsUpdating(false);
      debounceTimer.current = undefined;
    }
  };

  const updatePositions = useCallback(
    (updatedTickets: TicketWithPosition[]) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        savePositions(updatedTickets);
      }, 2000);
      
      setIsUpdating(true);
    },
    [collectionId]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      setIsUpdating(false);
    };
  }, []);

  return {
    updatePositions,
    isUpdating,
    hasPendingChanges: !!debounceTimer.current,
  };
};
