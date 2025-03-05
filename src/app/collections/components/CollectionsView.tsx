"use client";

import { useParams } from "next/navigation";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { TicketsBoard } from "./draganddrop/SortableTicketsBoard";
import { CollectionViewProps } from "@/types/collections";

export const CollectionsView = ({
  collections,
  selectedCollection,
}: CollectionViewProps) => {
  const handlePositionChange = (id: string) => {
    // Position updates are now handled in the TicketsBoard component
    console.log("Position updated for ticket", id);
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
            <h1 className="text-2xl font-bold mb-6">{selectedCollection.title}</h1>
            <TicketsBoard
              tickets={selectedCollection.tickets || []}
              collectionId={selectedCollection.id}
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
