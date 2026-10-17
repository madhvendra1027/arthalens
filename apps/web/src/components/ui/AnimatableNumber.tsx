"use client";

import { useEffect, useRef, useState } from "react";
import { createAnimatable } from "animejs";

interface AnimatableNumberProps {
  value: number | null | undefined;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * High-performance numerical counter powered by Anime.js v4 createAnimatable.
 * Smoothly animates values and applies elastic/spring transforms to the DOM target.
 */
export function AnimatableNumber({
  value,
  decimals = 1,
  prefix = "",
  suffix = "",
  className = "",
  duration = 750,
}: AnimatableNumberProps) {
  const [displayValue, setDisplayValue] = useState<number>(() => (typeof value === "number" ? value : 0));
  const elRef = useRef<HTMLSpanElement>(null);
  const animatableRef = useRef<any>(null);
  const targetObjRef = useRef<{ num: number; scale: number; opacity: number }>({
    num: typeof value === "number" ? value : 0,
    scale: 1,
    opacity: 1,
  });

  useEffect(() => {
    if (typeof value !== "number" || isNaN(value)) return;

    // Initialize Anime.js v4 animatable instance
    if (!animatableRef.current) {
      animatableRef.current = createAnimatable(targetObjRef.current, {
        num: targetObjRef.current.num,
        scale: 1,
        opacity: 1,
      });
    }

    const anim = animatableRef.current;
    if (!anim) return;

    let rafId: number;
    const updateDisplay = () => {
      setDisplayValue(targetObjRef.current.num);
      if (elRef.current) {
        elRef.current.style.transform = `scale(${targetObjRef.current.scale})`;
        elRef.current.style.opacity = `${targetObjRef.current.opacity}`;
      }
      rafId = requestAnimationFrame(updateDisplay);
    };

    rafId = requestAnimationFrame(updateDisplay);

    // Animate target property via Anime.js v4 animatable
    if (typeof anim.num === "function") {
      anim.num(value, {
        duration,
        ease: "outExpo",
      });
    }
    if (typeof anim.scale === "function") {
      anim.scale(1.06, { duration: duration / 3, ease: "outQuad" });
      setTimeout(() => {
        if (anim && typeof anim.scale === "function") {
          anim.scale(1, { duration: (duration * 2) / 3, ease: "outElastic(1, .8)" });
        }
      }, duration / 3);
    }

    const timer = setTimeout(() => {
      cancelAnimationFrame(rafId);
      setDisplayValue(value);
      if (elRef.current) {
        elRef.current.style.transform = "";
        elRef.current.style.opacity = "1";
      }
    }, duration + 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [value, duration]);

  if (value === null || value === undefined) {
    return <span className={className}>-</span>;
  }

  const formatted =
    decimals === 0 || Number.isInteger(displayValue)
      ? Math.round(displayValue).toLocaleString("en-IN")
      : displayValue.toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });

  return (
    <span
      ref={elRef}
      className={`inline-block transition-transform will-change-transform ${className}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
