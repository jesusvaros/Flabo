'use server'
import { createClient } from "../../../utils/supabase/client";
import React from "react";
import AuthForm from "./authForm";

export default async function LoginPage() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  return <AuthForm session={user} />;
}
