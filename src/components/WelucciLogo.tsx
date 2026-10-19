import React from 'react';

interface WelucciLogoProps {
  className?: string;
  iconOnly?: boolean;
  color?: string; // e.g. '#ffffff', '#480927', '#111111'
  size?: number; // size of the icon in pixels
  textClassName?: string;
  subtext?: string;
}

/**
 * Official Welucci Star Emblem & "weguest" wordmark
 * Replicates the authentic concave 4-point star inside a circle as seen on welucci.com
 */
export const WelucciLogo: React.FC<WelucciLogoProps> = ({
  className = '',
  iconOnly = false,
  color = 'currentColor',
  size = 32,
  textClassName = 'text-xl font-medium tracking-tight',
  subtext,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Authentic Welucci Sparkle Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Outer Circular Ring */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke={color}
          strokeWidth="6"
          fill="none"
        />
        {/* Four-pointed Concave Star */}
        <path
          d="M 50 14 Q 50 50 86 50 Q 50 50 50 86 Q 50 50 14 50 Q 50 50 50 14 Z"
          fill={color}
        />
      </svg>

      {/* Brand Typography */}
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-sans font-normal tracking-tight leading-none ${textClassName}`}
              style={{ color }}
            >
              WeGuest
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-70 px-1 py-0.2 rounded border border-current">
              by welucci
            </span>
          </div>
          {subtext && (
            <span className="text-[9px] uppercase tracking-widest text-stone-300 font-sans mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
