import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Define the exact interface for a project item in the 3D gallery
export interface ProjectGalleryItem {
  title: string;
  outcome: string;      // one-sentence result, not a description
  tags: string[];       // tech stack, 2-4 items
  image: string;        // real project screenshot URL
  liveUrl?: string;
  codeUrl?: string;
}

// Define the props for the CircularGallery component
export interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: ProjectGalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 550, autoRotateSpeed = 0.03, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const internalRef = useRef<HTMLDivElement>(null);

    // Combine forwarded ref and internal ref
    const setRefs = (element: HTMLDivElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        let scrollProgress = 0;
        const el = internalRef.current;
        if (el && el.closest('section')) {
          const section = el.closest('section');
          if (section) {
            const rect = section.getBoundingClientRect();
            const sectionHeight = rect.height - window.innerHeight;
            if (sectionHeight > 50) {
              const scrolled = -rect.top;
              scrollProgress = Math.max(0, Math.min(1, scrolled / sectionHeight));
            } else {
              const totalTravel = window.innerHeight + rect.height;
              const scrolled = window.innerHeight - rect.top;
              scrollProgress = Math.max(0, Math.min(1, scrolled / totalTravel));
            }
          }
        } else {
          const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
          scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        }

        const scrollRotation = scrollProgress * 360;
        setRotation(scrollRotation);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) {
          setRotation((prev) => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={setRefs}
        role="region"
        aria-label="Circular 3D Projects Gallery"
        className={cn("relative w-full h-full flex items-center justify-center select-none", className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.2, 1 - (normalizedAngle / 180));
            const isFront = normalizedAngle < 70;

            return (
              <div
                key={`${item.title}-${i}`}
                role="group"
                aria-label={item.title}
                className="absolute w-[220px] sm:w-[245px] md:w-[270px] h-[280px] sm:h-[305px] md:h-[330px] transition-all duration-300"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%',
                  top: '50%',
                  opacity: opacity,
                  pointerEvents: isFront ? 'auto' : 'none',
                }}
              >
                <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden group border border-white/[0.08] bg-[#111113] backdrop-blur-lg flex flex-col justify-end">
                  {/* Screenshot Background */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                    loading="lazy"
                    draggable={false}
                  />
                  
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Card Content */}
                  <div className="relative z-10 p-4 sm:p-4.5 flex flex-col justify-end text-white w-full">
                    <span className="text-[7px] font-mono font-bold text-orange-500 tracking-wider block mb-1 uppercase">
                      Case Study_{(i + 1).toString().padStart(2, '0')}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black tracking-tight font-['Outfit'] text-white uppercase leading-tight group-hover:text-orange-500 transition-colors duration-300 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-zinc-300 leading-relaxed font-sans font-medium mb-2.5 line-clamp-2">
                      {item.outcome}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-x-1 gap-y-0.5 font-mono text-[7px] text-zinc-400 font-bold uppercase tracking-wide mb-3">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.05] backdrop-blur-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-white/[0.08]">
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-black font-bold text-[8px] uppercase tracking-wider hover:bg-orange-500 hover:text-white hover:shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all duration-300 cursor-pointer"
                        >
                          Live <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                      {item.codeUrl && (
                        <a
                          href={item.codeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-400 font-bold text-[8px] uppercase tracking-wider hover:border-zinc-700 hover:text-white hover:bg-zinc-900 transition-all duration-300 cursor-pointer"
                          aria-label={`View code repository for ${item.title}`}
                        >
                          Github <Github className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
