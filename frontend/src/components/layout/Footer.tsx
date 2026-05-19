import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-base font-bold text-gray-900">
                OpenClaw Skill Store
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Discover and share AI skills. Build better AI applications
              together.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/skills"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/submit-skill"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  Submit Skill
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-sm text-gray-500">
              OpenClaw Skill Store is an open platform for sharing and
              discovering AI-powered skills and tools.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} OpenClaw Skill Store. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
