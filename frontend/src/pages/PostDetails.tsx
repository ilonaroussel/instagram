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
    <div style={{ padding: "2rem" }}>
      <h2>Détail du post</h2>
      <strong>{post.username}</strong>
      <p>{post.content}</p>
      <p>Likes: {post.likes}</p>
      <p>{new Date(post.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default PostDetails;
