import React from "react";
import Link from "next/link";
import {
  SidebarContainer,
  SidebarTitle,
  CollectionsList,
  CollectionItem,
  HomeButton,
} from "./CollectionsSidebar.styled";

interface Collection {
  id: string;
  name: string;
}

interface CollectionsSidebarProps {
  collections: Collection[];
  currentCollectionId: string;
}

export const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
  collections,
  currentCollectionId,
}) => {
  return (
    <SidebarContainer>
      <Link href="/" style={{ textDecoration: "none" }}>
        <HomeButton>Back to Home</HomeButton>
      </Link>
      <SidebarTitle>Collections</SidebarTitle>
      <CollectionsList>
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            style={{ textDecoration: "none" }}
          >
            <CollectionItem $active={collection.id === currentCollectionId}>
              {collection.name}
            </CollectionItem>
          </Link>
        ))}
      </CollectionsList>
    </SidebarContainer>
  );
};
