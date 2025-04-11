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
import { updateTicketContent, updateTicketUrl, updateTicketImages, getTicketState } from "@/app/tickets/utils/ticket-db-utils";

interface CollectionContextType {
  collection: CollectionProps | null;
  refetchCollection: () => Promise<void>;
  refetchTicket: (ticketId: string) => Promise<TicketWithPositionConversion | null>;
  updateTicketInCollection: (updatedTicket: TicketWithPositionConversion) => void;
  patchTicket: (ticketId: string, updates: Partial<TicketWithPositionConversion>) => Promise<TicketWithPositionConversion | null>;
  tickets: TicketWithPositionConversion[];
  updateTickets: (updatedTickets: TicketWithPositionConversion[]) => void;
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
  const [tickets, setTickets] = useState<TicketWithPositionConversion[]>([]);

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

    const selectedCollection = await fetchCollectionWithTickets(supabase, collection.id);
    const ticketPositions = await fetchTicketPositions(supabase, collection.id);
    const updatedCollection = transformCollectionData(selectedCollection, ticketPositions);

    if (updatedCollection) {
      const transformedTickets = transformTicketsWithConversions(updatedCollection.tickets);
      setCollection({ ...updatedCollection, tickets: transformedTickets });
    }
  }, [collection]);

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

  const updateTickets = useCallback((updatedTickets: TicketWithPositionConversion[]) => {
    const transformedTickets = transformTicketsWithConversions(updatedTickets);
    setTickets(transformedTickets);
    if (collection) {
      setCollection(prevCollection => {
        if (!prevCollection) return null;
        return {
          ...prevCollection,
          tickets: transformedTickets
        };
      });
    }
  }, [collection]);

  // Function to refetch a single ticket
  const refetchTicket = useCallback(async (ticketId: string): Promise<TicketWithPositionConversion | null> => {
    const supabase = createClient();

    // Use utility functions to fetch and transform ticket data
    const ticket = await fetchTicketWithDrawing(supabase, ticketId);

    // If we're in a collection view, fetch the position data
    let position = null;
    if (collection) {
      position = await fetchTicketPosition(supabase, collection.id, ticketId);
    }

    const updatedTicket = transformTicketData(ticket, position);

    // Sort the conversions by created_at in descending order
    if (updatedTicket && updatedTicket.recipe_conversions) {
      updatedTicket.recipe_conversions.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    // Update the ticket in the collection if we're in a collection view
    if (collection && updatedTicket) {
      updateTicketInCollection(updatedTicket);
    }

    // Update the global tickets state with the updated ticket
    if (updatedTicket) {
      // Create a new array with the updated ticket
      const updatedTickets = tickets.map(t =>
        t.id === updatedTicket.id ? updatedTicket : t
      );

      // If the ticket doesn't exist in the current tickets array, add it
      if (!updatedTickets.some(t => t.id === updatedTicket.id)) {
        updatedTickets.push(updatedTicket);
      }

      // Update the tickets state without replacing the collection tickets
      setTickets(updatedTickets);
    }

    return updatedTicket;
  }, [collection, tickets, updateTicketInCollection, updateTickets]);

  // Function to update a ticket in the database and then refetch it
  const patchTicket = useCallback(async (ticketId: string, updates: Partial<TicketWithPositionConversion>): Promise<TicketWithPositionConversion | null> => {
    if (!ticketId) return null;
    const supabase = createClient();

    try {
      // Get current ticket state
      const { data: currentTicket, error: stateError } = await getTicketState(supabase, ticketId);
      
      if (stateError || !currentTicket) {
        console.error("Error getting ticket state:", stateError);
        return null;
      }
      
      // Run operations in parallel
      const operations = [];
      
      // 1. Update main ticket content
      if (updates.content !== undefined || updates.text_content !== undefined) {
        operations.push(
          updateTicketContent(supabase, ticketId, updates.content, updates.text_content)
        );
      }
      
      // 2. Handle URL data
      if (updates.ticket_url !== undefined) {
        const hasUrl = currentTicket.ticket_urls !== null;
        operations.push(
          updateTicketUrl(supabase, ticketId, updates.ticket_url, hasUrl)
        );
      }
      
      // 3. Handle images
      if (updates.ticket_images !== undefined) {
        operations.push(
          updateTicketImages(supabase, ticketId, updates.ticket_images)
        );
      }
      
      // Execute all operations in parallel
      await Promise.all(operations);
      
      // Refetch the ticket to get the updated data
      return await refetchTicket(ticketId);
    } catch (error) {
      console.error("Error in patchTicket:", error);
      return null;
    }
  }, [refetchTicket]);

return (
  <CollectionContext.Provider value={{
    collection,
    refetchCollection,
    refetchTicket,
    updateTicketInCollection,
    patchTicket,
    tickets,
    updateTickets
  }}>
    {children}
  </CollectionContext.Provider>
);
}
