import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { skillService } from '../services/skillService'
import { categoryService } from '../services/categoryService'
import { useAuthStore } from '../../store/authStore'
import type { CategoryVO } from '../../types/skill'

export default function SubmitSkillPage() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<CategoryVO[]>([])
  const [name, setName] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [installCommand, setInstallCommand] = useState('')
  const [tags, setTags] = useState('')
  const [platforms, setPlatforms] = useState('')
  const [features, setFeatures] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(console.error)
  }, [])

  if (!isAuthenticated || user?.role !== 'AUTHOR') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">You need an Author role to submit skills.</p>
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await skillService.createSkill({
        name,
        shortDescription,
        description,
        categoryId: Number(categoryId),
        installCommand,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        platforms: platforms.split(',').map(p => p.trim()).filter(Boolean),
        features: features.split('\n').map(f => f.trim()).filter(Boolean),
        version: '1.0.0',
      })
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit skill')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit a Skill</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Short Description *</label>
          <input type="text" value={shortDescription} onChange={e => setShortDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Description (Markdown) *</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" required>
            <option value="">Select category...</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Install Command *</label>
          <input type="text" value={installCommand} onChange={e => setInstallCommand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" placeholder="curl -sSL https://... | bash" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="AI, Web, Data" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Platforms (comma-separated)</label>
          <input type="text" value={platforms} onChange={e => setPlatforms(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Claude Code, VS Code" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Features (one per line)</label>
          <textarea value={features} onChange={e => setFeatures(e.target.value)} rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Feature 1&#10;Feature 2" />
        </div>
        <button type="submit" disabled={submitting} className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
          {submitting ? 'Submitting...' : 'Submit Skill'}
        </button>
      </form>
    </div>
  )
}
