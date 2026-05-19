import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { skillService } from '../../services/skillService'
import SecurityBadge from '../skill/SecurityBadge'
import type { SkillVO } from '../../types/skill'

export default function TopRanking() {
  const [skills, setSkills] = useState<SkillVO[]>([])

  useEffect(() => {
    skillService.getFeatured().then(res => setSkills(res.slice(0, 3))).catch(() => {})
  }, [])

  if (skills.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skills.map((skill, i) => (
          <Link
            key={skill.id}
            to={`/skills/${skill.slug}`}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <span className="text-3xl font-extrabold text-gray-300 w-8 text-center">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{skill.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{skill.shortDescription}</p>
            </div>
            <SecurityBadge level={skill.securityLevel} showLabel={false} />
          </Link>
        ))}
      </div>
    </section>
  )
}
