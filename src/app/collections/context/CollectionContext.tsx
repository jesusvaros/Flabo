"use client";

import { CollectionProps, TicketWithPosition } from "@/types/collections";
import { createContext, useContext, useState, useCallback } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { SupabaseCollection, SupabaseTicket } from "../[id]/page";

interface CollectionContextType {
  collection: CollectionProps | null;
  refetchCollection: () => Promise<void>;
  refetchTicket: (ticketId: string) => Promise<TicketWithPosition | null>;
  updateTicketInCollection: (updatedTicket: TicketWithPosition) => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}

interface CollectionProviderProps {
  collection: CollectionProps | null;
  children: React.ReactNode;
}

export function CollectionProvider({
  collection: initialCollection,
  children,
}: CollectionProviderProps) {
  const [collection, setCollection] = useState<CollectionProps | null>(initialCollection);

  // Function to refetch the entire collection
  const refetchCollection = useCallback(async () => {
    if (!collection) return;
    
    const supabase = createClient();
    
    // Get the selected collection with tickets and their drawings
    const { data: selectedCollection } = (await supabase
      .from("collections")
      .select(`
        id,
        title,
        creator_id,
        tickets (
          id,
          content,
          created_at,
          creator_id,
          collections_tickets!collections_tickets_ticket_id_fkey (
            position_x,
            position_y,
            z_index,
            position
          ),
          ticket_drawings (
            data
          )
        )
      `)
      .eq("id", collection.id)
      .single())as { data: SupabaseCollection | null };
    
    if (selectedCollection) {
      // Get the tickets with their positions for this collection
      const { data: collectionTickets } = await supabase
        .from("collections_tickets")
        .select("ticket_id, position_x, position_y, z_index, position")
        .eq("collection_id", collection.id);
      
      // Create a map of ticket positions
      const ticketPositions = new Map(
        collectionTickets?.map((ct) => [ct.ticket_id, ct]) || []
      );
      
      // Transform the data to match CollectionProps
      const updatedCollection: CollectionProps = {
        id: selectedCollection.id,
        title: selectedCollection.title,
        creator_id: selectedCollection.creator_id,
        tickets: selectedCollection.tickets.map((ticket) => {
          const position = ticketPositions.get(ticket.id);
          return {
            id: ticket.id,
            content: ticket.content,
            created_at: ticket.created_at,
            creator_id: ticket.creator_id,
            position_x: position?.position_x ?? 0,
            position_y: position?.position_y ?? 0,
            z_index: position?.z_index ?? 0,
            position: position?.position ?? 0,
            drawing: ticket.ticket_drawings?.data ?? null,
          };
        }),
      };
      
      setCollection(updatedCollection);
    }
  }, [collection]);
  
  // Function to refetch a single ticket
  const refetchTicket = useCallback(async (ticketId: string): Promise<TicketWithPosition | null> => {
    if (!collection) return null;
    
    const supabase = createClient();
    
    // Get the ticket with its drawing
    const { data: ticket } = await supabase
      .from("tickets")
      .select(`
        id,
        content,
        created_at,
        creator_id,
        ticket_drawings (
          data
        )
      `)
      .eq("id", ticketId)
      .single() as { data: SupabaseTicket | null };
    
    if (!ticket) return null;
    
    // Get the position data for this ticket in this collection
    const { data: position } = await supabase
      .from("collections_tickets")
      .select("position_x, position_y, z_index, position")
      .eq("collection_id", collection.id)
      .eq("ticket_id", ticketId)
      .single();
    
    // Create the updated ticket
    const updatedTicket: TicketWithPosition = {
      id: ticket.id,
      content: ticket.content,
      created_at: ticket.created_at,
      creator_id: ticket.creator_id,
      position_x: position?.position_x ?? 0,
      position_y: position?.position_y ?? 0,
      z_index: position?.z_index ?? 0,
      position: position?.position ?? 0,
      drawing: ticket.ticket_drawings?.data ?? null,
    };
    
    // Update the ticket in the collection
    updateTicketInCollection(updatedTicket);
    
    return updatedTicket;
  }, [collection]);
  
  // Function to update a ticket in the collection
  const updateTicketInCollection = useCallback((updatedTicket: TicketWithPosition) => {
    if (!collection) return;
    
    setCollection(prevCollection => {
      if (!prevCollection || !prevCollection.tickets) return null;
      
      return {
        ...prevCollection,
        tickets: prevCollection.tickets.map(ticket => 
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        ),
      };
    });
  }, []);

  return (
    <CollectionContext.Provider value={{ 
      collection, 
      refetchCollection, 
      refetchTicket,
      updateTicketInCollection
    }}>
      {children}
    </CollectionContext.Provider>
  );
}
