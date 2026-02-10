// backend/server.ts
import express from "express";
import cors from "cors";
import { posts } from "./data/posts";
import { users } from "./data/users";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET all posts with username
app.get("/posts", (req, res) => {
  const postsWithUsername = posts.map(post => {
    const user = users.find(u => u.id === post.userId);
    return {
      ...post,
      username: user ? user.username : "Unknown"
    };
  });

  res.json(postsWithUsername);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
