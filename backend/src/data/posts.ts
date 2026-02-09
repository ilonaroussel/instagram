import type { Post } from "../bdd/bdd"

export const posts: Post[] = [
  {
    id: 1,
    userId: 1,
    content: "Mon premier post 👋",
    likes: 12,
    createdAt: "2026-02-01"
  },
  {
    id: 2,
    userId: 2,
    content: "Golden hour ✨",
    likes: 34,
    createdAt: "2026-02-02"
  }
]
