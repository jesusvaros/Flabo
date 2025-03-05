import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { CollectionsView } from "../components/CollectionsView";
import { CollectionProps } from "@/types/collections";

type Props = {
  params: Promise<{ id: string }>;
};

// Define the type for the raw Supabase response
type SupabaseTicket = {
  id: string;
  content: string;
  created_at: string;
  creator_id: string;
  collections_tickets: {
    position_x: number;
    position_y: number;
    z_index: number;
    position: number;
  } | null;
};

type SupabaseCollection = {
  id: string;
  title: string;
  creator_id: string;
  tickets: SupabaseTicket[];
};

export default async function CollectionPage(props: Props) {
  const params = await props.params;
  const collectionId = params.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  // Get all collections for the sidebar
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title, creator_id")
    .eq("creator_id", user.id);

  // Get the selected collection with tickets
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
          )
        )
      `
    )
    .eq("id", collectionId)
    .single()) as { data: SupabaseCollection | null };

  // Get the tickets with their positions for this collection
  const { data: collectionTickets } = await supabase
    .from("collections_tickets")
    .select("ticket_id, position_x, position_y, z_index, position")
    .eq("collection_id", collectionId);

  // Create a map of ticket positions
  const ticketPositions = new Map(
    collectionTickets?.map(ct => [ct.ticket_id, ct]) || []
  );

  // Transform the data to match CollectionProps
  const transformedCollection: CollectionProps | null = selectedCollection
    ? {
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
          };
        }),
      }
    : null;

  return (
    <CollectionsView
      collections={collections || []}
      selectedCollection={transformedCollection}
    />
  );
}
