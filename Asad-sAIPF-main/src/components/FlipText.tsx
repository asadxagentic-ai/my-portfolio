"use client";

import React, { useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";

export interface FlipTextProps {
  className?: string;
  children: string;
  duration?: number;
  delay?: number;
  loop?: boolean;
  separator?: string;
  together?: boolean;
}

export function FlipText({
  className = "",
  children,
  duration = 0.8,
  delay = 0,
  loop = false,
  separator = " ",
  together = false,
}: FlipTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: !loop, margin: "-10%" });
  const words = useMemo(() => children.split(separator), [children, separator]);
  const totalChars = children.length;

  const getCharIndex = (wordIndex: number, charIndex: number) => {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) {
      index += words[i].length + (separator === " " ? 1 : separator.length);
    }
    return index + charIndex;
  };

  return (
    <div
      ref={containerRef}
      className={`inline-block leading-none ${className}`}
      style={{ perspective: "1000px" }}
    >
      {words.map((word, wordIndex) => {
        const chars = word.split("");

        return (
          <span
            key={wordIndex}
            className="inline-block whitespace-nowrap"
            style={{ transformStyle: "preserve-3d" }}
          >
            {chars.map((char, charIndex) => {
              const currentGlobalIndex = getCharIndex(wordIndex, charIndex);

              let calculatedDelay = delay;
              if (!together) {
                const normalizedIndex = totalChars > 1 ? currentGlobalIndex / (totalChars - 1) : 0;
                const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                calculatedDelay = sineValue * (duration * 0.4) + delay;
              }

              return (
                <motion.span
                  key={charIndex}
                  className="inline-block relative"
                  style={{ transformStyle: "preserve-3d", transformOrigin: "50% 50%" }}
                  initial={{ rotateX: -90, y: 15, opacity: 0 }}
                  animate={isInView ? { rotateX: 0, y: 0, opacity: 1 } : { rotateX: -90, y: 15, opacity: 0 }}
                  transition={{
                    duration: duration,
                    delay: calculatedDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
            {separator === " " && wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
            {separator !== " " && wordIndex < words.length - 1 && (
              <span className="inline-block">{separator}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default FlipText;
