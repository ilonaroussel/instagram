// backend/server.ts
import express from "express";
import cors from "cors";
import { posts } from "./data/posts";
import { addPost } from "./data/addPost"


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

app.post("/posts", (req, res) => {
  try {
    const post = addPost(req.body.content, req.body.userId)
    res.status(201).json(post)
  } catch (error) {
    res.status(400).json({ message: (error as Error).message })
  }
})