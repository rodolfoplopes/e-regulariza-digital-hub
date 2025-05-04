
import React from "react";

interface LogoProps {
  variant?: "default" | "small" | "icon-only";
  className?: string;
}

export function Logo({ variant = "default", className = "" }: LogoProps) {
  if (variant === "icon-only") {
    return (
      <div className={`rounded-full bg-eregulariza-primary flex items-center justify-center ${className}`}>
        <img 
          src="/lovable-uploads/58cc8e50-0d45-414e-8ce1-33ba4dd6d6e7.png"
          alt="e-regulariza logo"
          className="p-1.5"
          style={{ filter: "brightness(0) invert(1)" }} // Make it white
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${variant === "small" ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-eregulariza-primary flex items-center justify-center flex-shrink-0`}>
        <img 
          src="/lovable-uploads/58cc8e50-0d45-414e-8ce1-33ba4dd6d6e7.png"
          alt="e-regulariza logo"
          className="w-6 h-6"
          style={{ filter: "brightness(0) invert(1)" }} // Make it white
        />
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
