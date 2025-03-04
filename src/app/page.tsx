import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { Tabs } from "./components/TabContents/Tabs";
import { TicktetsTabSuspense } from "./tickets/components/TicketsTab";
import { LogoutButton } from "./components/auth/LogoutButton";
import { IngredientsTabSuspense } from "./ingredients/components/IngredientsTab";
import { CollectionTabSuspense } from "./collections/components/CollectionsTab";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex justify-between items-center p-4 border-b bg-background">
        <h1 className="text-2xl font-bold">Welcome to Flabo</h1>
        <div className="flex gap-4 items-center">
          <span>{user.email}</span>
          <LogoutButton />
        </div>
      </div>

      <div className="flex-1 p-4 overflow-auto w-full">
        <div className="h-full w-full">
          <Tabs>
            <CollectionTabSuspense />
            <TicktetsTabSuspense />
            <IngredientsTabSuspense />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
