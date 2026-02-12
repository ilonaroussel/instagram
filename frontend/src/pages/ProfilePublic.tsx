import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Post = {
  id: number;
  userId: number;
  username: string;
  content: string;
  likes: number;
  createdAt: string;
};

type PublicUser = {
  id: number;
  username: string;
  posts: Post[];
};

const ProfilePublic = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<PublicUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Utilisateur introuvable");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return null;

  return (
    <div className="container">
      <h2>Profil de {user.username}</h2>

      <h3>Publications</h3>

      {user.posts.length === 0 && <p>Aucune publication</p>}

      {user.posts.map(post => (
        <div
          key={post.id}
          className="CardPost"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {post.content}
          <br />
          ({new Date(post.createdAt).toLocaleDateString()})
        </div>
      ))}
    </div>
  );
};

export default ProfilePublic;
