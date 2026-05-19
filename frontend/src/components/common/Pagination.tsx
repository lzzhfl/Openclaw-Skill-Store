import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(0);
    if (currentPage > 2) {
      pages.push('...');
    }
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 3) {
      pages.push('...');
    }
    pages.push(totalPages - 1);
  }

  const baseBtnClass =
    'px-3 py-2 text-sm rounded-lg transition-colors duration-150';
  const activeClass = 'bg-primary-600 text-white';
  const inactiveClass = 'text-gray-600 hover:bg-gray-100';
  const disabledClass = 'text-gray-300 cursor-not-allowed';

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`${baseBtnClass} ${
          currentPage === 0 ? disabledClass : inactiveClass
        }`}
      >
        Previous
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`${baseBtnClass} ${
              currentPage === page ? activeClass : inactiveClass
            }`}
          >
            {(page as number) + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className={`${baseBtnClass} ${
          currentPage >= totalPages - 1 ? disabledClass : inactiveClass
        }`}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
