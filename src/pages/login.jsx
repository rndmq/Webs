import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // username / email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Cek kalau input yang dimasukkin username → kita harus fetch email-nya dulu
    let email = identifier;

    if (!identifier.includes("@")) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", identifier)
        .single();

      if (error || !data) {
        setError("Username tidak ditemukan.");
        return;
      }

      // Ambil email dari auth.users
      const { data: userData } = await supabase.auth.admin.getUserById(data.id);
      email = userData.user.email;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) return setError("Email/Password salah.");

    navigate("/"); // after login redirect ke homepage
  };

  return (
    <div className="auth-card">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email atau Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Masuk</button>
      </form>
      <p>Belum punya akun? <Link to="/signup">Daftar</Link></p>
    </div>
  );
}
