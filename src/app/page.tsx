import { createClient } from "../../utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: tickets } = await supabase.from("tickets").select("*");

  return (
    <body>
      <div>holi</div>
      {JSON.stringify(tickets, null, 2)}
    </body>
  );
}
