"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface Ticket {
  id: string;
  content: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tickets/${ticket.id}`);
  };

  return (
    <Card 
      onClick={handleClick} 
      className="hover:-translate-y-1 transition-transform duration-200 cursor-pointer w-[280px] m-2 select-none"
    >
      <CardHeader>
        <CardTitle className="text-base">{ticket.content}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">details</p>
      </CardContent>
    </Card>
  );
};
