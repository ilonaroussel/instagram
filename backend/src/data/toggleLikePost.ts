import { posts } from "./posts";

export function toggleLikePost(postId: number, userId: number) {
  const post = posts.find(p => p.id === postId);
  if (!post) throw new Error("Post introuvable");

  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    post.likes.push(userId);
  }

  return {
    liked: !alreadyLiked,
    likesCount: post.likes.length,
  };
}
