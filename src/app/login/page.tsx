"use server";
import { createClient } from "../../../utils/supabase/client";
import AuthForm from "./authForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { message?: string }
}) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  const message = searchParams?.message;

  return <AuthForm session={user} message={message}/>;
}
