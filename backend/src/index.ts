import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { posts } from "./data/posts";
import { users } from "./data/users";
import { addPost } from "./data/addPost"
import { loginUser } from "./services/auth";
import { registerUser } from "./services/auth";
import { auth } from "./middleware/auth";



const app = express();
const PORT = 3001;
const JWT_SECRET = "secret";

app.use(cors());
app.use(express.json());


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    const user = loginUser(email, password);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ User logged in:");
    console.log("User ID:", user.id);
    console.log("JWT:", token);

    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
});

app.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  try {
    const newUser = registerUser(email, username, password);
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

    console.log("New user registered:", newUser);
    console.log("JWT:", token);

    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/me", auth, (req, res) => {
  const userId = (req as any).user.id;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ id: user.id, username: user.username, email: user.email });
});

app.get("/my-posts", auth, (req, res) => {
  const userId = (req as any).user.id;

  const myPosts = posts
    .filter(post => post.userId === userId)
    .map(post => ({
      ...post,
      username: users.find(u => u.id === post.userId)?.username || "Unknown",
    }));

  res.json(myPosts);
});

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

app.post("/posts", (req, res) => {
  try {
    const post = addPost(req.body.content, req.body.userId)
    res.status(201).json(post)
  } catch (error) {
    res.status(400).json({ message: (error as Error).message })
  }
})