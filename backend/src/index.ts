// backend/server.ts
import express from "express";
import cors from "cors";
import { posts } from "./data/posts";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
