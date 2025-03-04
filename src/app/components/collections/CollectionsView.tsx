"use client";

import { useParams } from "next/navigation";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { CreateCollectionCard } from "./CreateCollectionCard";

interface Collection {
  id: string;
  name: string;
}

interface CollectionsViewProps {
  collections: Collection[];
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
}) => {
  const params = useParams();
  const currentCollectionId = params?.collectionId as string;

  return (
    <>
      <CollectionsSidebar
        collections={collections}
        currentCollectionId={currentCollectionId}
      />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Collections</h1>
          <p className="text-muted-foreground">
            Create and manage your collections
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateCollectionCard />
        </div>
      </main>
    </>
  );
};
