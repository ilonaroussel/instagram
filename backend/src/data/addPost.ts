import type { Post } from "../bdd/bdd"
import { posts } from "./posts"

export function addPost(content: string, userId: number): Post {
  const newPost: Post = {
    id: posts.length + 1,
    userId: userId,
    content: content,
    likes: 0,
    //createdAt: new Date().toISOString()
    createdAt: new Date().toISOString().split('T')[0]  // "2026-02-10"
  }
  posts.push(newPost)
  return newPost
}
