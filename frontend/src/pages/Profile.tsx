import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  username: string;
  email: string;
};

type Post = {
  id: number;
  userId: number;
  username: string;
  content: string;
  likes: number;
  createdAt: string;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous n'êtes pas connecté");
      return;
    }

    fetch("http://localhost:3001/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUser)
      .catch(() => setError("Échec du chargement utilisateur"));

    fetch("http://localhost:3001/my-posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setPosts)
      .catch(() => setError("Échec du chargement des publications"));
  }, []);

  const handleDelete = async (postId: number) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur suppression");

      // Supprime du state → disparaît immédiatement de l'écran
      setPosts(prev => prev.filter(p => p.id !== postId));

    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le post");
    }
  };

  if (error) return <p>{error}</p>;
  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div className="container">
      <h2>Mon profil</h2>
      <h3>{user.username}</h3>
      <p>Email: {user.email}</p>

      <h3>Mes publications</h3>

      {posts.map(post => (
        <div
          className="CardPostProfil"
          key={post.id}
        >
          <div onClick={() => navigate(`/post/${post.id}`)} style={{ cursor: "pointer" }}>
            {post.content} ❤️ {post.likes} (
            {new Date(post.createdAt).toLocaleDateString()})
          </div>

          <button
            onClick={() => handleDelete(post.id)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer"
            }}
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
};

export default Profile;
