"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "@/types/collections";

interface DraggableTicketCardProps {
  ticket: Ticket;
}

export const DraggableTicketCard = ({ ticket }: DraggableTicketCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ticket.id,
  });

  const style = {
    position: 'absolute',
    top: ticket.position_y,
    left: ticket.position_x,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 999999 : ticket.z_index,
    width: '300px',
    height: '100px',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style as React.CSSProperties} 
      {...attributes} 
      {...listeners}
      className="absolute touch-none"
    >
      <Card
        className={`select-none h-full ${
          isDragging ? "opacity-80 shadow-lg" : ""
        } hover:shadow-md transition-shadow duration-200`}
      >
        <CardHeader>
          <CardTitle className="text-base line-clamp-4">
            {ticket.content}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
