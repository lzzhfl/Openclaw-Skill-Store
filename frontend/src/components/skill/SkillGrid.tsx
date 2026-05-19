import SkillCard from './SkillCard'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../common/EmptyState'
import type { SkillVO } from '../../types/skill'

interface SkillGridProps {
  skills: SkillVO[]
  loading?: boolean
  error?: string | null
}

export default function SkillGrid({ skills, loading, error }: SkillGridProps) {
  if (loading) return <LoadingSpinner />
  if (error) return <EmptyState title="Error" description={error} icon="⚠️" />
  if (skills.length === 0) return <EmptyState title="No skills found" description="Try adjusting your search or filters" />

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map(skill => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}
