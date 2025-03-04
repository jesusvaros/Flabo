import { createClient } from "../../../../utils/supabase/server";
import { CollectionCard } from "../Cards/CollectionCard";
import { CreateCollectionCard } from "../Collections/CreateCollectionCard";
import { SuspenseTab } from "./SuspenseTab";

export const CollectionTabSuspense = () => {
  return (
    <SuspenseTab label="Collections" id="collections">
      <CollectionsTab />
    </SuspenseTab>
  );
};

async function CollectionsTab() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .eq("creator_id", user?.id);

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 p-5">
        <CreateCollectionCard />
        {collections?.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
