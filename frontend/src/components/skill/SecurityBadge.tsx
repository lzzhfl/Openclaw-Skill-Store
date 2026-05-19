import React from 'react';

interface SecurityBadgeProps {
  level: string;
  showLabel?: boolean;
}

const levelConfig: Record<string, { label: string; className: string }> = {
  S: { label: 'Verified', className: 'bg-purple-600 text-white' },
  A: { label: 'Safe', className: 'bg-green-600 text-white' },
  B: { label: 'Trusted', className: 'bg-blue-600 text-white' },
  C: { label: 'Caution', className: 'bg-yellow-600 text-white' },
  D: { label: 'Risky', className: 'bg-red-600 text-white' },
};

const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  level,
  showLabel = false,
}) => {
  const upper = level.toUpperCase();
  const config = levelConfig[upper] || {
    label: 'Unknown',
    className: 'bg-gray-500 text-white',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full ${config.className}`}
      title={`Security Level ${upper}: ${config.label}`}
    >
      <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] leading-none">
        {upper}
      </span>
      {showLabel && <span className="font-medium">{config.label}</span>}
    </span>
  );
};

export default SecurityBadge;
