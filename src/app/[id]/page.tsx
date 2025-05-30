import { createClient } from "../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { CollectionsView } from "../collections/components/CollectionsView";
import { CollectionProvider } from "../collections/context/CollectionContext";
import { fetchCollectionWithTickets, fetchTicketPositions, transformCollectionData } from "../collections/utils/collection-utils";
import { IngredientsTabSuspense } from "@/app/ingredients/components/IngredientsTab";
import { HeaderLoggedIn } from "@/app/components/Header";

type Props = {
  params: Promise<{ id: string }>;
};

// Define the type for the raw Supabase response
export type SupabaseTicket = {
  id: string;
  content: string;
  text_content?: string;
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
  ticket_urls?: {
    id: string;
    ticket_id: string;
    url: string;
    metadata?: string;
  };
  ticket_images?: {
    id: string;
    ticket_id: string;
    image_description?: string;
    image_title?: string;
    image_url?: string;
    storage_path?: string;
  }[];
  recipe_conversions: {
    id: string;
    ticket_id: string;
    title: string;
    ingredients: string[];
    instructions: string[];
    notes: string[];
    created_at: string;
    updated_at: string;
    created_by: string;
    custom_prompt: string;
  }[];
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
    return redirect("/welcome");
  }

  // Get all collections for the sidebar
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title, creator_id")
    .eq("creator_id", user.id);

  // Get all ingredients for the user
  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("creator_id", user.id);

  const selectedCollection = await fetchCollectionWithTickets(supabase, collectionId);
  const ticketPositions = await fetchTicketPositions(supabase, collectionId);

  const transformedCollection = transformCollectionData(selectedCollection, ticketPositions);

  const tabsContent = (
    <IngredientsTabSuspense ingredients={ingredients || []} />
  );

  return (
    <CollectionProvider collection={transformedCollection}>
      <div className="flex-1">
        <CollectionsView
          collections={collections || []}
          selectedCollection={transformedCollection}
          tabsContent={tabsContent}
          userEmail={user.email || ""}
        />
      </div>
    </CollectionProvider>
  );
}
