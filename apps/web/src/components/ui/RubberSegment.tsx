"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

export interface RubberSegmentProps {
  items: string[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string, index: number) => void;
  trackColor?: string;
  thumbColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: "sm" | "md" | "lg";
  radius?: number;
  inset?: number;
  equalSlots?: boolean;
  stretch?: number;
  squash?: number;
  speed?: number;
  glide?: number;
  draggable?: boolean;
  preset?: string;
  disabled?: boolean;
  className?: string;
}

export function RubberSegment({
  items,
  defaultValue,
  value,
  onChange,
  trackColor = "#ECEBE5",
  thumbColor = "#141416",
  textColor = "#57585C",
  activeTextColor = "#ECEBE5",
  size = "md",
  radius = 9999, // Capsule pill default
  inset = 3,
  equalSlots = true,
  stretch = 100,
  squash = 3,
  speed = 1,
  glide = 75,
  draggable = false,
  preset = "periods",
  disabled = false,
  className = "",
}: RubberSegmentProps) {
  const initialIndex = Math.max(
    0,
    items.indexOf(value !== undefined ? value : defaultValue || items[0])
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [targetIndex, setTargetIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Update when controlled value changes
  useEffect(() => {
    if (value !== undefined) {
      const idx = items.indexOf(value);
      if (idx !== -1 && idx !== selectedIndex) {
        setSelectedIndex(idx);
        setTargetIndex(idx);
      }
    }
  }, [value, items, selectedIndex]);

  // Size specifications
  const sizeStyles = {
    sm: "h-7 text-[11px] px-2.5",
    md: "h-8.5 text-xs px-3.5",
    lg: "h-10 text-sm px-4.5",
  }[size] || "h-8.5 text-xs px-3.5";

  const handleSelect = (idx: number) => {
    if (disabled || idx === selectedIndex) return;

    setIsTransitioning(true);
    setTargetIndex(idx);
    setSelectedIndex(idx);

    if (onChange) {
      onChange(items[idx], idx);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 280 / speed);
  };

  // Determine dynamic stretch scale based on index jump
  const distance = Math.abs(targetIndex - selectedIndex);
  const stretchFactor = isTransitioning ? Math.min(1.25, 1 + (stretch / 1000) * Math.max(1, distance)) : 1;
  const squashFactor = isTransitioning ? Math.max(0.85, 1 - (squash / 100)) : 1;

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-disabled={disabled}
      className={cn(
        "relative inline-flex items-center select-none border border-[rgba(20,21,23,0.12)] p-1 shadow-2xs transition-colors",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      style={{
        backgroundColor: trackColor,
        borderRadius: radius === 9999 ? "9999px" : `${radius}px`,
        padding: `${inset}px`,
      }}
    >
      {items.map((item, idx) => {
        const isSelected = selectedIndex === idx;
        return (
          <button
            key={item}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => handleSelect(idx)}
            className={cn(
              "relative z-10 flex items-center justify-center font-medium transition-colors font-sans focus:outline-none cursor-pointer",
              sizeStyles,
              equalSlots ? "flex-1" : "flex-initial"
            )}
            style={{
              color: isSelected ? activeTextColor : textColor,
              borderRadius: radius === 9999 ? "9999px" : `${Math.max(4, radius - inset)}px`,
            }}
          >
            <span className="relative z-10 truncate font-mono text-xs">{item}</span>

            {/* Elastic Rubber Pill Indicator */}
            {isSelected && (
              <motion.div
                layoutId={`rubber-thumb-${preset}`}
                className="absolute inset-0 z-0 shadow-xs"
                style={{
                  backgroundColor: thumbColor,
                  borderRadius: radius === 9999 ? "9999px" : `${Math.max(4, radius - inset)}px`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 420 * speed,
                  damping: 32 + (glide / 10),
                  mass: 0.8,
                }}
                animate={{
                  scaleX: stretchFactor,
                  scaleY: squashFactor,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default RubberSegment;
