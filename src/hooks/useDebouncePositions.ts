import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../utils/supabase/client";

interface UseDebouncePositionsProps {
  collectionId: string;
  debounceTime?: number;
}

interface PositionUpdate {
  ticketId: string;
  position_x: number;
  position_y: number;
  z_index: number;
}

export const useDebouncePositions = ({
  collectionId,
  debounceTime = 6000, // Default to 0.1 minute
}: UseDebouncePositionsProps) => {
  const [positionUpdates, setPositionUpdates] = useState<PositionUpdate[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updatePosition = useCallback(
    (
      ticketId: string,
      position_x: number,
      position_y: number,
      z_index: number
    ) => {
      requestAnimationFrame(() => {
        setPositionUpdates((prev) => {
          // Remove any existing updates for this ticket
          const filtered = prev.filter(
            (update) => update.ticketId !== ticketId
          );
          return [...filtered, { ticketId, position_x, position_y, z_index }];
        });
        setHasUnsavedChanges(true);
      });
    },
    []
  );

  useEffect(() => {
    if (positionUpdates.length === 0) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);

      try {
        const supabase = await createClient();
        // Update each position individually since we can't batch update with multiple conditions
        const promises = positionUpdates.map((update) =>
          supabase
            .from("collections_tickets")
            .update({
              position_x: update.position_x,
              position_y: update.position_y,
              z_index: update.z_index,
            })
            .eq("collection_id", collectionId)
            .eq("ticket_id", update.ticketId)
        );

        const results = await Promise.all(promises);
        const errors = results
          .filter((result) => result.error)
          .map((result) => result.error);

        if (errors.length > 0) {
          throw errors[0];
        }

        setPositionUpdates([]);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to save positions:", error);
      } finally {
        setIsSaving(false);
      }
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [positionUpdates, collectionId, debounceTime]);

  return {
    updatePosition,
    isSaving,
    hasUnsavedChanges,
  };
};
