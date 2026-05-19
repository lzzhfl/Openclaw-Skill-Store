import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import FilterPanel from '../components/search/FilterPanel';
import SkillGrid from '../components/skill/SkillGrid';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSearchStore } from '../store/searchStore';
import type { FilterValues } from '../components/search/FilterPanel';

const SearchResultPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, results, loading, error, totalPages, currentPage, totalElements, setQuery, setFilters, search } =
    useSearchStore();

  const urlQuery = searchParams.get('q') || '';
  const urlPage = Number(searchParams.get('page') || '0');

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
    }
    search(urlPage);
  }, [urlQuery, urlPage]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setSearchParams({ q, page: '0' });
    search(0);
  };

  const handleFilterChange = (filters: FilterValues) => {
    setFilters({
      securityLevels: filters.securityLevel,
      platforms: filters.platform,
      sort: filters.sortBy,
    });
    search(0);
  };

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
    search(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <SearchBar
          initialValue={urlQuery}
          onSearch={handleSearch}
          placeholder="Search skills by name, description, or tags..."
        />
      </div>

      <div className="flex gap-8">
        {/* Filter sidebar */}
        <aside className="w-56 shrink-0 hidden lg:block">
          <FilterPanel onFilterChange={handleFilterChange} />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingSpinner text="Searching..." />
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500">
                {totalElements > 0
                  ? `Found ${totalElements} result${totalElements !== 1 ? 's' : ''}${urlQuery ? ` for "${urlQuery}"` : ''}`
                  : urlQuery
                  ? `No results found for "${urlQuery}"`
                  : 'Enter a search term to find skills'}
              </div>
              <SkillGrid skills={results} loading={false} error={error} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;
