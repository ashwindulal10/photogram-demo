import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import CreatorView from "./CreatorView";
import ConsumerView from "./ConsumerView";

export default function App() {
  const [page, setPage] = useState<"login" | "signup" | "creator" | "consumer">("login");
  const [loggedIn, setLoggedIn] = useState(false);

  // BEFORE LOGIN
  if (!loggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h1>PhotoGram 📸</h1>

        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setPage("login")} style={{ marginRight: 10 }}>
            Login
          </button>

          <button onClick={() => setPage("signup")}>Signup</button>
        </div>

        {page === "login" ? (
          <Login onLoggedIn={() => setLoggedIn(true)} />
        ) : (
          <Signup />
        )}
      </div>
    );
  }

  // AFTER LOGIN
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>PhotoGram 📸</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("creator")} style={{ marginRight: 10 }}>
          Creator View
        </button>

        <button onClick={() => setPage("consumer")}>Consumer View</button>
      </div>

      {page === "creator" ? <CreatorView /> : <ConsumerView />}
    </div>
  );
}
