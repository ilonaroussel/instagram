import { useState } from 'react'
import type { Post } from '../../backend/src/bdd/bdd'

interface PostFormProps {
  onPostCreated: (post: Post) => void
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!content.trim()) {
      setError("Le contenu ne peut pas être vide")
      return
    }
    if (content.trim().length < 3) {
      setError("Le contenu doit contenir au moins 3 caractères")
      return
    }
    if (content.length > 500) {
      setError("Le contenu ne peut pas dépasser 500 caractères")
      return
    }

    try {
      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId: 1 })
      })
      if (!res.ok) throw new Error('Erreur serveur')
      const newPost: Post = await res.json()
      onPostCreated(newPost)
      setContent("")
    } catch {
      setError("Erreur lors de la création du post")
    }
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit} className="FormPost">
        <h1>Créer un poste</h1>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez votre poste ..."
          style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '5px' }}
        />

        <div style={{ marginBottom: '10px', fontSize: '12px', color: '#999' }}>
          {content.length}/500
        </div>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

        <button
          type="submit"
          disabled={!content.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: content.trim() ? '#007bff' : 'black',
            color: 'white',
            border: 'none',
            cursor: content.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Publier
        </button>
      </form>
    </div>
  )
}