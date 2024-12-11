import Link from 'next/link';
import { Card, Description, Title } from './CollectionCard.styles';



interface Collection {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link href={`/collections/${collection.id}`} style={{ textDecoration: 'none' }}>
      <Card>
        <Title>{collection.title}</Title>
        <Description>{collection.description}</Description>
      </Card>
    </Link>
  );
};
