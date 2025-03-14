"use client";

import { 
  DndContext, 
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDroppable,
  rectIntersection
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { TicketWithPositionConversion } from "@/types/collections";
import { SortableTicketCard } from "./SortableTicketCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useSortableTickets } from "./utils/useSortableTickets";
import { Trash2 } from "lucide-react";
import { createClient } from "../../../../../utils/supabase/client";
import { useCollection } from "../../context/CollectionContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SortableTicketsBoardProps {
  tickets: TicketWithPositionConversion[];
  onReorder?: (tickets: TicketWithPositionConversion[]) => void;
}

const DeleteBin = ({ isDragging }: { isDragging: boolean }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'delete-bin',
    data: {
      accepts: ['ticket']
    }
  });

  if (!isDragging) return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute bottom-8 right-1/3 w-48 h-24 rounded-md flex items-center justify-center gap-3 transition-all duration-200",
        isOver ? "bg-destructive/20 scale-105" : "bg-muted/50",
        "border-2 border-dashed",
        isOver ? "border-destructive" : "border-muted-foreground"
      )}
    >
      <Trash2 className={cn(
        "w-7 h-7 transition-colors",
        isOver ? "text-destructive" : "text-muted-foreground"
      )} />
      <span className={cn(
        "text-sm font-medium",
        isOver ? "text-destructive" : "text-muted-foreground"
      )}>
        Drop to delete
      </span>
    </div>
  );
};

export const SortableTicketsBoard = ({
  tickets,
  onReorder,
}: SortableTicketsBoardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { collection, refetchCollection } = useCollection();
  const { activeTicket, handleDragStart, handleDragEnd, items } =
    useSortableTickets({
      tickets,
      onReorder,
    });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStartWithState = (event: DragStartEvent) => {
    setIsDragging(true);
    handleDragStart(event);
  };

  const handleDragEndWithDelete = async (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over?.id === 'delete-bin' && collection) {
      const supabase = createClient();
      try {
        const { error } = await supabase
          .from('collections_tickets')
          .delete()
          .eq('collection_id', collection.id)
          .eq('ticket_id', active.id);

        if (error) throw error;

        await refetchCollection();
      } catch (error) {
        console.error('Error deleting ticket from collection:', error);
      }
    } else {
      handleDragEnd(event);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStartWithState}
      onDragEnd={handleDragEndWithDelete}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {tickets.map((ticket) => (
            <SortableTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </SortableContext>
      </div>
      <DeleteBin isDragging={isDragging} />
      <DragOverlay>
        {activeTicket && (
           <SortableTicketCard key={activeTicket.id} ticket={activeTicket} />
        )}
      </DragOverlay>
    </DndContext>
  );
};
