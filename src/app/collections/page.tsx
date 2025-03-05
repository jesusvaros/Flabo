import { createClient } from "../../../utils/supabase/server";
import { CollectionsView } from "./components/CollectionsView";
import { redirect } from "next/navigation";

export default async function CollectionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get all collections for the sidebar, filtered by user_id
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title, creator_id")
    .eq("creator_id", user.id);

  return (
    <div className="flex min-h-screen">
      <CollectionsView collections={collections || []} />
    </div>
  );
}
