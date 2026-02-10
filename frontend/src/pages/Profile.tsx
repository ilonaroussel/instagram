import { useEffect, useState } from "react";

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
    <div>
      <h1>Mon profil</h1>
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>

      <h3>Mes posts</h3>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.content} ❤️ {post.likes}{" "}
            ({new Date(post.createdAt).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
