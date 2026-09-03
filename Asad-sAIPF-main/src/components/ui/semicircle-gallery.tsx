import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { useScrollSystem } from '../ScrollSystem';

export interface ProjectGalleryItem {
  title: string;
  outcome: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  codeUrl?: string;
}

interface SemicircleGalleryProps {
  items: ProjectGalleryItem[];
  radius?: number;
  sizeVariance?: number;
  onCardClick: (index: number) => void;
  centerChildren?: React.ReactNode;
}

export function SemicircleGallery({
  items,
  radius: customRadius,
  sizeVariance = 0.12,
  onCardClick,
  centerChildren,
}: SemicircleGalleryProps) {
  const { motionEnabled } = useScrollSystem();
  const [windowWidth, setWindowWidth] = useState(1280);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track exact screen width to dynamically size and space the arc
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute smooth semi-circle arc geometry, spacing, and positions dynamically
  const layout = useMemo(() => {
    let radius = customRadius || 520;
    let cardSize = 160;  // width/height in px
    let startAngle = -84; // clean semi-circle arc span (-84deg to +84deg)
    let endAngle = 84;
    let containerHeight = 680;
    let centerY = 560;
    let isMobile = false;

    if (windowWidth < 768) {
      isMobile = true;
    } else if (windowWidth < 1024) {
      // Tablet layout
      radius = customRadius || 310;
      cardSize = 120;
      startAngle = -75;
      endAngle = 75;
      containerHeight = 440;
      centerY = 400;
    } else if (windowWidth < 1280) {
      // Medium Desktop / Laptop layout
      radius = customRadius || 380;
      cardSize = 135;
      startAngle = -78;
      endAngle = 78;
      containerHeight = 495;
      centerY = 450;
    } else {
      // Large Desktop layout
      radius = customRadius || 460;
      cardSize = 150;
      startAngle = -80;
      endAngle = 80;
      containerHeight = 550;
      centerY = 500;
    }

    const N = items.length;
    const angleStep = N > 1 ? (endAngle - startAngle) / (N - 1) : 0;

    const cards = items.map((item, i) => {
      const angleDegrees = startAngle + i * angleStep;
      const angleRadians = (angleDegrees * Math.PI) / 180;
      
      // Calculate scale prominence for center cards
      const distFromCenter = Math.abs(angleDegrees) / Math.max(Math.abs(startAngle), Math.abs(endAngle));
      const targetScale = 1 + (1 - distFromCenter) * sizeVariance;

      // Trigonometry positioning along true semi-circle radius
      const x = radius * Math.sin(angleRadians);
      const y = -radius * Math.cos(angleRadians);
      
      // Symmetrical arc rotation following the curve exactly (perpendicular to radial spokes)
      const rotation = angleDegrees;

      return {
        item,
        index: i,
        x,
        y,
        angle: angleDegrees,
        rotation,
        scale: targetScale,
      };
    });

    return {
      cards,
      radius,
      cardSize,
      containerHeight,
      centerY,
      isMobile,
    };
  }, [items, windowWidth, customRadius, sizeVariance]);

  // Center index for stagger delay calculation
  const centerIndex = (items.length - 1) / 2;

  // Render Mobile Layout: Horizontal Scroll-Snap Carousel (Never allows overlap)
  if (layout.isMobile) {
    return (
      <div className="w-full flex flex-col gap-8">
        {/* Mobile Header / Headline Container */}
        <div className="px-4 text-center select-none flex flex-col items-center">
          {centerChildren}
        </div>

        {/* Scroll Snap Carousel Row */}
        <div 
          ref={scrollContainerRef}
          className="w-full overflow-x-auto flex gap-6 px-6 snap-x snap-mandatory scroll-smooth scrollbar-none pb-4"
        >
          {items.map((item, i) => (
            <div
              key={`${item.title}-mobile-${i}`}
              onClick={() => onCardClick(i)}
              className="snap-center shrink-0 w-[240px] h-[240px] rounded-2xl overflow-hidden relative border border-white/10 bg-[#111113] shadow-xl cursor-pointer group flex flex-col"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-top transform scale-100 group-hover:scale-[1.05] transition-transform duration-500"
                draggable={false}
                decoding="async"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent flex flex-col justify-end p-4 text-white z-10">
                <span className="text-[7px] font-mono font-bold text-orange-500 tracking-wider block mb-1 uppercase">
                  Case Study_{(i + 1).toString().padStart(2, '0')}
                </span>
                <h4 className="text-xs font-black uppercase tracking-tight font-['Outfit'] mb-1">
                  {item.title}
                </h4>
                <p className="text-[10px] text-zinc-300 leading-relaxed font-sans line-clamp-2">
                  {item.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Desktop/Tablet Layout: Mathematical Semicircular Arc Gallery
  return (
    <div
      className="relative w-full flex items-center justify-center select-none overflow-visible pt-8"
      style={{ height: `${layout.containerHeight}px` }}
    >
      {/* Background radial spotlight grid inside the semicircle */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(240,90,40,0.04),transparent_65%)]" />

      {/* Mathematically Accurate CSS Guide Arc Line */}
      <div 
        className="absolute pointer-events-none border border-dashed border-orange-500/25 rounded-full z-0"
        style={{
          width: layout.radius * 2,
          height: layout.radius * 2,
          left: `calc(50% - ${layout.radius}px)`,
          top: `calc(${layout.centerY}px - ${layout.radius}px)`,
        }}
      />

      {/* Radial Fanned Project Cards */}
      {layout.cards.map((card) => {
        // Sequential left-to-right appearance delay (Card 0 -> Card N)
        const staggerDelay = card.index * 0.1;

        const cardVariants = {
          collapsed: {
            x: card.x,
            y: card.y + 12,
            rotate: card.rotation,
            scale: card.scale * 0.95,
            opacity: 0,
          },
          fanned: {
            x: card.x,
            y: card.y,
            rotate: card.rotation,
            scale: card.scale,
            opacity: 1,
            transition: {
              opacity: { duration: 0.4, delay: motionEnabled ? staggerDelay : 0, ease: 'easeOut' as any },
              default: { duration: 0.18, delay: 0, ease: [0.16, 1, 0.3, 1] as any }
            },
          },
        };

        const halfSize = layout.cardSize / 2;

        return (
          <motion.div
            key={`${card.item.title}-${card.index}`}
            role="group"
            aria-label={`Project: ${card.item.title}`}
            tabIndex={0}
            onClick={() => onCardClick(card.index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCardClick(card.index);
              }
            }}
            variants={cardVariants}
            initial={motionEnabled ? "collapsed" : "fanned"}
            whileInView="fanned"
            viewport={{ once: true, margin: "200px" }}
            transition={{ duration: 0.18, delay: 0, ease: [0.16, 1, 0.3, 1] as any }}
            whileHover={motionEnabled ? {
              x: card.x,
              y: card.y - 22, // lift 22px upwards
              rotate: 0, // straighten rotation to 0 on hover
              scale: card.scale * 1.12,
              zIndex: 100,
              transition: { duration: 0.18, delay: 0, ease: [0.16, 1, 0.3, 1] as any },
            } : undefined}
            className="absolute rounded-2xl shadow-xl overflow-hidden border border-white/10 bg-[#111113] cursor-pointer group focus:outline-none focus:ring-2 focus:ring-orange-500 transform-gpu transition-[border-color,box-shadow,transform] duration-300 hover:border-orange-500/50 hover:shadow-[0_20px_45px_rgba(240,90,40,0.25)]"
            style={{
              width: layout.cardSize,
              height: layout.cardSize,
              left: `calc(50% - ${halfSize}px)`,
              top: `calc(${layout.centerY}px - ${halfSize}px)`,
              transformOrigin: 'center center',
            }}
          >
            {/* Screenshot with object-top positioning & smooth zoom */}
            <img
              src={card.item.image}
              alt={card.item.title}
              className="absolute inset-0 w-full h-full object-cover object-top transform scale-100 group-hover:scale-[1.05] transition-transform duration-500 ease-out"
              loading="lazy"
              decoding="async"
              draggable={false}
            />

            {/* Bottom Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

            {/* Text Overlay */}
            <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-end text-left select-none pointer-events-none z-10">
              <span className="text-[7px] font-mono font-bold text-orange-500 tracking-wider block mb-0.5 uppercase">
                Case Study_{(card.index + 1).toString().padStart(2, '0')}
              </span>
              <h4 className="text-xs font-black uppercase tracking-tight font-['Outfit'] text-white leading-tight group-hover:text-orange-400 transition-colors duration-300 mb-0.5">
                {card.item.title}
              </h4>
              <p className="text-[9px] text-zinc-300 font-sans line-clamp-1 group-hover:line-clamp-2 transition-all duration-300 leading-tight">
                {card.item.outcome}
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* Central Headline, Subhead, and CTA Pill inside the arch pivot */}
      <div 
        className="absolute z-10 w-[340px] md:w-[440px] lg:w-[500px] text-center flex flex-col items-center justify-center p-4 select-none pointer-events-auto"
        style={{
          left: '50%',
          top: `${layout.centerY - 55}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {centerChildren}
      </div>
    </div>
  );
}
