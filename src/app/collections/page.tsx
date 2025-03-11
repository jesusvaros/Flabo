import { createClient } from "../../../utils/supabase/server";
import { CollectionsView } from "./components/CollectionsView";
import { redirect } from "next/navigation";
import { LogoutButton } from "../components/auth/LogoutButton";
import { Tabs } from "../components/TabContents/Tabs";
import { TicktetsTabSuspense } from "../tickets/components/TicketsTab";
import { IngredientsTabSuspense } from "../ingredients/components/IngredientsTab";
import { CollectionTabSuspense } from "./components/CollectionsTab";

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

  // Pre-render the tabs content on the server
  const tabsContent = (
    <Tabs>
      <CollectionTabSuspense />
      <TicktetsTabSuspense />
      <IngredientsTabSuspense />
    </Tabs>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center p-4 border-b bg-background">
        <h1 className="text-2xl font-bold">Welcome to Flabo</h1>
        <div className="flex gap-4 items-center">
          <span>{user.email}</span>
          <LogoutButton />
        </div>
      </div>
      <div className="flex-1">
        <CollectionsView 
          collections={collections || []} 
          tabsContent={tabsContent}
        />
      </div>
    </div>
  );
}
