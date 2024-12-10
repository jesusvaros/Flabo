"use client";
import styled from 'styled-components';
import { CollectionCard } from '../Cards/CollectionCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

interface CollectionsTabProps {
  collections: any[];
}

export const CollectionsTab: React.FC<CollectionsTabProps> = ({ collections }) => {
  return (
    <Grid>
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onClick={(collection) => console.log('Clicked collection:', collection)}
        />
      ))}
    </Grid>
  );
};
