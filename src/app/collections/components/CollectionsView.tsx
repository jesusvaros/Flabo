"use client";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { TicketsBoard } from "./draganddrop/SortableTicketsBoard";
import { CollectionViewProps } from "@/types/collections";
import { SaveIndicator } from "@/components/ui/save-indicator";
import { useDebouncePositions } from "@/hooks/useDebouncePositions";

export const CollectionsView = ({
  collections,
  selectedCollection,
}: CollectionViewProps) => {
  const { updatePosition, isSaving, hasUnsavedChanges } = useDebouncePositions({
    collectionId: selectedCollection?.id || "",
  });

  const handlePositionChange = (
    ticketId: string,
    position: { x: number; y: number }
  ) => {
    updatePosition(
      ticketId,
      position.x,
      position.y,
      Math.max(...(selectedCollection?.tickets || []).map((t) => t.z_index)) + 1
    );
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
              <h1 className="text-2xl font-bold">{selectedCollection.title}</h1>
              <SaveIndicator
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                className="mr-4"
              />
            </div>
            <TicketsBoard
              tickets={selectedCollection.tickets || []}
              onPositionChange={handlePositionChange}
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
