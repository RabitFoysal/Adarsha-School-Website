"use client";

import { useState, useEffect } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
}

export default function SafeImage({
  src,
  fallbackSrc = "https://placehold.co/400x400/e2e8f0/1e293b?text=Image",
  alt = "",
  className = "",
  ...props
}: SafeImageProps) {
  const initialSrc = (src && typeof src === "string" && src.trim()) ? src.trim() : fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const validSrc = (src && typeof src === "string" && src.trim()) ? src.trim() : fallbackSrc;
    setImgSrc(validSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  return (
    <img
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
}
