import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import SkillGrid from '../components/skill/SkillGrid'
import Pagination from '../components/common/Pagination'
import { skillService } from '../services/skillService'
import type { SkillVO } from '../types/skill'

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [skills, setSkills] = useState<SkillVO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const categoryParam = searchParams.get('category') || ''
  const sortParam = searchParams.get('sort') || 'popular'

  useEffect(() => {
    setLoading(true)
    skillService.getSkills({ category: categoryParam || undefined, sort: sortParam, page, size: 12 })
      .then(res => {
        setSkills(res.content)
        setTotalPages(res.totalPages)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [categoryParam, sortParam, page])

  const handleCategorySelect = (slug: string) => {
    setSearchParams({ category: slug, sort: sortParam })
    setPage(0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <Sidebar selectedSlug={categoryParam} onSelect={handleCategorySelect} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryParam ? `Category: ${categoryParam}` : 'All Skills'}
            </h1>
            <select
              value={sortParam}
              onChange={e => setSearchParams({ category: categoryParam, sort: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <SkillGrid skills={skills} loading={loading} error={error} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}
