import React from 'react';

const TokenIcon = ({ icon, color, size = "sm" }) => {
  const sizeClasses = {
    sm: "h-8 w-8 sm:h-10 sm:w-10",
    md: "h-10 w-10 sm:h-12 sm:w-12",
    lg: "h-12 w-12 sm:h-16 sm:w-16"
  };

  const textSizes = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full ${color} flex items-center justify-center`}>
      <span className={`text-white font-bold ${textSizes[size]}`}>{icon}</span>
    </div>
  );
};

export default TokenIcon;