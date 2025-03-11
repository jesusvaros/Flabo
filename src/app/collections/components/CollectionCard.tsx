import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CollectionProps } from '@/types/collections';

interface CollectionCardProps {
  collection: CollectionProps;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <Link href={`/${collection.id}`} className="block no-underline">
      <Card className="hover:-translate-y-1 transition-transform duration-200 cursor-pointer w-full m-2">
        <CardHeader>
          <CardTitle className="text-base">{collection.title}</CardTitle>
          <CardDescription>{collection.title}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};
