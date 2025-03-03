import { createClient } from "../../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { CollectionsView } from "../../components/Collections/CollectionsView";

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
  const { data: collectionDetails } = await supabase
    .from("collections")
    .select("id, title, tickets ( id, content)")
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
      selectedCollection={collectionDetails}
    />
  );
}
