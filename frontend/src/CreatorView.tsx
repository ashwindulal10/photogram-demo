import React, { useState, useEffect } from 'react';

export default function CreatorView()
 {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState<any[]>([]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      alert('Please choose a file first');
      return;
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('caption', caption);

    await fetch('http://localhost:4000/media/upload', {
      method: 'POST',
      body: fd,
    });

    setTitle('');
    setCaption('');
    setFile(null);
    loadMedia();
  }

  async function loadMedia() {
    const res = await fetch('http://localhost:4000/media');
    const data = await res.json();
    setMedia(data.reverse());
  }

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Creator Upload</h2>

      <form onSubmit={upload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
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
      <h2>Feed</h2>

      {media.map((m) => (
        <div key={m.id} style={{ marginBottom: 20 }}>
          <h4>{m.title}</h4>
          <img
            src={`http://localhost:4000/uploads/${m.filename}`}
            alt={m.caption}
            style={{ maxWidth: '100%' }}
          />
          <p>{m.caption}</p>
        </div>
      ))}
    </div>
  );
}
