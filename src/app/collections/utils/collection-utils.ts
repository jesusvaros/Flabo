import { CollectionProps, TicketWithPosition } from "@/types/collections";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseCollection, SupabaseTicket } from "../[id]/page";

/**
 * Fetches a collection with all its tickets and drawings
 */
export async function fetchCollectionWithTickets(
  supabase: SupabaseClient,
  collectionId: string
) {
  // Get the selected collection with tickets and their drawings
  const { data: selectedCollection } = (await supabase
    .from("collections")
    .select(
      `
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
      `
    )
    .eq("id", collectionId)
    .single()) as { data: SupabaseCollection | null };

  return selectedCollection;
}

/**
 * Fetches ticket positions for a collection
 */
export async function fetchTicketPositions(
  supabase: SupabaseClient,
  collectionId: string
) {
  // Get the tickets with their positions for this collection
  const { data: collectionTickets } = await supabase
    .from("collections_tickets")
    .select("ticket_id, position_x, position_y, z_index, position")
    .eq("collection_id", collectionId);

  // Create a map of ticket positions
  return new Map(collectionTickets?.map((ct) => [ct.ticket_id, ct]) || []);
}

/**
 * Transforms raw Supabase data into the CollectionProps format
 */
export function transformCollectionData(
  selectedCollection: SupabaseCollection | null,
  ticketPositions: Map<string, any>
): CollectionProps | null {
  if (!selectedCollection) return null;

  return {
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
}

/**
 * Fetches a single ticket with its drawing
 */
export async function fetchTicketWithDrawing(
  supabase: SupabaseClient,
  ticketId: string
) {
  // Get the ticket with its drawing
  const { data: ticket } = (await supabase
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
    .single()) as { data: SupabaseTicket | null };

  return ticket;
}

/**
 * Fetches position data for a ticket in a collection
 */
export async function fetchTicketPosition(
  supabase: SupabaseClient,
  collectionId: string,
  ticketId: string
) {
  // Get the position data for this ticket in this collection
  const { data: position } = await supabase
    .from("collections_tickets")
    .select("position_x, position_y, z_index, position")
    .eq("collection_id", collectionId)
    .eq("ticket_id", ticketId)
    .single();

  return position;
}

/**
 * Transforms raw ticket data into TicketWithPosition format
 */
export function transformTicketData(
  ticket: SupabaseTicket | null,
  position: any
): TicketWithPosition | null {
  if (!ticket) return null;

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
}
