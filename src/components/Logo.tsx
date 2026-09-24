import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon */}
      <div
        className={`relative ${iconSizes[size]} shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 p-0.5 shadow-md shadow-indigo-600/25 flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-transparent to-white/20 pointer-events-none" />
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Intersecting Creative Nexus Symbol */}
          <path
            d="M12 20C12 15.5817 15.5817 12 20 12C23.1 12 25.78 13.76 27.08 16.32"
            stroke="url(#logo-grad-1)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M28 20C28 24.4183 24.4183 28 20 28C16.9 28 14.22 26.24 12.92 23.68"
            stroke="url(#logo-grad-2)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Central Hub Spark */}
          <circle cx="20" cy="20" r="3.5" fill="#38BDF8" />
          <path
            d="M20 7V10M20 30V33M7 20H10M30 20H33"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="logo-grad-1" x1="12" y1="12" x2="28" y2="16.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#67E8F9" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
            <linearGradient id="logo-grad-2" x1="28" y1="28" x2="12" y2="23.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818CF8" />
              <stop offset="1" stopColor="#67E8F9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-extrabold tracking-tight text-white flex items-center ${textSizes[size]}`}>
            <span>Creator</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 ml-0.5">
              Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 ml-1 shadow-sm shadow-cyan-400" />
          </div>
        </div>
      )}
    </div>
  );
};
