export interface User {
  id: number
  username: string
  email: string
  password: string
}

export interface Post {
  id: number
  userId: number
  content: string
  likes: number []
  likedByCurrentUser: boolean
  createdAt: string
}

export interface Comment {
  id: number
  postId: number
  userId: number
  content: string
  createdAt: string
}
