"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketWithPosition } from "@/types/collections";
import { CSSProperties, useState } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { BigTicketCard } from "@/app/tickets/components/BigTicketCard";

interface SortableTicketCardProps {
  ticket: TicketWithPosition;
  disabled?: boolean;
}

export const SortableTicketCard = ({
  ticket,
  disabled = false,
}: SortableTicketCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket.id,
    disabled,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-drag-handle]")) {
      return;
    }
    
    // Capturar la posición del clic
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setClickPosition({
      x: rect.left + rect.width / 2, // Centro de la tarjeta en X
      y: rect.top + rect.height / 2,  // Centro de la tarjeta en Y
    });
    
    setIsExpanded(true);
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <Card
        className={cn(
          "select-none relative cursor-pointer border border-muted bg-accent h-[100px] hover:shadow-md",
          isDragging && "opacity-50",
          disabled && "opacity-50 cursor-not-allowed",
          "transition-all duration-200 ease-in-out"
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-4">
          <CardTitle className="text-base line-clamp-4 pr-8">
            {ticket.content}
          </CardTitle>
        </CardHeader>
        {!disabled && (
          <div
            {...attributes}
            {...listeners}
            data-drag-handle
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing p-1 hover:bg-accent/80 rounded"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </Card>
      {isExpanded && (
        <BigTicketCard 
          ticket={ticket} 
          onClose={() => setIsExpanded(false)} 
          clickPosition={clickPosition}
        />
      )}
    </div>
  );
};
