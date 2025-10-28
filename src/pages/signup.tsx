import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value;
    const nickname = e.target.nickname.value;
    const secret_code = e.target.secret_code.value;

    // 1) Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      setErrorMsg(authError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user.id; // ← id ini yang masuk ke profiles

    // 2) Insert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          username,
          nickname,
          secret_code
        }
      ]);

    setLoading(false);

    if (profileError) {
      setErrorMsg(profileError.message);
      return;
    }

    alert("Account created! Check your email to verify.");
    router.push("/");
  }

  return (
    <form onSubmit={handleSignup} style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Create Account</h2>

      <input name="email" type="email" placeholder="Email" required />
      <br />
      <input name="password" type="password" placeholder="Password" required />
      <br />
      <input name="username" type="text" placeholder="Username" required />
      <br />
      <input name="nickname" type="text" placeholder="Nickname" required />
      <br />
      <input name="secret_code" type="text" placeholder="Secret Code" required />
      <br />

      <button disabled={loading}>
        {loading ? "Loading..." : "Sign Up"}
      </button>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </form>
  );
      }
