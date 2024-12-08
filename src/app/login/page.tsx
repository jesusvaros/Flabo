"use server";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import AuthForm from "./authForm";

export default async function LoginPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, redirect to home
  if (user) {
    redirect("/");
  } else {
    redirect("/welcome");
  }
}
