import React, { useState, useEffect } from 'react';

export interface AvatarImageProps {
  src?: string;
  alt: string;
  fallbackText?: string;
  sizeClassName?: string;
  className?: string;
  imgClassName?: string;
  fallbackClassName?: string;
  textClassName?: string;
}

/**
 * Universal Avatar Image component that supports Base64 data URLs and standard URLs.
 * Automatically recovers from load errors by gracefully rendering an initial monogram,
 * preventing blank renders or visual crashes in AI Studio and VS Code preview environments.
 */
export const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  fallbackText = 'P',
  sizeClassName = 'w-10 h-10',
  className = '',
  imgClassName = '',
  fallbackClassName = '',
  textClassName = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state whenever the image source changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initial = (fallbackText || alt || 'P').trim().charAt(0).toUpperCase() || 'P';
  const hasValidSrc = Boolean(src && src.trim().length > 0 && !hasError);

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center select-none ${sizeClassName} ${className}`}
    >
      {hasValidSrc ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onLoad={() => setHasError(false)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover ${imgClassName}`}
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center ${fallbackClassName} ${textClassName}`}
        >
          {initial}
        </div>
      )}
    </div>
  );
};
