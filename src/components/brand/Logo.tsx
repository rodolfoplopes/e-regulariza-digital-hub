
import React from "react";

interface LogoProps {
  variant?: "default" | "small" | "icon-only";
  className?: string;
}

export function Logo({ variant = "default", className = "" }: LogoProps) {
  if (variant === "icon-only") {
    return (
      <div className={`rounded-full bg-primary flex items-center justify-center ${className}`}>
        <img 
          src="/lovable-uploads/58cc8e50-0d45-414e-8ce1-33ba4dd6d6e7.png"
          alt="e-regulariza logo"
          className="h-10 w-auto object-contain p-1.5"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/lovable-uploads/58cc8e50-0d45-414e-8ce1-33ba4dd6d6e7.png"
        alt="e-regulariza logo"
        className={`${variant === "small" ? "h-8" : "h-10"} w-auto object-contain`}
      />
    </div>
  );
}
