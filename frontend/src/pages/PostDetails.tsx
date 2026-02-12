import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { User } from "../../../backend/src/bdd/bdd";

type Post = {
  
  id: number;
  username: string;
  content: string;
  likes: number [];
  likedByCurrentUser: any;
  createdAt: string;
};

type Comment = {
  id: number;
  postId: number;
  userId: number;
  username?: string;
  content: string;
  createdAt: string;
};

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:3001/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => setUser(data))
    .catch(() => setUser(null));
}, []);


  // Load post + comments
  useEffect(() => {
    fetch(`http://localhost:3001/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur");
        return res.json();
      })
      .then(setPost)
      .catch(() => setError("Post introuvable"));

    fetch(`http://localhost:3001/posts/${id}/comments`)
      .then(res => res.json())
      .then(setComments)
      .catch(() => console.log("Erreur chargement commentaires"));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Utilisateur non connecté");
      return;
    }

    if (!content.trim()) {
      setError("Le contenu ne peut pas être vide");
      return;
    }

    if (content.length > 500) {
      setError("Le contenu ne peut pas dépasser 500 caractères");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3001/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );


      if (!res.ok) throw new Error("Erreur serveur");

      const newComment: Comment = await res.json();

      setComments(prev => [...prev, newComment]);
      setContent("");
      setSuccess("Commentaire créé avec succès");

    } catch {
      setError("Erreur lors de la création du commentaire");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:3001/posts/${post.id}/like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  setPost(prev =>
    prev ? { ...prev, likes: data.likesCount, likedByCurrentUser: data.liked, } : prev
  );
};


  if (error && !post) return <p>{error}</p>;
  if (!post) return <p>Chargement...</p>;

  return (
    <div className="container">
      <div className="DetailPost">
        <div>
          <h2>Détail de la publication</h2>
          <strong>{post.username}</strong>
          <p>{post.content}</p>
          <p>J'aimes: {post.likes}</p>
          <p>{new Date(post.createdAt).toLocaleString()}</p>

          <button onClick={handleLike}>
            {post.likedByCurrentUser ? "❤️" : "🤍"} {post.likes}
          </button>


          <form onSubmit={handleSubmit} className="FormComment">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre commentaire ..."
              style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '5px' }}
            />

            <div style={{ marginBottom: '10px', fontSize: '12px', color: '#999' }}>
              {content.length}/500
            </div>

            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

            <button
              type="submit"
              disabled={!content.trim() || loading}
              style={{
                padding: '10px 20px',
                backgroundColor: (!content.trim() || loading) ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (!content.trim() || loading) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? "Publication..." : "Poster"}
            </button>
          </form>

          {/* Comments display */}
          {comments.map(comment => (
            <div key={comment.id}>
              <strong>{comment.username || "Utilisateur"}</strong>
              <p>{comment.content}</p>
              <p>{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default PostDetails;
