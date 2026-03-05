'use client';

import { useEffect, useRef, useState } from 'react';

interface YouTubeBackgroundProps {
  videoId: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export function YouTubeBackground({
  videoId,
  children,
  className = '',
  overlayClassName = 'bg-brown-900/70',
}: YouTubeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth loading
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Video Container */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            // Scale up to hide YouTube controls and fill the container
            width: '300%',
            height: '300%',
            top: '-100%',
            left: '-100%',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
            title="Background Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute w-full h-full"
            style={{
              border: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClassName}`} />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
