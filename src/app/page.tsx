import { createClient } from "../../utils/supabase/server";
import { CollectionsView } from "./collections/components/CollectionsView";
import { redirect } from "next/navigation";
import { HeaderLoggedIn } from "./components/Header";
import { CollectionProvider } from "./collections/context/CollectionContext";
import { SupabaseTicket } from "./[id]/page";

export default async function CollectionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  // Get all collections for the sidebar, filtered by user_id
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title, creator_id")
    .eq("creator_id", user.id);

  // Get all tickets with their recipe conversions
  const { data: tickets } = await supabase
    .from("tickets")
    .select(`
      id,
      content,
      text_content,
      created_at,
      creator_id,
      ticket_drawings (
        data
      ),
      ticket_urls (
        id,
        ticket_id,
        url,
        metadata
      ),
      ticket_images (
        id,
        ticket_id,
        image_title,
        image_description,
        image_url,
        storage_path
      ),
      recipe_conversions (
        id,
        ticket_id,
        title,
        ingredients,
        instructions,
        notes,
        created_at,
        updated_at,
        created_by,
        custom_prompt
      )
    `)
    .eq("creator_id", user.id) as { data: SupabaseTicket[] | null };
  // Transform tickets to include recipe conversions
  const transformedTickets = tickets?.map(ticket => ({
    id: ticket.id,
    content: ticket.content,
    text_content: ticket.text_content || '',
    created_at: ticket.created_at,
    creator_id: ticket.creator_id,
    position_x: 0,
    position_y: 0,
    z_index: 0,
    position: 0,
    drawing: ticket.ticket_drawings?.data ?? null,
    ticket_url: ticket.ticket_urls ?? null,
    ticket_images: ticket.ticket_images ?? [],
    recipe_conversions: ticket.recipe_conversions || [],
  })) || [];


  return (
    <CollectionProvider collection={null}>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <CollectionsView 
            collections={collections || []} 
            tickets={transformedTickets}
            userEmail={user.email || ""}
          />
        </div>
      </div>
    </CollectionProvider>
  );
}
