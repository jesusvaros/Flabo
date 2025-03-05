"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Ticket } from "@/types/collections";

export const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tickets/${ticket.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="hover:-translate-y-1 transition-transform duration-200 cursor-pointer w-full m-2 select-none"
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
