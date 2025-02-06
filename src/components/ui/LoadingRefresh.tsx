import  { useState } from 'react';

const LoadingRefresh = () => {
  const [loading, setLoading] = useState(false);

  // Fungsi untuk men-trigger loading
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulasi refresh selesai
    }, 2000); // Waktu loading 2 detik
  };

  return (
    <button 
      onClick={handleRefresh}
      className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={`w-6 h-6 text-gray-600 ${loading ? 'animate-spin' : ''}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 11h2a5 5 0 1 0-5 5V13a3 3 0 0 1 3-3zM3 12a9 9 0 1 1 9 9 9.004 9.004 0 0 1-9-9z"
        />
      </svg>
    </button>
  );
};

export default LoadingRefresh;
