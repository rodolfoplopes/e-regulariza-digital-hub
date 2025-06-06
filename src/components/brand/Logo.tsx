
import React from "react";

interface LogoProps {
  variant?: "default" | "small" | "icon-only" | "without-circle" | "header";
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
    sm: "h-6 w-auto",
    md: "h-8 w-auto", 
    lg: "h-10 w-auto",
  };
  
  const logoSize = sizeClasses[size];
  
  // Use custom URL if provided, otherwise use the default logo
  const logoUrl = customUrl || "/lovable-uploads/3b439cb9-4071-4319-8787-a968cea832a7.png";
  
  // For header variant (sem círculo, aplicação limpa da marca)
  if (variant === "header") {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src={logoUrl}
          alt="e-regulariza"
          className="logo-e-regulariza"
        />
      </div>
    );
  }
  
  // For without-circle variant (just the logo without the circle background)
  if (variant === "without-circle") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src={logoUrl}
          alt="e-regulariza"
          className={`${logoSize} object-contain`}
        />
      </div>
    );
  }
  
  // For icon-only variant (logomarca com círculo apenas quando necessário)
  if (variant === "icon-only") {
    return (
      <div className={`flex items-center justify-center ${className} rounded-full bg-eregulariza-secondary ${logoSize} overflow-hidden flex-shrink-0 p-1.5`}>
        <img 
          src={logoUrl}
          alt="e-regulariza"
          className={`${logoSize} object-contain`}
        />
      </div>
    );
  }

  // For small variant (sem círculo, tamanho reduzido)
  if (variant === "small") {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src={logoUrl}
          alt="e-regulariza"
          className={`${sizeClasses.sm} object-contain`}
        />
      </div>
    );
  }

  // For default variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logoUrl}
        alt="e-regulariza"
        className={`${logoSize} object-contain`}
      />
    </div>
  );
}
