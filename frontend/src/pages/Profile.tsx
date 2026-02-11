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
      setError("Not logged in");
      return;
    }

    // Fetch user info
    fetch("http://localhost:3001/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUser)
      .catch(() => setError("Failed to load user info"));

    // Fetch my posts
    fetch("http://localhost:3001/my-posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setPosts)
      .catch(() => setError("Failed to load posts"));
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="container">
      <h1>Mon profil</h1>
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>

      <h3>Mes postes</h3>
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
