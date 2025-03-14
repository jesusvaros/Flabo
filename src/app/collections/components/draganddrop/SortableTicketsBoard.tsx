"use client";

import { 
  DndContext, 
  DragOverlay, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { TicketWithPositionConversion } from "@/types/collections";
import { SortableTicketCard } from "./SortableTicketCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useSortableTickets } from "./utils/useSortableTickets";

interface SortableTicketsBoardProps {
  tickets: TicketWithPositionConversion[];
  onReorder?: (tickets: TicketWithPositionConversion[]) => void;
}

export const SortableTicketsBoard = ({
  tickets,
  onReorder,
}: SortableTicketsBoardProps) => {
  const { activeId, activeTicket, handleDragStart, handleDragEnd, items } =
    useSortableTickets({
      tickets,
      onReorder,
    });
    
  // Use PointerSensor which works for both mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require a small movement to start dragging
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {tickets.map((ticket) => (
            <SortableTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeTicket && (
          <Card className="h-[100px] w-full max-w-[100%] select-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-base line-clamp-4">
                {activeTicket.content}
              </CardTitle>
            </CardHeader>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  );
};
