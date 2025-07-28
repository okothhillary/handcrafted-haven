import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  const baseClasses = 'bg-white rounded-2xl shadow-lg overflow-hidden';
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow' : '';
  const combinedClasses = `${baseClasses} ${hoverClasses} ${className}`;
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}
