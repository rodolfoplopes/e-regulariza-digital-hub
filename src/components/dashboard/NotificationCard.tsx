
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface NotificationProps {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
}

export default function NotificationCard({ notification }: { notification: NotificationProps }) {
  const typeIcons = {
    info: (
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    success: (
      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    )
  };

  return (
    <Card className={`card-hover ${!notification.isRead ? "border-l-4 border-eregulariza-primary" : ""}`}>
      <CardHeader className="p-4 flex-row space-y-0 gap-4">
        {typeIcons[notification.type]}
        <div className="space-y-1">
          <h4 className="font-medium">{notification.title}</h4>
          <p className="text-sm text-gray-500">{notification.message}</p>
          <p className="text-xs text-gray-400">{notification.date}</p>
        </div>
      </CardHeader>
    </Card>
  );
}
