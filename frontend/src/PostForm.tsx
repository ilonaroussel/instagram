import { useEffect, useState } from 'react'
import type { Post, User } from '../../backend/src/bdd/bdd'

interface PostFormProps {
  onPostCreated: (post: Post) => void
}

export default function PostForm({ onPostCreated }: PostFormProps) {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Utilisateur non connecté");
      return;
    }

    fetch("http://localhost:3001/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUser)
      .catch(() => setError("Chargement de l'utilisateur échoué"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!user) {
      setError("Utilisateur non connecté")
      return
    }

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
      setLoading(true)  // démarre le loading

      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId: user.id }),
      })

      if (!res.ok) throw new Error('Erreur serveur')

      const newPost: Post = await res.json()

      onPostCreated(newPost)
      setContent("")
      setSuccess("Post créé avec succès")   // message succès
    } catch {
      setError("Erreur lors de la création du post")
    } finally {
      setLoading(false)   // stop loading
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
      {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

      <button
        type="submit"
        disabled={!content.trim() || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: (!content.trim() || loading) ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: (!content.trim() || loading) ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? "Publication..." : "Poster"}   {/* texte dynamique */}
      </button>
    </form>
  )
}
