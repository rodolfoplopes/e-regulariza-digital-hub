
import React from "react";

interface LogoProps {
  variant?: "default" | "small" | "icon-only" | "without-circle" | "header" | "circular";
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
  // Determine size based on the size prop - adjusted for better login experience
  const sizeClasses = {
    sm: "h-6 w-auto", // 24px - smaller for mobile
    md: "h-8 w-auto", // 32px - reduced from 40px for better login layout  
    lg: "h-10 w-auto", // 40px - reduced from 48px
  };
  
  const logoSize = sizeClasses[size];
  
  // Use the circular logo for icon-only or login contexts
  const circularLogoUrl = "/lovable-uploads/58cc8e50-0d45-414e-8ce1-33ba4dd6d6e7.png";
  // Use custom URL if provided, otherwise use the default horizontal logo
  const logoUrl = customUrl || "/lovable-uploads/3b439cb9-4071-4319-8787-a968cea832a7.png";
  
  // For circular variant (usar logo com fundo gradiente azul/verde)
  if (variant === "circular") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src={circularLogoUrl}
          alt="e-regulariza"
          className={`${logoSize} object-contain rounded-full`}
        />
      </div>
    );
  }
  
  // For header variant (logotipo horizontal tradicional)
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
  
  // For icon-only variant (usar logo circular com gradiente)
  if (variant === "icon-only") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src={circularLogoUrl}
          alt="e-regulariza"
          className={`${logoSize} object-contain rounded-full`}
        />
      </div>
    );
  }

  // For small variant (logotipo horizontal em tamanho reduzido)
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
