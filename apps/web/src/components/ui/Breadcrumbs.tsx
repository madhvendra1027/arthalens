"use client";

import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const fullItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
        ? item.href.startsWith("http")
          ? item.href
          : `https://arthalens-production.up.railway.app${item.href}`
        : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs font-mono text-slate-400 py-3 ${className}`}
      >
        <ol className="flex items-center flex-wrap gap-2">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-slate-600 select-none" aria-hidden="true">
                    /
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    aria-current="page"
                    className="text-emerald-400 font-medium truncate max-w-[240px]"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-slate-200 transition-colors duration-150 underline-offset-4 hover:underline"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
