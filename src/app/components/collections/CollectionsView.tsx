"use client";

import { useParams } from "next/navigation";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { CollectionViewProps } from "@/types/collections";

export const CollectionsView: React.FC<CollectionViewProps> = ({
  collections,
  selectedCollection,
}) => {
  if (!selectedCollection) {
    return (
      <div className="flex min-h-screen">
        <CollectionsSidebar collections={collections} />
        <main className="flex-1 p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Collections</h1>
            <p className="text-muted-foreground">Create and manage your collections</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateCollectionCard />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <CollectionsSidebar
        collections={collections}
        currentCollectionId={selectedCollection.id}
      />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{selectedCollection.title}</h1>
          <p className="text-muted-foreground">{selectedCollection.title}</p>
        </header>
        <div className="space-y-4">
          {selectedCollection.tickets?.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 rounded-lg border border-border hover:border-border/60 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground whitespace-pre-wrap">{ticket.content}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
