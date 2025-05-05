
import React from "react";

interface LogoProps {
  variant?: "default" | "small" | "icon-only";
  className?: string;
}

export function Logo({ variant = "default", className = "" }: LogoProps) {
  // Common base classes for the logo container
  const baseClasses = "flex items-center justify-center";
  
  // Apply different styling based on variant
  if (variant === "icon-only") {
    return (
      <div className={`${baseClasses} ${className} rounded-full bg-[#06D7A5] h-10 w-10 overflow-hidden flex-shrink-0`}>
        <img 
          src="/lovable-uploads/58cc8e50-0d45-414e-8ce1-33ba4dd6d6e7.png"
          alt="e-regulariza"
          className="h-10 w-10 object-contain p-1.5"
        />
      </div>
    );
  }

  // For default and small variants
  const sizeClass = variant === "small" ? "h-8" : "h-10";
  
  return (
    <div className={`${baseClasses} gap-2 ${className}`}>
      <div className={`rounded-full bg-[#06D7A5] ${sizeClass} ${variant === "small" ? "w-8" : "w-10"} flex items-center justify-center overflow-hidden flex-shrink-0`}>
        <img 
          src="/lovable-uploads/58cc8e50-0d45-414e-8ce1-33ba4dd6d6e7.png"
          alt="e-regulariza"
          className={`${sizeClass} w-auto object-contain p-1.5`}
        />
      </div>
      <span className={`font-semibold ${variant === "small" ? "text-base" : "text-xl"} text-[#373535]`}>
        e-regulariza
      </span>
    </div>
  );
}
