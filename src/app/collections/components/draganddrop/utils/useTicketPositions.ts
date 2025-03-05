import { useState, useRef, useCallback, useEffect } from "react";
import { TicketWithPosition } from "@/types/collections";
import { createClient } from "../../../../../../utils/supabase/client";

interface UseTicketPositionsProps {
  collectionId: string;
  debounceMs?: number;
}

export const useTicketPositions = ({ 
  collectionId,
  debounceMs = 2000 
}: UseTicketPositionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingTickets, setPendingTickets] = useState<TicketWithPosition[]>([]);
  const supabase = createClient();
  const debounceTimer = useRef<NodeJS.Timeout>();

  const savePositions = async (tickets: TicketWithPosition[]) => {
    if (!collectionId) return;
    
    setIsUpdating(true);
    try {
      const updates = tickets.map((ticket, index) => ({
        collection_id: collectionId,
        ticket_id: ticket.id,
        position: index,
      }));

      const { error } = await supabase
        .from('collections_tickets')
        .upsert(
          updates,
          { 
            onConflict: 'collection_id,ticket_id',
            ignoreDuplicates: false 
          }
        );

      if (error) {
        console.error('Error updating positions:', error);
        throw error;
      }
      
      // Clear pending tickets after successful save
      setPendingTickets([]);
    } catch (error) {
      console.error('Error in savePositions:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePositions = useCallback((tickets: TicketWithPosition[]) => {
    // Update pending state immediately for optimistic UI
    setPendingTickets(tickets);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      savePositions(tickets);
    }, debounceMs);
  }, [collectionId, debounceMs]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    updatePositions,
    isUpdating,
    pendingTickets,
    hasPendingChanges: pendingTickets.length > 0
  };
};
