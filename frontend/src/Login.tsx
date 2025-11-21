import React, { useState } from "react";

export default function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("https://photogram-backend-aua5.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        onLoggedIn();
      } else {
        const data = await res.json();
        alert("Login failed: " + data.error);
      }
    } catch (error) {
      alert("Server error");
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button type="submit">Login</button>
    </form>
  );
}
