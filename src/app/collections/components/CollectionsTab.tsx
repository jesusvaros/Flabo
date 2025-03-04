import { SuspenseTab } from "@/app/components/TabContents/SuspenseTab";
import { createClient } from "../../../../utils/supabase/server";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { CollectionCard } from "./CollectionCard";
import { CollectionProps } from "@/types/collections";

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
        {collections?.map((collection: CollectionProps) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
