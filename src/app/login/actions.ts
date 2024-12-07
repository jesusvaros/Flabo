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

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect("/welcome?message=Could not authenticate user");
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

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: null,  // Disable email redirect
      data: {
        email_confirm: false
      }
    }
  });

  if (error) {
    return redirect("/login?message=Could not create user");
  }

  // Sign in immediately after signup
  const { error: signInError } = await supabase.auth.signInWithPassword(data);
  
  if (signInError) {
    return redirect("/login?message=Account created but could not sign in");
  }

  return revalidatePath("/", "layout"), redirect("/");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/welcome");
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
