import { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  className?: string;
}

const Badge = ({ variant = 'info', children, className = '' }: BadgeProps) => {
  // Variant classes
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-gold-100 text-gold-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
