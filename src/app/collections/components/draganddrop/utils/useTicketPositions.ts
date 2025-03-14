import { useState, useRef, useCallback, useEffect } from "react";
import { TicketWithPositionConversion } from "@/types/collections";
import { createClient } from "../../../../../../utils/supabase/client";

interface UseTicketPositionsProps {
  collectionId: string;
  tickets: TicketWithPositionConversion[];
}

export const useTicketPositions = ({
  collectionId,
  tickets,
}: UseTicketPositionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localTickets, setLocalTickets] = useState<TicketWithPositionConversion[]>(tickets);
  const supabase = createClient();
  const debounceTimer = useRef<NodeJS.Timeout>();
  const isSavingRef = useRef(false);

  // Only update localTickets from props when the collection ID changes
  // or when tickets array length changes (additions/deletions)
  useEffect(() => {
    if (tickets.length !== localTickets.length) {
      setLocalTickets(tickets);
    }
  }, [tickets.length, collectionId]);

  const savePositions = async (ticketsToSave: TicketWithPositionConversion[]) => {
    if (!collectionId || isSavingRef.current) return;
    
    try {
      isSavingRef.current = true;
      setIsUpdating(true);
      
      const updates = ticketsToSave.map((ticket, index) => ({
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
    (updatedTickets: TicketWithPositionConversion[]) => {
      setLocalTickets(updatedTickets);

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
    tickets: localTickets,
    updatePositions,
    isUpdating,
    hasPendingChanges: !!debounceTimer.current,
  };
};
