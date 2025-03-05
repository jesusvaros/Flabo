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
import { useCollection } from "../context/CollectionContext";

interface AddTicketDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  onTicketsAdded?: () => void;
}

function DrawerWrapper({
  isOpen,
  onOpenChange,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="flex-none">
          <DrawerTitle>Add Tickets</DrawerTitle>
          <DrawerDescription>
            Select tickets to add to your collection.
          </DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export function AddTicketDrawer({
  isOpen,
  onOpenChange,
  collectionId,
  onTicketsAdded,
}: AddTicketDrawerProps) {
  const { collection } = useCollection();
  const { tickets, isLoading, error } = useAvailableTickets();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Get the IDs of tickets already in the collection

  const handleTicketToggle = (ticketId: string) => {
    if (disabledTickets.includes(ticketId)) return;

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
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const renderFooter = () => (
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
  );

  if (isLoading) {
    return (
      <DrawerWrapper isOpen={isOpen} onOpenChange={onOpenChange}>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        {renderFooter()}
      </DrawerWrapper>
    );
  }

  if (error) {
    return (
      <DrawerWrapper isOpen={isOpen} onOpenChange={onOpenChange}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-destructive">
            Failed to load tickets. Please try again.
          </p>
        </div>
        {renderFooter()}
      </DrawerWrapper>
    );
  }

  if (!tickets.length || collection === null) {
    return (
      <DrawerWrapper isOpen={isOpen} onOpenChange={onOpenChange}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No tickets available.</p>
        </div>
        {renderFooter()}
      </DrawerWrapper>
    );
  }

  const disabledTickets = collection?.tickets?.map((ticket) => ticket.id) || [];

  return (
    <DrawerWrapper isOpen={isOpen} onOpenChange={onOpenChange}>
      <div className="flex-1 px-4 overflow-y-auto">
        <FilterableTagList
          items={tickets}
          selectedItems={selectedTickets}
          onItemToggle={handleTicketToggle}
          disabledItems={disabledTickets}
          className="pb-4"
        />
      </div>
      {renderFooter()}
    </DrawerWrapper>
  );
}
