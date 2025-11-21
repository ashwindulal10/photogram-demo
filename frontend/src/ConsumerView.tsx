import React, { useEffect, useState } from "react";

export default function ConsumerView() {
  const API_URL = "https://photogram-backend-aua5.onrender.com/api/media";

  const [media, setMedia] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});
  const [newComment, setNewComment] = useState("");
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  const token = localStorage.getItem("token");

  // Load all media + comments + ratings
  async function loadMedia() {
    const res = await fetch(`${API_URL}`);
    const data = await res.json();
    setMedia(data);

    for (const m of data) {
      const id = m._id;

      // Load comments
      const cRes = await fetch(`${API_URL}/${id}/comments`);
      const cData = await cRes.json();

      // Load rating
      const rRes = await fetch(`${API_URL}/${id}/rating`);
      const rData = await rRes.json();

      setComments((prev) => ({
        ...prev,
        [id]: cData.map((c: any) => c.text),
      }));

      setRatings((prev) => ({
        ...prev,
        [id]: rData.avg || 0,
      }));
    }
  }

  // Add comment
  async function addComment(mediaId: string) {
    if (!token) return alert("You must login first!");

    await fetch(`${API_URL}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mediaId, text: newComment }),
    });

    setNewComment("");
    loadMedia();
  }

  // Rate a media
  async function rate(mediaId: string, stars: number) {
    if (!token) return alert("You must login first!");

    await fetch(`${API_URL}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mediaId, stars }),
    });

    loadMedia();
  }

  useEffect(() => {
    loadMedia();
  }, []);

  const filtered = media.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Consumer View</h2>

      <input
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, marginBottom: 20 }}
      />

      {filtered.map((m) => {
        const id = m._id;

        return (
          <div key={id} style={{ marginBottom: 40 }}>
            <h3>{m.title}</h3>

            <img
              src={`https://photogram-backend-aua5.onrender.com/uploads/${m.filename}`}
              alt={m.caption}
              style={{ maxWidth: "100%", borderRadius: 6 }}
            />

            <p>{m.caption}</p>

            {/* Rating Section */}
            <div>
              <strong>Average Rating: </strong>
              {ratings[id] ? ratings[id].toFixed(1) : "No rating yet"}
            </div>

            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => rate(id, star)}
                style={{ marginRight: 5 }}
              >
                ⭐ {star}
              </button>
            ))}

            {/* Comments */}
            <div style={{ marginTop: 15 }}>
              <input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ padding: 6, marginRight: 5 }}
              />
              <button onClick={() => addComment(id)}>Post</button>

              {comments[id]?.map((c, i) => (
                <p key={i} style={{ marginLeft: 10, fontStyle: "italic" }}>
                  💬 {c}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
