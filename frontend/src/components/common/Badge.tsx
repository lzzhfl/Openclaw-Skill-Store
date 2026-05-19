import React from 'react';

type BadgeVariant = 'securityLevel' | 'platform' | 'tag' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  value?: string;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  securityLevel: '',
  platform: 'bg-gray-100 text-gray-700 border border-gray-200',
  tag: 'bg-primary-50 text-primary-700 border border-primary-200',
  default: 'bg-gray-100 text-gray-700',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  value,
  className = '',
}) => {
  let classes = 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full';

  if (variant === 'securityLevel' && value) {
    const level = value.toUpperCase();
    const colorMap: Record<string, string> = {
      S: 'bg-purple-600 text-white',
      A: 'bg-green-600 text-white',
      B: 'bg-blue-600 text-white',
      C: 'bg-yellow-600 text-white',
      D: 'bg-red-600 text-white',
    };
    classes += ' ' + (colorMap[level] || 'bg-gray-500 text-white');
  } else {
    classes += ' ' + variantClasses[variant];
  }

  return <span className={`${classes} ${className}`}>{children}</span>;
};

export default Badge;
