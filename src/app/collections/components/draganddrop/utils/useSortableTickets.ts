import { useState } from "react";
import { DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TicketWithPosition } from "@/types/collections";

interface UseSortableTicketsProps {
  tickets: TicketWithPosition[];
  onReorder?: (tickets: TicketWithPosition[]) => void;
}

interface UseSortableTicketsReturn {
  activeId: UniqueIdentifier | null;
  activeTicket: TicketWithPosition | undefined;
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
      const newTickets = arrayMove(tickets, oldIndex, newIndex).map(
        (ticket, index) => ({
          ...ticket,
          position: index,
        })
      );
      onReorder?.(newTickets);
    }
  };

  const activeTicket = activeId ? tickets.find((t) => t.id === activeId) : undefined;

  return {
    activeId,
    activeTicket,
    handleDragStart,
    handleDragEnd,
    items: tickets.map((ticket) => ticket.id),
  };
};
