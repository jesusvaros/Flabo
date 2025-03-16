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
      created_at,
      creator_id,
      ticket_drawings (
        data
      ),
      ticket_drawings_generated (
        data
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
    created_at: ticket.created_at,
    creator_id: ticket.creator_id,
    position_x: 0,
    position_y: 0,
    z_index: 0,
    position: 0,
    drawing: ticket.ticket_drawings?.data ?? null,
    drawing_generated: ticket.ticket_drawings_generated?.data ?? null,
    recipe_conversions: ticket.recipe_conversions || [],
  })) || [];


  return (
    <CollectionProvider collection={null}>
      <div className="flex flex-col min-h-screen">
        <HeaderLoggedIn userEmail={user.email || ""} />
        <div className="flex-1">
          <CollectionsView 
            collections={collections || []} 
            tickets={transformedTickets}
          />
        </div>
      </div>
    </CollectionProvider>
  );
}
