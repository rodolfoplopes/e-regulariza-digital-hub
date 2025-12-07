
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  showIcon?: boolean;
}

export default function ErrorMessage({ 
  title = "Erro",
  message,
  onRetry,
  className = "",
  showIcon = true
}: ErrorMessageProps) {
  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardContent className="p-6 text-center">
        {showIcon && (
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        )}
        <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
        <p className="text-red-600 mb-4">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
