import { createClient } from "../../../../utils/supabase/server";
import { CollectionCard } from "../Cards/CollectionCard";
import { CreateCollectionCard } from "../Collections/CreateCollectionCard";
import { Grid } from "./CollectionsTab.styles";
import { SuspenseTab } from "./SuspenseTab";

export function CollectionTabSuspense() {
  return (
    <SuspenseTab label="Collections">
      <CollectionsTab />
    </SuspenseTab>
  );
}

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
      <Grid>
      <CreateCollectionCard />
        {collections?.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </Grid>
    </div>
  );
}
