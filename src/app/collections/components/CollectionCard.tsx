import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
    <Link href={`/collections/${collection.id}`} className="block no-underline">
      <Card className="hover:-translate-y-1 transition-transform duration-200 cursor-pointer w-[280px] m-2">
        <CardHeader>
          <CardTitle className="text-base">{collection.title}</CardTitle>
          <CardDescription>{collection.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
