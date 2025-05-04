
import React from "react";

interface LogoProps {
  variant?: "default" | "small" | "icon-only";
  className?: string;
}

export function Logo({ variant = "default", className = "" }: LogoProps) {
  // This is a placeholder SVG, replace with actual brand logo
  if (variant === "icon-only") {
    return (
      <div className={`rounded-full bg-eregulariza-primary flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 24 24" width="100%" height="100%" className="text-white p-1.5">
          <path 
            fill="currentColor"
            d="M3 9h18v10H3V9zm0-4h18v2H3V5zm6 8h6v2H9v-2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${variant === "small" ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-eregulariza-primary flex items-center justify-center flex-shrink-0`}>
        <svg viewBox="0 0 24 24" width="60%" height="60%" className="text-white">
          <path 
            fill="currentColor"
            d="M3 9h18v10H3V9zm0-4h18v2H3V5zm6 8h6v2H9v-2z"
          />
        </svg>
      </div>
      {variant !== "small" ? (
        <span className="text-lg font-semibold text-eregulariza-darkgray">
          e-regulariza
        </span>
      ) : (
        <span className="text-base font-semibold text-eregulariza-darkgray">
          e-regulariza
        </span>
      )}
    </div>
  );
}
