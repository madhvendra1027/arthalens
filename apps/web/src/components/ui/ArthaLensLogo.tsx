"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export type LogoVariant = "auto" | "horizontal" | "full" | "symbol";
export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ArthaLensLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  asLink?: boolean;
  href?: string;
  priority?: boolean;
  alt?: string;
  /** Backward compatibility flag */
  showText?: boolean;
}

const SIZE_CONFIGS = {
  symbol: {
    xs: { dim: 24, className: "w-6 h-6" },
    sm: { dim: 32, className: "w-8 h-8" },
    md: { dim: 40, className: "w-10 h-10" },
    lg: { dim: 56, className: "w-14 h-14" },
    xl: { dim: 72, className: "w-[72px] h-[72px]" },
  },
  horizontal: {
    xs: { height: 24, width: 77, className: "h-6 w-auto" },
    sm: { height: 32, width: 103, className: "h-8 w-auto" },
    md: { height: 40, width: 128, className: "h-10 w-auto" },
    lg: { height: 56, width: 180, className: "h-14 w-auto" },
    xl: { height: 72, width: 231, className: "h-[72px] w-auto" },
  },
  full: {
    xs: { height: 48, width: 40, className: "h-12 w-auto" },
    sm: { height: 72, width: 61, className: "h-[72px] w-auto" },
    md: { height: 110, width: 93, className: "h-[110px] w-auto" },
    lg: { height: 160, width: 135, className: "h-[160px] w-auto" },
    xl: { height: 240, width: 202, className: "h-[240px] w-auto" },
  },
};

export function ArthaLensLogo({
  variant = "horizontal",
  size = "md",
  className = "",
  asLink = false,
  href = "/",
  priority = true,
  alt = "ArthaLens — Macroeconomic Intelligence",
  showText,
}: ArthaLensLogoProps) {
  // If showText was explicitly passed and variant is symbol, upgrade to horizontal
  const activeVariant = showText === true && variant === "symbol" ? "horizontal" : variant;

  const renderContent = () => {
    if (activeVariant === "auto") {
      // Responsive: compact symbol on mobile, horizontal lockup on desktop
      const symConf = SIZE_CONFIGS.symbol[size];
      const horizConf = SIZE_CONFIGS.horizontal[size];

      return (
        <div className={`relative inline-flex items-center ${className}`}>
          {/* Mobile Symbol */}
          <div className="block sm:hidden shrink-0">
            <div className="relative rounded-lg overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#070B12] shadow-xs">
              <Image
                src="/brand/arthalens-symbol.png"
                alt={alt}
                width={symConf.dim}
                height={symConf.dim}
                priority={priority}
                className="object-contain"
              />
            </div>
          </div>

          {/* Desktop Horizontal Lockup */}
          <div className="hidden sm:block shrink-0">
            <div className="relative rounded-lg overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#070B12] shadow-xs px-1.5 py-0.5">
              <Image
                src="/brand/arthalens-logo-horizontal.png"
                alt={alt}
                width={horizConf.width}
                height={horizConf.height}
                priority={priority}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      );
    }

    if (activeVariant === "symbol") {
      const conf = SIZE_CONFIGS.symbol[size];
      return (
        <div
          className={`relative shrink-0 rounded-lg overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#070B12] shadow-xs ${className}`}
          style={{ width: conf.dim, height: conf.dim }}
        >
          <Image
            src="/brand/arthalens-symbol.png"
            alt={alt}
            width={conf.dim}
            height={conf.dim}
            priority={priority}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    if (activeVariant === "full") {
      const conf = SIZE_CONFIGS.full[size];
      return (
        <div
          className={`relative inline-block rounded-xl overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#070B12] shadow-md p-2 ${className}`}
        >
          <Image
            src="/brand/arthalens-logo.png"
            alt={alt}
            width={conf.width}
            height={conf.height}
            priority={priority}
            className="object-contain mx-auto"
          />
        </div>
      );
    }

    // Default: horizontal lockup
    const conf = SIZE_CONFIGS.horizontal[size];
    return (
      <div
        className={`relative inline-flex items-center rounded-lg overflow-hidden border border-[rgba(20,21,23,0.18)] bg-[#070B12] shadow-xs px-2 py-1 ${className}`}
      >
        <Image
          src="/brand/arthalens-logo-horizontal.png"
          alt={alt}
          width={conf.width}
          height={conf.height}
          priority={priority}
          className="object-contain"
        />
      </div>
    );
  };

  if (asLink) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94E34] rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        aria-label={alt}
      >
        {renderContent()}
      </Link>
    );
  }

  return renderContent();
}

export default ArthaLensLogo;
