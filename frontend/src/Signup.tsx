import React, { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("consumer");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("https://photogram-backend-aua5.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (res.ok) {
        alert("Signup successful! Now you can Login.");
      } else {
        const data = await res.json();
        alert("Signup failed: " + data.error);
      }
    } catch (error) {
      alert("Server error");
    }
  }

  return (
    <form onSubmit={handleSignup} style={{ marginTop: 20 }}>
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

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="creator">Creator</option>
        <option value="consumer">Consumer</option>
      </select>
      <br />

      <button type="submit">Signup</button>
    </form>
  );
}
