import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// servir les fichiers statiques
app.use(express.static(path.join(__dirname, "../public")));

app.get("/posts", (req, res) => {
  res.json([
    {
      id: 1,
      userId: 1,
      content: "Mon premier post 👋",
      likes: 12,
      createdAt: "2026-02-01"
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
