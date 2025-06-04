
import { useState, useEffect } from 'react';
import { notificationService } from '@/services/supabaseService';
import { useSupabaseAuth } from './useSupabaseAuth';
import { Notification } from '@/services/core/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { profile } = useSupabaseAuth();

  const fetchNotifications = async () => {
    if (!profile?.id) return;

    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(profile.id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [profile?.id]);

  const markAsRead = async (id: string) => {
    const success = await notificationService.markAsRead(id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    return success;
  };

  const markAllAsRead = async () => {
    if (!profile?.id) return false;
    
    const success = await notificationService.markAllAsRead(profile.id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    }
    return success;
  };

  const refreshNotifications = () => {
    fetchNotifications();
  };

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  };
};
