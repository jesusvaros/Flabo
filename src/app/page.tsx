import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { LogoutButton } from "./components/LogoutButton/LogoutButton";
import { Tabs, TabPanel } from "./components/Tabs/Tabs";
import { CollectionTabSuspense } from "./components/TabContents/CollectionsTab";
import {
  TicketsTab,
  TicktetsTabSuspense,
} from "./components/TabContents/TicketsTab";
import {
  IngredientsTab,
  IngredientsTabSuspense,
} from "./components/TabContents/IngredientsTab";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

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
        <CollectionTabSuspense />
        <TicktetsTabSuspense />
        <IngredientsTabSuspense />
      </Tabs>
    </div>
  );
}
