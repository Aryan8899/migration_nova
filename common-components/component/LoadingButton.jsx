import React from 'react';

const LoadingButton = ({ isLoading, onClick, children, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className={`font-semibold py-2 px-3 sm:px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
        isLoading 
          ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
      } ${className}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;