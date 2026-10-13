"use client";

/**
 * @author: @dorianbaffier
 * @description: Dynamic Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface DynamicTextItem {
  text: string;
  /** BCP 47 language tag, so screen readers pronounce each word correctly. */
  lang?: string;
  badge?: string;
}

export type Greeting = DynamicTextItem;

export interface DynamicTextProps {
  /** Words to show in turn. Defaults to the greetings demo. */
  words?: DynamicTextItem[];
  /** Milliseconds between words. */
  interval?: number;
  /** Start over after the last word instead of stopping on it. */
  loop?: boolean;
  /** Called once the last word is shown. Never called when looping. */
  onComplete?: () => void;
  className?: string;
  containerClassName?: string;
  textClassName?: string;
  dotClassName?: string;
}

const defaultGreetings: DynamicTextItem[] = [
  { text: "Macroeconomic Intelligence", lang: "en" },
  { text: "National Accounts & GVA", lang: "en" },
  { text: "Real vs Nominal Deflators", lang: "en" },
  { text: "Sovereign Debt Forensics", lang: "en" },
  { text: "Fiscal Trajectory Analysis", lang: "en" },
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function DynamicText({
  words = defaultGreetings,
  interval = 2200,
  loop = true,
  onComplete,
  className,
  containerClassName,
  textClassName,
  dotClassName,
}: DynamicTextProps) {
  // Counts every advance, so a looping word gets a fresh key each time.
  const [step, setStep] = useState(0);
  const count = words.length;
  const lastIndex = count - 1;
  const isDone = !loop && step >= lastIndex;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isDone || count < 2) {
      return;
    }
    const id = setInterval(() => {
      setStep((current) => current + 1);
    }, interval);
    return () => clearInterval(id);
  }, [isDone, count, interval]);

  useEffect(() => {
    if (isDone) {
      onCompleteRef.current?.();
    }
  }, [isDone]);

  const currentItem = words[loop ? step % count : Math.min(step, lastIndex)];
  if (!currentItem) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        className
      )}
    >
      <div className={cn("relative flex h-8 min-w-[220px] sm:min-w-[280px] items-center", containerClassName)}>
        {/* Reduced motion keeps the crossfade and drops the slide. */}
        <MotionConfig reducedMotion="user">
          <AnimatePresence mode="popLayout">
            <motion.div
              animate={{
                y: 0,
                opacity: 1,
                transition: { duration: 0.25, ease: EASE_OUT },
              }}
              aria-live="off"
              className={cn(
                "inline-flex items-center gap-2 font-medium text-inherit whitespace-nowrap",
                textClassName
              )}
              exit={{
                y: -10,
                opacity: 0,
                transition: { duration: 0.18, ease: EASE_OUT },
              }}
              initial={{ y: 10, opacity: 0 }}
              key={step}
              lang={currentItem.lang}
            >
              <div
                aria-hidden="true"
                className={cn("h-2 w-2 rounded-full bg-[#D94E34] shrink-0", dotClassName)}
              />
              <span>{currentItem.text}</span>
            </motion.div>
          </AnimatePresence>
        </MotionConfig>
      </div>
    </div>
  );
}

export default DynamicText;
