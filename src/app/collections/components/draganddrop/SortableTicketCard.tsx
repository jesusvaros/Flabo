"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketWithPosition } from "@/types/collections";
import { CSSProperties } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTicketCardProps {
  ticket: TicketWithPosition;
  disabled?: boolean;
}

export const SortableTicketCard = ({ 
  ticket,
  disabled = false 
}: SortableTicketCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: ticket.id as UniqueIdentifier,
    disabled
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <Card
        className={cn(
          "h-[100px] select-none hover:shadow-md transition-shadow duration-200 relative",
          isDragging && "opacity-50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <CardHeader>
          <CardTitle className="text-base line-clamp-4 pr-8">
            {ticket.content}
          </CardTitle>
        </CardHeader>
        {!disabled && (
          <div 
            {...attributes} 
            {...listeners}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </Card>
    </div>
  );
};
