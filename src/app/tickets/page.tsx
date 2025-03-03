import { redirect } from "next/navigation";

export default async function TicketsPage() {
  // This will just redirect to the home page with tickets tab selected
  redirect("/?tab=tickets");
}
