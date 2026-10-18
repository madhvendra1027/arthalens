"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ExternalLink, ShieldAlert, AlertTriangle, Info, Sparkles, X } from "lucide-react";
import { InAppNotification, SeverityLevel } from "@/lib/intelligence/types";
import { motion, AnimatePresence } from "motion/react";

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className = "" }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "home_economic" | "global_market" | "spillover">("all");
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000); // Polling every 45s for updates
    return () => clearInterval(interval);
  }, []);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
    } catch (err) {
      console.error("Error marking read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch (err) {
      console.error("Error marking all read", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.type === activeFilter;
  });

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case "critical":
        return {
          icon: <ShieldAlert className="h-3 w-3 text-[#D94E34]" />,
          border: "border-[#D94E34]/30",
          bg: "bg-[#D94E34]/10",
          text: "text-[#D94E34]",
          label: "Critical",
        };
      case "high":
        return {
          icon: <AlertTriangle className="h-3 w-3 text-[#E5A83B]" />,
          border: "border-[#E5A83B]/30",
          bg: "bg-[#E5A83B]/10",
          text: "text-[#E5A83B]",
          label: "High Impact",
        };
      case "standard":
        return {
          icon: <Info className="h-3 w-3 text-[#059669]" />,
          border: "border-[#059669]/30",
          bg: "bg-[#059669]/10",
          text: "text-[#059669]",
          label: "Standard",
        };
      default:
        return {
          icon: <Sparkles className="h-3 w-3 text-[#57585C]" />,
          border: "border-black/10",
          bg: "bg-black/5",
          text: "text-[#57585C]",
          label: "Info",
        };
    }
  };

  return (
    <div className={`relative ${className}`} ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] text-[#141416] hover:bg-black/5 hover:border-[rgba(20,21,23,0.35)] transition-all shadow-2xs cursor-pointer active:scale-95"
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#D94E34] text-[10px] font-mono font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Drawer / Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-14 sm:top-auto sm:mt-2 z-50 w-auto sm:w-[400px] max-w-[calc(100vw-1rem)] max-h-[85vh] flex flex-col rounded-2xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] shadow-2xl backdrop-blur-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(20,21,23,0.1)] bg-white/40">
              <div className="flex items-center gap-2">
                <span className="font-heading font-semibold text-sm text-[#141416]">
                  Macroeconomic Alerts
                </span>
                {unreadCount > 0 ? (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#D94E34]/15 text-[#D94E34]">
                    {unreadCount} unread
                  </span>
                ) : (
                  <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#059669]/15 text-[#059669]">
                    All caught up
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] font-sans font-medium text-[#57585C] hover:text-[#141416] px-2 py-1 rounded-md hover:bg-black/5 transition-colors cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-[rgba(20,21,23,0.08)] bg-white/20 overflow-x-auto text-[11px]">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                  activeFilter === "all"
                    ? "bg-[#141416] text-[#ECEBE5]"
                    : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter("home_economic")}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                  activeFilter === "home_economic"
                    ? "bg-[#141416] text-[#ECEBE5]"
                    : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                }`}
              >
                Home Macro
              </button>
              <button
                onClick={() => setActiveFilter("spillover")}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                  activeFilter === "spillover"
                    ? "bg-[#141416] text-[#ECEBE5]"
                    : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                }`}
              >
                Spillovers
              </button>
              <button
                onClick={() => setActiveFilter("global_market")}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap ${
                  activeFilter === "global_market"
                    ? "bg-[#141416] text-[#ECEBE5]"
                    : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
                }`}
              >
                World Markets
              </button>
            </div>

            {/* List Body */}
            <div className="overflow-y-auto max-h-[58vh] divide-y divide-[rgba(20,21,23,0.06)] p-1">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 text-[#828387] mx-auto mb-2 opacity-40" />
                  <p className="font-heading text-xs font-semibold text-[#141416]">
                    No notifications in this filter
                  </p>
                  <p className="font-sans text-[11px] text-[#57585C] mt-1">
                    Systemic economic releases and market alerts matching your home country will appear here.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((n) => {
                  const badge = getSeverityBadge(n.severity);
                  return (
                    <div
                      key={n.id}
                      onClick={() => !n.read && handleMarkAsRead(n.id)}
                      className={`group relative p-3.5 transition-all rounded-xl hover:bg-white/80 cursor-pointer ${
                        !n.read ? "bg-white/50 font-medium" : "opacity-80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${badge.border} ${badge.bg} ${badge.text}`}
                          >
                            {badge.icon}
                            <span>{n.categoryLabel}</span>
                          </span>
                          <span className="font-mono text-[10px] text-[#828387]">
                            {new Date(n.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-[#D94E34] shrink-0 mt-1" />
                        )}
                      </div>

                      <h4 className="font-heading text-xs font-bold text-[#141416] leading-snug group-hover:text-[#D94E34] transition-colors mb-1">
                        {n.title}
                      </h4>
                      <p className="font-sans text-[11px] text-[#57585C] line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[11px]">
                        {n.link ? (
                          <Link
                            href={n.link}
                            onClick={() => {
                              handleMarkAsRead(n.id);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-[#059669] hover:underline"
                          >
                            <span>Open story analysis</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : <span />}

                        {!n.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                            className="text-[10px] font-mono text-[#828387] hover:text-[#141416]"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[rgba(20,21,23,0.1)] bg-white/50 flex items-center justify-between">
              <Link
                href="/intelligence?tab=preferences"
                onClick={() => setIsOpen(false)}
                className="font-mono text-[11px] text-[#57585C] hover:text-[#141416] transition-colors"
              >
                Alert Preferences & Home Country
              </Link>
              <Link
                href="/intelligence"
                onClick={() => setIsOpen(false)}
                className="font-mono text-[11px] font-semibold text-[#141416] hover:text-[#D94E34] transition-colors flex items-center gap-1"
              >
                <span>Full Observatory</span>
                <span>→</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
