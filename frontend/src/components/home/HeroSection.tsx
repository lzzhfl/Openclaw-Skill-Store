import { useNavigate } from 'react-router-dom'
import SearchBar from '../search/SearchBar'

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Discover AI Skills
        </h1>
        <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
          Browse 5,000+ skills for Claude Code, Openclaw, and 20+ AI agent platforms.
          One-click install. Security verified.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar
            onSearch={q => navigate(`/search?q=${encodeURIComponent(q)}`)}
            placeholder="Search for skills — 'PDF processor', 'security audit'..."
          />
        </div>
        <div className="flex justify-center gap-8 mt-8 text-sm text-blue-200">
          <span>5000+ Skills</span>
          <span>20+ Platforms</span>
          <span>S~D Security Rating</span>
        </div>
      </div>
    </section>
  )
}
