"use client";

import { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Ticket } from "@/types/collections";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "../../../../../utils/supabase/client";

interface DraggableTicketProps {
  ticket: Ticket;
}

const DraggableTicket = ({ ticket }: DraggableTicketProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: ticket.id,
    data: ticket,
  });

  if (isDragging) return null;

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="p-2">
      <Card className="w-[300px] h-[100px] cursor-move hover:bg-accent">
        <CardHeader>
          <CardTitle className="text-sm">{ticket.content}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

interface TicketsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
}

export const TicketsDrawer = ({
  open,
  onOpenChange,
  collectionId,
}: TicketsDrawerProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get tickets that are not already in the collection
      const { data: existingTickets } = await supabase
        .from("collections_tickets")
        .select("ticket_id")
        .eq("collection_id", collectionId);

      const existingTicketIds = existingTickets?.map((t) => t.ticket_id) || [];

      const { data } = await supabase
        .from("tickets")
        .select("*")
        .eq("creator_id", user.id)
        .not("id", "in", `(${existingTicketIds.join(",")})`)
        .order("created_at", { ascending: false });

      setTickets(data || []);
    };

    if (open) {
      fetchTickets();
    }
  }, [open, collectionId]);

  const filteredTickets = tickets.filter((ticket) =>
    ticket.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="pb-0">
          <DrawerTitle>Available Tickets</DrawerTitle>
          <DrawerDescription>
            Drag and drop tickets to add them to your collection
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4 pt-2 overflow-hidden">
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <ScrollArea className="h-[calc(100%-60px)] w-full">
            <div className="pr-4 flex flex-wrap justify-center">
              {filteredTickets.map((ticket) => (
                <DraggableTicket key={ticket.id} ticket={ticket} />
              ))}
              {filteredTickets.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No tickets found
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <button className="text-sm text-muted-foreground">Close</button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
