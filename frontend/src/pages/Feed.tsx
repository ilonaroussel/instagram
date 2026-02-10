import { useEffect, useState } from "react";

type PostWithUsername = {
  id: number;
  userId: number;
  username: string;
  content: string;
  likes: number;
  createdAt: string;
};


const Posts = () => {
const [posts, setPosts] = useState<PostWithUsername[]>([]);
const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => setError("Failed to load posts"));
  }, []);

  if (error) return <p>{error}</p>;

return (
  <ul>
    {posts.map(post => (
      <li key={post.id}>
        <strong>{post.username}</strong> ({new Date(post.createdAt).toLocaleDateString()})
        <br />
        {post.content}
      </li>
    ))}
  </ul>
);
};

export default Posts;
