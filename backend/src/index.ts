import express from "express";
import cors from "cors";
import { posts } from "./data/posts";
import type { Post } from "./bdd/bdd";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/posts", (req, res) => {
  const sortedPosts: Post[] = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sortedPosts);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
