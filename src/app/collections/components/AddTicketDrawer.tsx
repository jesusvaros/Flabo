"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { Loader2 } from "lucide-react";
import { FilterableTagList } from "@/components/ui/filterable-tag-list";
import { useState } from "react";
import { addTicketsToCollection } from "@/app/tickets/api/ticketsApi";

interface AddTicketDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  onTicketsAdded?: () => void;
}

export function AddTicketDrawer({
  isOpen,
  onOpenChange,
  collectionId,
  onTicketsAdded,
}: AddTicketDrawerProps) {
  const { tickets, isLoading, error } = useAvailableTickets();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleTicketToggle = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleAddTickets = async () => {
    try {
      setIsAdding(true);
      await addTicketsToCollection(collectionId, selectedTickets);

      onTicketsAdded?.();
      onOpenChange(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="flex-none">
          <DrawerTitle>Add Tickets</DrawerTitle>
          <DrawerDescription>
            Select tickets to add to your collection.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 px-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center">
              Failed to load tickets. Please try again.
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-muted-foreground text-center">
              No tickets available.
            </div>
          ) : (
            <FilterableTagList
              items={tickets}
              selectedItems={selectedTickets}
              onItemToggle={handleTicketToggle}
              className="pb-4"
            />
          )}
        </div>
        <DrawerFooter className="flex-none border-t bg-background">
          <div className="flex items-center justify-between gap-2">
            <Button
              disabled={isLoading || isAdding || selectedTickets.length === 0}
              onClick={handleAddTickets}
              className="flex-1"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add Selected (${selectedTickets.length})`
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
