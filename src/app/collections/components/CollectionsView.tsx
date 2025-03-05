"use client";
import { useState } from "react";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { TicketsBoard } from "./draganddrop/SortableTicketsBoard";
import { TicketsDrawer } from "./draganddrop/TicketsDrawer";
import { CollectionViewProps } from "@/types/collections";
import { SaveIndicator } from "@/components/ui/save-indicator";
import { useDebouncePositions } from "@/hooks/useDebouncePositions";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const CollectionsView = ({
  collections,
  selectedCollection,
  tickets = [],
}: CollectionViewProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id === "board" && selectedCollection) {
      const ticket = active.data.current;

      // Calculate initial position
      const boardElement = document.querySelector(
        '[data-droppable-id="board"]'
      );
      let positionX = 100;
      let positionY = 100;

      if (boardElement) {
        const rect = boardElement.getBoundingClientRect();
        const overRect = event.over?.rect;
        console.log(overRect);
        const overPosition = {
          x: overRect?.height ?? 0,
          y: overRect?.width ?? 0,
        };
        positionX = overPosition.x - rect.left + 16;
        positionY = overPosition.y - rect.top + 16;
      }

      try {
        // Add ticket to collection
        const response = await fetch("/api/add-ticket-to-collection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collectionId: selectedCollection.id,
            ticketId: active.id,
            positionX,
            positionY,
            zIndex:
              Math.max(
                ...(selectedCollection.tickets || []).map((t) => t.z_index),
                0
              ) + 1,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to add ticket:", data.error);
          return;
        }

        setIsDrawerOpen(false);
        router.refresh();
      } catch (error) {
        console.error("Error adding ticket:", error);
      }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        <CollectionsSidebar
          collections={collections}
          currentCollectionId={selectedCollection?.id}
        />
        <div className="flex-1 p-4 overflow-hidden">
          {selectedCollection ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                  {selectedCollection.title}
                </h1>
                <div className="flex items-center gap-4">
                  <SaveIndicator
                    isSaving={isSaving}
                    hasUnsavedChanges={hasUnsavedChanges}
                  />
                  <Button onClick={() => setIsDrawerOpen(true)}>
                    Add Tickets
                  </Button>
                </div>
              </div>
              <TicketsBoard
                tickets={selectedCollection.tickets || []}
                onPositionChange={handlePositionChange}
                droppableId="board"
              />
              <TicketsDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                collectionId={selectedCollection.id}
              />
              <DragOverlay>
                {activeId && tickets ? (
                  <Card className="w-[300px] h-[100px] cursor-grabbing opacity-80">
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {tickets.find((t) => t.id === activeId)?.content}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ) : null}
              </DragOverlay>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <CreateCollectionCard />
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
};
