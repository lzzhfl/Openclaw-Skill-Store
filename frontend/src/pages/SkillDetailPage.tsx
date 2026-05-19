import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { skillService } from '../services/skillService'
import { reviewService } from '../services/reviewService'
import SecurityBadge from '../components/skill/SecurityBadge'
import Badge from '../components/common/Badge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import type { SkillDetailVO } from '../types/skill'
import type { ReviewVO } from '../types/review'

export default function SkillDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [skill, setSkill] = useState<SkillDetailVO | null>(null)
  const [reviews, setReviews] = useState<ReviewVO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)
    skillService.getSkillBySlug(slug)
      .then((skillData) => {
        setSkill(skillData)
        return reviewService.getReviews(skillData.id, 0, 10)
          .then((reviewsData) => setReviews(reviewsData.content))
          .catch(() => setReviews([]))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  const handleInstall = () => {
    setShowInstall(true)
    if (skill) skillService.recordInstall(skill.id).catch(() => {})
  }

  const handleCopy = () => {
    if (skill) {
      navigator.clipboard.writeText(skill.installCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error || !skill) return <EmptyState title="Skill not found" description={error || ''} icon="🔍" />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/skills" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Browse</Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl shrink-0">
            {skill.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{skill.name}</h1>
            <p className="text-gray-500 mt-1">{skill.shortDescription}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <SecurityBadge level={skill.securityLevel} showLabel />
              <Badge variant="platform">{skill.categoryName}</Badge>
              <span className="text-sm text-gray-500">v{skill.version} by {skill.author?.username}</span>
            </div>
          </div>
          <button
            onClick={handleInstall}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Install
          </button>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-4">
          <span>{skill.downloadsCount?.toLocaleString() ?? 0} installs</span>
          <span>{skill.ratingAvg?.toFixed(1) ?? '0.0'} rating ({skill.ratingCount})</span>
          <span>Category: <Link to={`/skills?category=${skill.categorySlug}`} className="text-blue-600 hover:underline">{skill.categoryName}</Link></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 prose max-w-none">
            <h2>Description</h2>
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{skill.description}</ReactMarkdown>
            {skill.tutorial && (
              <>
                <h2>Usage Tutorial</h2>
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{skill.tutorial}</ReactMarkdown>
              </>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {skill.features && skill.features.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Feature Checklist</h3>
              <ul className="space-y-2">
                {skill.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="mt-1 shrink-0" />
                    <span>{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {skill.platforms?.map(p => (
                <Badge key={p} variant="platform">{p}</Badge>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {skill.tags?.map(t => (
                <Badge key={t} variant="tag">{t}</Badge>
              ))}
            </div>
          </div>
          {skill.securityDescription && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Security Report</h3>
              <p className="text-sm text-gray-600">{skill.securityDescription}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Reviews ({skill.ratingCount})</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{r.username}</span>
                  <span className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">{r.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showInstall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInstall(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Install {skill.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Copy and run this command in your terminal:</p>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 flex items-center justify-between">
              <code className="text-sm font-mono break-all">{skill.installCommand}</code>
              <button onClick={handleCopy} className="ml-3 shrink-0 px-3 py-1.5 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button
              onClick={() => setShowInstall(false)}
              className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
