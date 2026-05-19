import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import TopRanking from '../components/home/TopRanking';
import SkillGrid from '../components/skill/SkillGrid';
import { useSkillStore } from '../store/skillStore';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { trending, loading, error, fetchTrending } = useSkillStore();

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return (
    <div>
      <HeroSection />
      <TopRanking />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Skills</h2>
          <Link
            to="/skills"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
        <SkillGrid skills={trending} loading={loading} error={error} />
      </section>
    </div>
  );
};

export default HomePage;
