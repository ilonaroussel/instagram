import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { posts } from "./data/posts";
import { users } from "./data/users";
import { addPost } from "./data/addPost"
import { loginUser } from "./services/auth";
import { registerUser } from "./services/auth";
import { auth } from "./middleware/auth";
import { addComment } from "./data/addComment";
import { comments } from "./data/comments";
import { toggleLikePost } from "./data/toggleLikePost";




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

// Public profile
app.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userPosts = posts
    .filter(post => post.userId === userId)
    .map(post => ({
      ...post,
      username: user.username
    }));

  res.json({
    id: user.id,
    username: user.username,
    posts: userPosts
  });
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

app.delete("/posts/:id", auth, (req, res) => {
  const userId = (req as any).user.id;
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post introuvable" });
  }

  if (posts[postIndex].userId !== userId) {
    return res.status(403).json({ message: "Non autorisé" });
  }

  posts.splice(postIndex, 1);

  res.json({ message: "Post supprimé" });
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

// app.post("/posts", (req, res) => {
//   try {
//     const post = addPost(req.body.content, req.body.userId)
//     res.status(201).json(post)
//   } catch (error) {
//     res.status(400).json({ message: (error as Error).message })
//   }
// })

app.get("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find(p => p.id === id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // optional token read
  const authHeader = req.headers.authorization;
  let userId: number | null = null;

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch {
      userId = null;
    }
  }

  const user = users.find(u => u.id === post.userId);

  res.json({
    ...post,
    username: user?.username || "Unknown",
    likes: post.likes.length,
    likedByCurrentUser: userId
      ? post.likes.includes(userId)
      : false
  const user = users.find(u => u.id === post.userId);

  res.json({
    id: post.id,
    userId: post.userId,
    content: post.content,
    likes: post.likes,
    createdAt: post.createdAt,
    username: user?.username || "user"
  });
});


// Get comments for a post
app.get("/posts/:id/comments", (req, res) => {
  const postId = Number(req.params.id);

  const postComments = comments
    .filter(c => c.postId === postId)
    .map(comment => {
      const user = users.find(u => u.id === comment.userId);
      return { ...comment, username: user?.username || "Utilisateur" };
    });

  res.json(postComments);
});

// Create a new comment
app.post("/posts/:id/comments", auth, (req, res) => {
  const postId = Number(req.params.id);
  const userId = (req as any).user.id;
  const { content } = req.body;

  try {
    const newComment = addComment(postId, userId, content);
    const user = users.find(u => u.id === userId);

    console.log("✅ Comments array after new comment:", comments);

    res.status(201).json({ ...newComment, username: user?.username || "Utilisateur" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/posts/:id/like", auth, (req, res) => {
  const postId = Number(req.params.id);
  const userId = (req as any).user.id;

  const post = posts.find(p => p.id === postId);
  if (!post) return res.sendStatus(404);

  const liked = post.likes.includes(userId);

  if (liked) {
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    post.likes.push(userId);
  }

  res.json({
    liked: !liked,
    likesCount: post.likes.length
  });
});


