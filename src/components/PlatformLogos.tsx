import React from 'react';
import { PlatformType } from '../types';

interface PlatformLogoProps {
  platform: PlatformType;
  className?: string;
  size?: number;
}

/**
 * Official vector brand logos for Google Meet, Zoom, and Microsoft Teams.
 */
export const PlatformLogo: React.FC<PlatformLogoProps> = ({
  platform,
  className = '',
  size = 20,
}) => {
  if (platform === 'google_meet') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M29 20.5V14C29 12.3431 27.6569 11 26 11H8C6.34315 11 5 12.3431 5 14V34C5 35.6569 6.34315 37 8 37H26C27.6569 37 29 35.6569 29 34V27.5L39.8889 36.2111C41.2239 37.2791 43 36.3262 43 34.6222V13.3778C43 11.6738 41.2239 10.7209 39.8889 11.7889L29 20.5Z"
          fill="#00AC47"
        />
        <path
          d="M29 20.5V34C29 35.6569 27.6569 37 26 37H8C6.34315 37 5 35.6569 5 34V29L20 17L29 20.5Z"
          fill="#0066DA"
          fillOpacity="0.2"
        />
        <path
          d="M5 29V34C5 35.6569 6.34315 37 8 37H15L5 29Z"
          fill="#00832D"
        />
        <path
          d="M29 14V20.5L39.8889 11.7889C41.2239 10.7209 43 11.6738 43 13.3778V24L29 14Z"
          fill="#00AC47"
        />
        <path
          d="M43 24V34.6222C43 36.3262 41.2239 37.2791 39.8889 36.2111L29 27.5V34C29 35.6569 27.6569 37 26 37H23L43 24Z"
          fill="#2684FC"
        />
        <path
          d="M29 20.5L20 17L8 11H26C27.6569 11 29 12.3431 29 14V20.5Z"
          fill="#FFBA00"
        />
        <path
          d="M8 11C6.34315 11 5 12.3431 5 14V29L15 21L8 11Z"
          fill="#EA4335"
        />
        <path
          d="M5 14C5 12.3431 6.34315 11 8 11H12L5 20V14Z"
          fill="#C5221F"
        />
      </svg>
    );
  }

  if (platform === 'zoom') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="12" fill="#2D8CFF" />
        <path
          d="M10 20C10 16.6863 12.6863 14 16 14H24C27.3137 14 30 16.6863 30 20V28C30 31.3137 27.3137 34 24 34H16C12.6863 34 10 31.3137 10 28V20Z"
          fill="white"
        />
        <path
          d="M32 21.5L37.7082 17.2188C38.6536 16.5098 40 17.1837 40 18.3688V29.6312C40 30.8163 38.6536 31.4902 37.7082 30.7812L32 26.5V21.5Z"
          fill="white"
        />
      </svg>
    );
  }

  // Microsoft Teams
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="#4B53BC" />
      <path
        d="M29 16C29 14.3431 30.3431 13 32 13C33.6569 13 35 14.3431 35 16C35 17.6569 33.6569 19 32 19C30.3431 19 29 17.6569 29 16Z"
        fill="#7B83EB"
      />
      <path
        d="M30 21H34C36.2091 21 38 22.7909 38 25V30H28V23C28 21.8954 28.8954 21 30 21Z"
        fill="#7B83EB"
      />
      <circle cx="20" cy="15" r="4" fill="white" />
      <path
        d="M13 22H27C28.6569 22 30 23.3431 30 25V35H10V25C10 23.3431 11.3431 22 13 22Z"
        fill="#5B62D6"
      />
      <rect x="7" y="18" width="18" height="18" rx="4" fill="#4B53BC" />
      <path
        d="M12 23H20M16 23V31"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
