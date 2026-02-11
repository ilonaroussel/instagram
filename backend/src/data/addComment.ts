import type { Comment } from "../bdd/bdd";
import { comments } from "./comments";

export function addComment(
  postId: number,
  userId: number,
  content: string
): Comment {

  if (!content.trim()) {
    throw new Error("Le contenu ne peut pas être vide");
  }

  if (content.length > 500) {
    throw new Error("Le contenu ne peut pas dépasser 500 caractères");
  }

  const newComment: Comment = {
    id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
    postId,
    userId,
    content,
    createdAt: new Date().toISOString(),
  };

  comments.push(newComment);

  return newComment;
}
