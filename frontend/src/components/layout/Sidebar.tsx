import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categoryService, type CategoryVO } from '../../services/categoryService'

interface SidebarProps {
  selectedSlug?: string
  onSelect?: (slug: string) => void
}

export default function Sidebar({ selectedSlug, onSelect }: SidebarProps) {
  const [categories, setCategories] = useState<CategoryVO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    categoryService.getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  function renderCategory(cat: CategoryVO) {
    const isSelected = cat.slug === selectedSlug
    return (
      <li key={cat.id}>
        <Link
          to={`/skills?category=${cat.slug}`}
          onClick={() => onSelect?.(cat.slug)}
          className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
            isSelected
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {cat.name}
        </Link>
        {cat.children && cat.children.length > 0 && (
          <ul className="ml-3 mt-1 space-y-0.5">
            {cat.children.map(child => renderCategory(child))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <aside className="w-56 shrink-0">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 px-3">
        Categories
      </h3>
      <ul className="space-y-0.5">
        <li>
          <Link
            to="/skills"
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
              !selectedSlug ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Skills
          </Link>
        </li>
        {categories.map(cat => renderCategory(cat))}
      </ul>
    </aside>
  )
}
