import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { LogoutButton } from "./components/LogoutButton/LogoutButton";
import { Tabs, TabPanel } from "./components/Tabs/Tabs";
import { IngredientsTab } from "./components/TabContents/IngredientsTab";
import { CollectionsTab } from "./components/TabContents/CollectionsTab";
import { TicketsTab } from "./components/TabContents/TicketsTab";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  // Fetch data for each tab
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .eq("creator_id", user.id);

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("creator_id", user.id);

  const { data: ingredients } = await supabase
    .from("ingredients")
    .select("*")
    .eq("creator_id", user.id);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <h1>Welcome to Flabo</h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>{user.email}</span>
          <LogoutButton />
        </div>
      </div>

      <Tabs>
        <TabPanel label="Collections">
          <CollectionsTab collections={collections || []} />
        </TabPanel>
        <TabPanel label="Tickets">
          <TicketsTab tickets={tickets || []} />
        </TabPanel>
        <TabPanel label="Ingredients">
          <IngredientsTab ingredients={ingredients || []} />
        </TabPanel>
      </Tabs>
    </div>
  );
}
