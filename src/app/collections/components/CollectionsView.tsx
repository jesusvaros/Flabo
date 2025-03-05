"use client";

import { useState, useEffect } from "react";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { CollectionViewProps, TicketWithPosition } from "@/types/collections";
import { Button } from "@/components/ui/button";
import { SortableTicketsBoard } from "./draganddrop/SortableTicketsBoard";
import { useTicketPositions } from "./draganddrop/utils/useTicketPositions";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const CollectionsView = ({
  collections,
  selectedCollection,
}: CollectionViewProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localTickets, setLocalTickets] = useState<TicketWithPosition[]>(
    [...(selectedCollection?.tickets || [])].sort((a, b) => (a.position || 0) - (b.position || 0))
  );

  // Update local tickets when collection changes
  useEffect(() => {
    setLocalTickets(
      [...(selectedCollection?.tickets || [])].sort((a, b) => (a.position || 0) - (b.position || 0))
    );
  }, [selectedCollection?.tickets]);

  const { updatePositions, isUpdating, hasPendingChanges } = useTicketPositions({
    collectionId: selectedCollection?.id || "",
  });

  const handleReorder = async (tickets: TicketWithPosition[]) => {
    try {
      setLocalTickets(tickets);
      updatePositions(tickets);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen">
      <CollectionsSidebar
        collections={collections}
        currentCollectionId={selectedCollection?.id}
      />
      <div className="flex-1 p-4 overflow-hidden">
        {selectedCollection ? (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{selectedCollection.title}</h1>
                {hasPendingChanges && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => setIsDrawerOpen(true)}>
                  Add Tickets
                </Button>
              </div>
            </div>
            <SortableTicketsBoard
              tickets={localTickets}
              onReorder={handleReorder}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <CreateCollectionCard />
          </div>
        )}
      </div>
    </div>
  );
};
