import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './../index.css'
import './../App.css'

type PostWithUsername = {
  id: number;
  userId: number;
  username: string;
  content: string;
  likes: number;
  createdAt: string;
};

const PAGE_SIZE = 3;

const Posts = () => {
  const [posts, setPosts] = useState<PostWithUsername[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

const fetchPosts = async () => {
  setLoading(true);
  setError("");

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3001/posts?offset=${offset}&limit=${PAGE_SIZE}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Erreur serveur");

    const data: PostWithUsername[] = await res.json();

    // Filtrer les postes doublons
    setPosts(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const filtered = data.filter(p => !existingIds.has(p.id));
      setOffset(prev => prev + filtered.length);
      return [...prev, ...filtered];
    });

    if (data.length < PAGE_SIZE) {
      setHasMore(false);
    }
  } catch (err) {
    console.error(err);
    setError("Impossible de charger les postes");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h1>Postes</h1>

      {posts.map(post => (
        <div className="CardPost"
          key={post.id}
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <strong>{post.username}</strong>{" "}
          ({new Date(post.createdAt).toLocaleDateString()})
          <p>{post.content}</p>
        </div>
      ))}

      {loading && <p>Chargement...</p>}

      {hasMore && !loading && !error && (
        <button
          onClick={fetchPosts}
          style={{ padding: "0.5rem 1rem" }}
        >
          Charger plus
        </button>
      )}

      {!hasMore && <p>Plus de postes à afficher</p>}

      {!loading && !error && posts.length === 0 && (
        <p>Aucun poste à afficher</p>
      )}
    </div>
  );
};

export default Posts;
