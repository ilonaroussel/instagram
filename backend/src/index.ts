// backend/server.ts
import express from "express";
import cors from "cors";
import { posts } from "./data/posts";
import { users } from "./data/users";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all post
app.get("/posts", (req, res) => {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 5;
  
  // Tri décroissant par date
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Pagination
  const paginatedPosts = sortedPosts.slice(offset, offset + limit);

  // Add username
  const postsWithUsername = paginatedPosts.map(post => {
    const user = users.find(u => u.id === post.userId);
    return { ...post, username: user ? user.username : "Unknown" };
  });

  res.json(postsWithUsername);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
