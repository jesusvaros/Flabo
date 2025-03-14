"use client";

import { CollectionProps, TicketWithPositionConversion } from "@/types/collections";
import { createContext, useContext, useState, useCallback } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { 
  fetchCollectionWithTickets, 
  fetchTicketPositions, 
  transformCollectionData,
  fetchTicketWithDrawing,
  fetchTicketPosition,
  transformTicketData
} from "../utils/collection-utils";

interface CollectionContextType {
  collection: CollectionProps | null;
  refetchCollection: () => Promise<void>;
  refetchTicket: (ticketId: string) => Promise<TicketWithPositionConversion | null>;
  updateTicketInCollection: (updatedTicket: TicketWithPositionConversion) => void;
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

  // Function to transform tickets with recipe conversions
  const transformTicketsWithConversions = (tickets: TicketWithPositionConversion[] = []): TicketWithPositionConversion[] => {
    return tickets.map(ticket => {
      const ticketConversions = ticket.recipe_conversions || [];
      // Sort conversions by created_at in descending order (newest first)
      const sortedConversions = [...ticketConversions].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      return { ...ticket, recipe_conversions: sortedConversions };
    });
  };

  // Function to refetch the entire collection
  const refetchCollection = useCallback(async () => {
    if (!collection) return;
    
    const supabase = createClient();
    
    // Use utility functions to fetch and transform data
    const selectedCollection = await fetchCollectionWithTickets(supabase, collection.id);
    const ticketPositions = await fetchTicketPositions(supabase, collection.id);
    const updatedCollection = transformCollectionData(selectedCollection, ticketPositions);
    
    if (updatedCollection) {
      const transformedTickets = transformTicketsWithConversions(updatedCollection.tickets);
      setCollection({ ...updatedCollection, tickets: transformedTickets });
    }
  }, [collection]);
  
  // Function to refetch a single ticket
  const refetchTicket = useCallback(async (ticketId: string): Promise<TicketWithPositionConversion | null> => {
    if (!collection) return null;
    
    const supabase = createClient();
    
    // Use utility functions to fetch and transform ticket data
    const ticket = await fetchTicketWithDrawing(supabase, ticketId);
    const position = await fetchTicketPosition(supabase, collection.id, ticketId);
    const updatedTicket = transformTicketData(ticket, position);
    
    // Sort the conversions by created_at in descending order
    if (updatedTicket && updatedTicket.recipe_conversions) {
      updatedTicket.recipe_conversions.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }
    
    // Update the ticket in the collection
    if (updatedTicket) {
      updateTicketInCollection(updatedTicket);
    }
    
    return updatedTicket;
  }, [collection]);
  
  // Function to update a ticket in the collection
  const updateTicketInCollection = useCallback((updatedTicket: TicketWithPositionConversion) => {
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
