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

    // Fetch user info
    fetch("http://localhost:3001/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUser)
      .catch(() => setError("Échec du chargement des informations utilisateur"));

    // Fetch my posts
    fetch("http://localhost:3001/my-posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setPosts)
      .catch(() => setError("Échec du chargement des publications"));
  }, []);

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
          className="CardPost"
            key={post.id}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            {post.content} {post.likes}{" "}
            ({new Date(post.createdAt).toLocaleDateString()})
          </div>
        ))}
    </div>
  );
};

export default Profile;
