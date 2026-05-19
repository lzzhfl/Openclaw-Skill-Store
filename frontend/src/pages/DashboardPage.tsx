import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState title="Login Required" description="Please login to view your dashboard" icon="🔒" />
        <div className="text-center mt-4">
          <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.username}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{user?.role}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{user?.bio || 'No bio yet.'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/submit-skill" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition text-center">
          <span className="text-3xl">📦</span>
          <h3 className="font-semibold mt-2">Submit a Skill</h3>
          <p className="text-sm text-gray-500">Share your skill with the community</p>
        </Link>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <span className="text-3xl">⭐</span>
          <h3 className="font-semibold mt-2">Favorites</h3>
          <p className="text-sm text-gray-500">Coming soon</p>
        </div>
      </div>
    </div>
  )
}
