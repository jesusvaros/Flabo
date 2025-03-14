import { createClient } from "../../utils/supabase/server";
import { CollectionsView } from "./collections/components/CollectionsView";
import { redirect } from "next/navigation";
import { Tabs } from "./components/TabContents/Tabs";
import { TicketsTabSuspense } from "./tickets/components/TicketsTab";
import { IngredientsTabSuspense } from "./ingredients/components/IngredientsTab";
import { HeaderLoggedIn } from "./components/Header";

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

  // Get all tickets for the user
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("creator_id", user.id);

  // Get all ingredients for the user
  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("creator_id", user.id);

  // Pre-render the tabs content on the server
  const tabsContent = (
    <Tabs defaultValue="collections">
      <TicketsTabSuspense tickets={tickets || []} />
      <IngredientsTabSuspense ingredients={ingredients || []} />
    </Tabs>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderLoggedIn userEmail={user.email || ""} />
      <div className="flex-1">
        <CollectionsView 
          collections={collections || []} 
          tabsContent={tabsContent}
        />
      </div>
    </div>
  );
}
