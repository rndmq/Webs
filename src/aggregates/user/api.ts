import { supabase } from "../../lib/supabaseClient";
import Store from "../../store";

export async function login(email: string, password: string) {
  // show loading in redux
  Store.dispatch.user.startAuthorizing();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    // set login error state in redux
    Store.dispatch.user.setLoginError(error.message);
    Store.dispatch.user.stopAuthorizing();
    return;
  }

  // success → store user + authorized state
  Store.dispatch.user.setUser(data.user);
  Store.dispatch.user.setAuthorized(true);
  Store.dispatch.user.stopAuthorizing();
}
