import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700 disabled:hover:bg-amber-600',
    secondary: 'border-2 border-amber-600 text-amber-600 bg-transparent hover:bg-amber-600 hover:text-white disabled:hover:bg-transparent disabled:hover:text-amber-600',
    ghost: 'text-amber-600 bg-transparent hover:bg-amber-50 disabled:hover:bg-transparent'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}${className ? ` ${className}` : ''}`;
  
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
