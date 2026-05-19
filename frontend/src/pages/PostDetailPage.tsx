import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { communityService } from '../services/communityService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import type { PostVO } from '../types/post'
import type { CommentVO } from '../types/post'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<PostVO | null>(null)
  const [comments, setComments] = useState<CommentVO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      communityService.getPost(Number(id)),
      communityService.getComments(Number(id)).catch(() => [])
    ])
      .then(([postData, commentsData]) => {
        setPost(postData)
        setComments(commentsData)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!post) return <div className="text-center py-16 text-gray-500">Post not found.</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/community" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Community</Link>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">{post.postType}</span>
        <h1 className="text-xl font-bold text-gray-900 mt-3 mb-2">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{post.authorName}</span>
          <span>{post.viewCount} views</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{post.content}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Comments ({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map(c => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CommentItem({ comment }: { comment: CommentVO }) {
  return (
    <div className="border-l-2 border-gray-200 pl-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-sm">{comment.username}</span>
        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
      <p className="text-sm text-gray-600">{comment.content}</p>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-4 space-y-3">
          {comment.replies.map(r => (
            <CommentItem key={r.id} comment={r} />
          ))}
        </div>
      )}
    </div>
  )
}
