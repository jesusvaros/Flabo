"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketWithPosition, TicketWithPositionConversion } from "@/types/collections";
import { CSSProperties, useState, useEffect, useCallback } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { BigTicketCard } from "@/app/tickets/components/BigTicketCard";
import { useCollection } from "@/app/collections/context/CollectionContext";
import { RecipeConversion } from "@/types/recipe-conversions";

interface SortableTicketCardProps {
  ticket: TicketWithPositionConversion;
  disabled?: boolean;
}

export const SortableTicketCard = ({
  ticket: initialTicket,
  disabled = false,
}: SortableTicketCardProps) => {
  // Use the collection context to get the latest ticket data
  const { collection } = useCollection();
  const recipe_conversions = collection?.recipe_conversions || [];
  
  // Keep a local state of the ticket that can be updated
  const [ticket, setTicket] = useState<TicketWithPositionConversion>(initialTicket);
  const [isExpanded, setIsExpanded] = useState(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number }>();
  
  // Update the ticket and its conversions when the collection changes
  useEffect(() => {
    if (collection && collection.tickets) {
      const updatedTicket = collection.tickets.find(t => t.id === initialTicket.id) as TicketWithPositionConversion;
      if (updatedTicket) {
        setTicket(updatedTicket);
      }
    }
  }, [collection, initialTicket.id, recipe_conversions]);
  
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
          <div className="space-y-2">
            <CardTitle className="text-base line-clamp-2">
              {ticket.content}
            </CardTitle>
            {ticket.recipe_conversions && ticket.recipe_conversions.length > 0 && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ticket.recipe_conversions[0].title}
              </p>
            )}
          </div>
        </CardHeader>
        {!disabled && (
          <div
            {...attributes}
            {...listeners}
            data-drag-handle
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing p-2 hover:bg-accent/80 rounded touch-manipulation"
            style={{ touchAction: "none" }}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
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
