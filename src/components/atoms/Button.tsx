import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  // Base classes
  const baseClasses = 'font-semibold uppercase rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-green-500 hover:bg-green-600 text-white-100 focus:ring-green-500',
    outline: 'border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white-100 focus:ring-green-500',
    text: 'text-green-500 hover:bg-green-100 focus:ring-green-500',
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
