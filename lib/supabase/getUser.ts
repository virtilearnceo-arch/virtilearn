// lib/supabase/getUser.ts
"use server";

import { createClient } from "./server";

export async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();
  return user;
}
