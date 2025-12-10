import logoAzulBranco from "@/assets/logo-azul-branco.png";
import logoGradiente from "@/assets/logo-gradiente.png";

interface LogoProps {
  variant?: "default" | "small" | "icon-only" | "without-circle" | "header" | "circular" | "gradient";
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
  const sizeClasses = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-10 w-auto",
  };
  
  const logoSize = sizeClasses[size];
  const logoUrl = customUrl || logoAzulBranco;
  
  if (variant === "circular" || variant === "icon-only" || variant === "gradient") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src={logoGradiente}
          alt="e-regulariza"
          className={`${logoSize} object-contain`}
        />
      </div>
    );
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoUrl}
        alt="e-regulariza"
        className={`${variant === "header" ? "h-10 w-auto" : logoSize} object-contain`}
      />
    </div>
  );
}
