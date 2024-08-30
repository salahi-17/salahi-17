import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 border-4',
    medium: 'w-12 h-12 border-6',
    large: 'w-16 h-16 border-8'
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <div 
        className={`
          ${sizeClasses[size]}
          border-t-primary
          border-primary/30
          rounded-full
          animate-spin
        `}
      ></div>
    </div>
  );
};

export default Loader;