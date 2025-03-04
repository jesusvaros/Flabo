import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { CollectionsView } from "../components/CollectionsView";
import { Collection } from "@/types/collections";

type Props = {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage(props: Props) {
  const params = await props.params;
  const collectionId = params.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Get all collections for the sidebar
  const { data: collections } = await supabase
    .from("collections")
    .select("id, title")
    .eq("creator_id", user.id);

  // Get the selected collection details
  const { data: selectedCollection } = await supabase
    .from("collections")
    .select("id, title, creator_id, tickets (id, content)")
    .eq("id", collectionId)
    .eq("creator_id", user.id)
    .single();

  return (
    <CollectionsView
      collections={
        collections?.map((col) => ({
          id: col.id,
          name: col.title,
        })) || []
      }
      selectedCollection={selectedCollection}
    />
  );
}
