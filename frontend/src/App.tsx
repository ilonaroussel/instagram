import { useEffect, useState } from "react"
import './App.css'

type Post = {
  id: number;
  userId: number;
  content: string;
  likes: number;
  createdAt: string;
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5173/posts");
        if (!res.ok) throw new Error("Erreur serveur");

        const data: Post[] = await res.json();
        setPosts(data);
      }finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (posts.length === 0) return <p>Aucun post</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Posts</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <strong>User {post.userId}</strong>
          <p>{post.content}</p>
          <small>
            {new Date(post.createdAt).toLocaleDateString()} – ❤️ {post.likes}
          </small>
        </div>
      ))}
    </div>
  );
}

export default App;

