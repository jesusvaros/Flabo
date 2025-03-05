"use client";

import { useState, useEffect } from "react";
import { getAllTickets } from "../api/ticketsApi";
import { Ticket } from "@/types/collections";


interface UseAvailableTicketsReturn {
  tickets: Ticket[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAvailableTickets(): UseAvailableTicketsReturn {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch tickets"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    isLoading,
    error,
    refetch: fetchTickets,
  };
}
