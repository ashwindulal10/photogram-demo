import React, { useEffect, useState } from 'react';

export default function ConsumerView() {
  const [media, setMedia] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});
  const [newComment, setNewComment] = useState('');
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  async function loadMedia() {
    const res = await fetch('http://localhost:4000/media');
    const data = await res.json();
    setMedia(data.reverse());

    // Load ratings and comments for each media
    for (const m of data) {
      const cRes = await fetch(`http://localhost:4000/media/comment/${m.id}`);
      const rRes = await fetch(`http://localhost:4000/media/rate/${m.id}`);
      const cData = await cRes.json();
      const rData = await rRes.json();
      setComments((prev) => ({ ...prev, [m.id]: cData.map((c: any) => c.text) }));
      setRatings((prev) => ({ ...prev, [m.id]: rData.avg }));
    }
  }

  async function addComment(mediaId: string) {
    await fetch('http://localhost:4000/media/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaId, text: newComment }),
    });
    setNewComment('');
    loadMedia();
  }

  async function rate(mediaId: string, stars: number) {
    await fetch('http://localhost:4000/media/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Consumer View</h2>
      <input
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {filtered.map((m) => (
        <div key={m.id} style={{ marginBottom: 30 }}>
          <h4>{m.title}</h4>
          <img
            src={`http://localhost:4000/uploads/${m.filename}`}
            alt={m.caption}
            style={{ maxWidth: '100%' }}
          />
          <p>{m.caption}</p>

          {/* Ratings */}
          <div>
            <strong>Average Rating: </strong>
            {ratings[m.id] ? ratings[m.id].toFixed(1) : 'No rating yet'}
          </div>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => rate(m.id, star)}>
              ⭐{star}
            </button>
          ))}

          {/* Comments */}
          <div style={{ marginTop: 10 }}>
            <input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={() => addComment(m.id)}>Post</button>

            {comments[m.id]?.map((c, i) => (
              <p key={i} style={{ fontStyle: 'italic', marginLeft: 10 }}>
                💬 {c}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
