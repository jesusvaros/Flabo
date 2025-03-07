import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { CollectionsView } from "../components/CollectionsView";
import { CollectionProps } from "@/types/collections";
import { CollectionProvider } from "../context/CollectionContext";
import { fetchCollectionWithTickets, fetchTicketPositions, transformCollectionData } from "../utils/collection-utils";

type Props = {
  params: Promise<{ id: string }>;
};

// Define the type for the raw Supabase response
export type SupabaseTicket = {
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
  ticket_drawings: {
    data: any;
  };
};

export type SupabaseCollection = {
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

  // Fetch collection data using utility functions
  const selectedCollection = await fetchCollectionWithTickets(supabase, collectionId);
  const ticketPositions = await fetchTicketPositions(supabase, collectionId);
  
  // Transform the data to match CollectionProps
  const transformedCollection = transformCollectionData(selectedCollection, ticketPositions);

  return (
    <CollectionProvider collection={transformedCollection}>
      <CollectionsView
        collections={collections || []}
        selectedCollection={transformedCollection}
      />
    </CollectionProvider>
  );
}
