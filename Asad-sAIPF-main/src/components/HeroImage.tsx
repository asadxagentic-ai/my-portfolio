import React from 'react';

interface HeroImageProps {
  originalSrc?: string;
  revealedSrc?: string;
  altText?: string;
  className?: string;
}

/**
 * HeroImage Component
 * Clean hero portrait presentation without mask overlay.
 */
export function HeroImage({
  originalSrc = '/portrait.png',
  altText = 'Asadullah Portrait',
  className = ''
}: HeroImageProps) {
  return (
    <div
      className={`hero-image-container relative w-full h-full select-none overflow-hidden pointer-events-auto ${className}`}
    >
      <picture>
        <source srcSet="/portrait.webp" type="image/webp" />
        <img
          src={originalSrc}
          alt={altText}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02] transition-all duration-500"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop";
          }}
          draggable="false"
        />
      </picture>
    </div>
  );
}

export default HeroImage;
