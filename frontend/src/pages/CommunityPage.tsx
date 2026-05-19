import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { communityService } from '../services/communityService'
import Pagination from '../components/common/Pagination'
import LoadingSpinner from '../components/common/LoadingSpinner'
import type { PostVO } from '../types/post'

const TABS = ['All', 'Tips', 'Exchange', 'Help']

export default function CommunityPage() {
  const { type } = useParams<{ type?: string }>()
  const [posts, setPosts] = useState<PostVO[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const activeType = type || 'All'
  const apiType = activeType === 'All' ? '' : activeType
  const apiTypeUpper = apiType.toUpperCase()

  useEffect(() => {
    setLoading(true)
    communityService.getPosts(apiTypeUpper || undefined, page, 20)
      .then(res => {
        setPosts(res.content)
        setTotalPages(res.totalPages)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [apiTypeUpper, page])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Community</h1>

      <div className="flex gap-2 mb-6">
        {TABS.map(tab => {
          const isActive = tab === activeType
          const to = tab === 'All' ? '/community' : `/community/${tab.toLowerCase()}`
          return (
            <Link
              key={tab}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </Link>
          )
        })}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">{post.postType}</span>
                {post.isPinned && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Pinned</span>}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{post.authorName}</span>
                <span>{post.viewCount} views</span>
                <span>{post.replyCount} replies</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">No posts yet.</div>
          )}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
