"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  // Check if email is verified
  if (!authData?.user?.email_confirmed_at) {
    // Send verification email
    await supabase.auth.signInWithOtp({
      email: data.email,
    });
    return redirect("/auth/confirm?message=Please check your email to verify your account");
  }

  return revalidatePath("/", "layout"), redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/auth/confirm");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}

export async function googleLogin() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    return error;
  }

  revalidatePath("/", "layout");
  redirect("/");
}
