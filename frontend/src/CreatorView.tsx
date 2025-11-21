import React, { useState, useEffect } from "react";

export default function CreatorView() {
  const API_URL = "https://photogram-backend-aua5.onrender.com/api/media";

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<any[]>([]);

  const token = localStorage.getItem("token");

  async function upload(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return alert("You must login first!");
    if (!file) return alert("Please select a file!");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("caption", caption);

    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message || "Upload failed");

    alert("Upload successful!");
    setFile(null);
    setTitle("");
    setCaption("");

    loadMedia();
  }

  async function loadMedia() {
    const res = await fetch(API_URL);
    const data = await res.json();
    setMedia(data);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Creator Upload</h2>

      <form onSubmit={upload}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <br />

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />

        <textarea
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <br />

        <button type="submit">Upload</button>
      </form>

      <hr />

      <h2>Your Uploaded Media</h2>

      {media.map((m) => (
        <div key={m._id} style={{ marginBottom: 30 }}>
          <h3>{m.title}</h3>

          <img
            src={`https://photogram-backend-aua5.onrender.com/uploads/${m.filename}`}
            alt={m.caption}
            style={{ maxWidth: "100%", borderRadius: 6 }}
          />

          <p>{m.caption}</p>
        </div>
      ))}
    </div>
  );
}
