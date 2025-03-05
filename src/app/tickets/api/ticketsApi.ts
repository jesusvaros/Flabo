import { Ticket } from "@/types/collections";
import { createClient } from "../../../../utils/supabase/client";

const supabase = createClient();

export async function getAllTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function addTicketsToCollection(
  collectionId: string,
  ticketIds: string[]
): Promise<void> {
  const insertData = ticketIds.map((ticketId, index) => ({
    collection_id: collectionId,
    ticket_id: ticketId,
    position: index,
    position_x: 0,
    position_y: 0,
    z_index: 0,
  }));

  const { error } = await supabase
    .from("collections_tickets")
    .insert(insertData);

  if (error) {
    throw error;
  }
}
