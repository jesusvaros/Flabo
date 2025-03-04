import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
}

interface CollectionsSidebarProps {
  collections: Collection[];
  currentCollectionId?: string;
}

export const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
  collections,
  currentCollectionId,
}) => {
  return (
    <aside className="w-64 h-screen bg-background border-r border-border p-4 flex flex-col gap-4">
      <Link href="/" className="no-underline">
        <Button variant="outline" className="w-full">
          Back to Home
        </Button>
      </Link>
      
      <h2 className="text-lg font-semibold text-foreground">Collections</h2>
      
      <nav className="flex flex-col gap-2">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="no-underline"
          >
            <div
              className={cn(
                "px-4 py-2 rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                collection.id === currentCollectionId
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
            >
              {collection.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
