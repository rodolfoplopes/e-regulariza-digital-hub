
import React from "react";

interface LogoProps {
  variant?: "default" | "small" | "icon-only";
  className?: string;
  size?: "sm" | "md" | "lg";
  customUrl?: string;
}

export function Logo({ 
  variant = "default", 
  className = "",
  size = "md",
  customUrl 
}: LogoProps) {
  // Determine size based on the size prop
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };
  
  const logoSize = sizeClasses[size];
  
  // Common base classes for the logo container
  const baseClasses = "flex items-center justify-center";
  
  // Use custom URL if provided, otherwise use the default logo
  const logoUrl = customUrl || "/lovable-uploads/3b439cb9-4071-4319-8787-a968cea832a7.png";
  
  // For icon-only variant (just the logo in a circle)
  if (variant === "icon-only") {
    return (
      <div className={`${baseClasses} ${className} rounded-full bg-[#06D7A5] ${logoSize} overflow-hidden flex-shrink-0`}>
        <img 
          src={logoUrl}
          alt="e-regulariza"
          className={`${logoSize} object-contain p-1.5`}
        />
      </div>
    );
  }

  // For default and small variants
  return (
    <div className={`${baseClasses} gap-2 ${className}`}>
      <div className={`rounded-full bg-[#06D7A5] ${logoSize} flex items-center justify-center overflow-hidden flex-shrink-0`}>
        <img 
          src={logoUrl}
          alt="e-regulariza"
          className={`${logoSize} w-auto object-contain p-1.5`}
        />
      </div>
    </div>
  );
}
