import logoAzulMenu from "@/assets/logo-azul-menu.png";
import logoVerdeFooter from "@/assets/logo-verde-footer.png";

interface LogoProps {
  variant?: "default" | "small" | "icon-only" | "without-circle" | "header" | "circular" | "gradient" | "footer";
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
  
  if (variant === "footer" || variant === "gradient" || variant === "circular" || variant === "icon-only") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src={logoVerdeFooter}
          alt="e-regulariza"
          className={`${logoSize} object-contain`}
        />
      </div>
    );
  }
  
  const logoUrl = customUrl || logoAzulMenu;
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoUrl}
        alt="e-regulariza"
        className={`${variant === "header" ? "h-14 w-auto" : logoSize} object-contain`}
      />
    </div>
  );
}
