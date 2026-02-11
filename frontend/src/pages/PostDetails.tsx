import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  username: string;
  content: string;
  likes: number;
  createdAt: string;
};

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur");
        return res.json();
      })
      .then(setPost)
      .catch(() => setError("Post introuvable"));
  }, [id]);

  if (error) return <p>{error}</p>;
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
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
