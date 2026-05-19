import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { communityService } from '../services/communityService';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import type { PostVO } from '../types/post';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'tips', label: 'Tips' },
  { key: 'exchange', label: 'Exchange' },
  { key: 'help', label: 'Help' },
];

export default function CommunityPage() {
  const { type } = useParams<{ type?: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const activeType = type || 'all';

  useEffect(() => {
    setPage(0);
    setLoading(true);
    setError(null);
    communityService
      .getPosts(activeType === 'all' ? 'all' : activeType, 0, 10)
      .then((res) => {
        setPosts(res.content);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load posts');
      })
      .finally(() => setLoading(false));
  }, [activeType]);

  useEffect(() => {
    if (page === 0) return;
    setLoading(true);
    communityService
      .getPosts(activeType === 'all' ? 'all' : activeType, page, 10)
      .then((res) => {
        setPosts(res.content);
        setTotalPages(res.totalPages);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load posts');
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleTabChange = (key: string) => {
    navigate(key === 'all' ? '/community' : `/community/${key}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Community</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeType === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Post List */}
      {loading ? (
        <LoadingSpinner text="Loading posts..." />
      ) : error ? (
        <EmptyState title="Error" description={error} />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Be the first to start a discussion!"
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                  {post.postType}
                </span>
                {post.isPinned && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                    Pinned
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                {post.content}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{post.authorName}</span>
                <span>{post.viewCount} views</span>
                <span>{post.replyCount} replies</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
