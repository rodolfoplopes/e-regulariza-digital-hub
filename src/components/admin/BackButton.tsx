
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  to = "/admin", 
  label = "Voltar ao Dashboard", 
  className = "" 
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
