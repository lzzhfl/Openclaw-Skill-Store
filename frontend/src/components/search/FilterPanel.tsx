import { useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  securityLevel: string[];
  platform: string[];
  sortBy: string;
}

const SECURITY_LEVELS = ['S', 'A', 'B', 'C', 'D'];
const PLATFORMS = [
  'Claude Code',
  'Openclaw',
  'VS Code',
  'Cursor',
  'GitHub Actions',
  'Terminal',
];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [securityLevel, setSecurityLevel] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  const toggleSecurityLevel = (value: string) => {
    setSecurityLevel((prev) => {
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      onFilterChange({ securityLevel: next, platform, sortBy });
      return next;
    });
  };

  const togglePlatform = (value: string) => {
    setPlatform((prev) => {
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      onFilterChange({ securityLevel, platform: next, sortBy });
      return next;
    });
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    onFilterChange({ securityLevel, platform, sortBy: value });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Security Level
        </h4>
        <div className="flex flex-wrap gap-2">
          {SECURITY_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => toggleSecurityLevel(l)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                securityLevel.includes(l)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 text-gray-600 hover:border-primary-400'
              }`}
            >
              Level {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Platform
        </h4>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => togglePlatform(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                platform.includes(p)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 text-gray-600 hover:border-primary-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
          Sort By
        </h4>
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
