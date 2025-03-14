import { useState } from "react";
import { DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TicketWithPositionConversion } from "@/types/collections";

interface UseSortableTicketsProps {
  tickets: TicketWithPositionConversion[];
  onReorder?: (tickets: TicketWithPositionConversion[]) => void;
}

interface UseSortableTicketsReturn {
  activeId: UniqueIdentifier | null;
  activeTicket: TicketWithPositionConversion | undefined;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  items: UniqueIdentifier[];
}

export const useSortableTickets = ({ 
  tickets, 
  onReorder 
}: UseSortableTicketsProps): UseSortableTicketsReturn => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = tickets.findIndex((ticket) => ticket.id === active.id);
    const newIndex = tickets.findIndex((ticket) => ticket.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Create new array with updated positions
      const newTickets = arrayMove(tickets, oldIndex, newIndex).map(
        (ticket, index) => ({
          ...ticket,
          position: index,
          position_x: ticket.position_x,
          position_y: ticket.position_y,
          z_index: ticket.z_index
        })
      );
      onReorder?.(newTickets);
    }
  };

  const activeTicket = activeId ? tickets.find((t) => t.id === activeId) : undefined;

  // Sort tickets by position and map to UniqueIdentifier
  const sortedItems = [...tickets]
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map(ticket => ticket.id as UniqueIdentifier);

  return {
    activeId,
    activeTicket,
    handleDragStart,
    handleDragEnd,
    items: sortedItems,
  };
};
