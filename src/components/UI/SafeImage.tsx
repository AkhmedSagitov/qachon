"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

// Inline SVG placeholder as data URI
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='24' fill='%239ca3af'%3EРесторан%3C/text%3E%3C/svg%3E";

export default function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER_IMAGE);
  const [hasError, setHasError] = useState(false);

  // Update imgSrc when src prop changes
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
      unoptimized={imgSrc === PLACEHOLDER_IMAGE}
    />
  );
}
