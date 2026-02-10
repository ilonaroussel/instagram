import { useEffect, useState } from "react";

type Post = {
  id: number;
  userId: number;
  content: string;
  likes: number;
  createdAt: string;
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => setError("Failed to load posts"));
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3001/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(setPosts)
    .catch(() => setError("Unauthorized"));
}, []);


  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <strong>User {post.userId}</strong>
            {" "}({new Date(post.createdAt).toLocaleDateString()})
            <br />
            {post.content} ❤️ {post.likes}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
