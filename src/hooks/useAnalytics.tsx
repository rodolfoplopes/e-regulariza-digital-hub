
import { useEffect } from 'react';
import { analytics } from '@/services/analyticsService';
import { useAuth } from '@/App';

export const useAnalytics = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      analytics.setUser(user.id);
    }
  }, [user?.id]);

  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackFunnelStep: analytics.trackFunnelStep.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackRegistrationStart: analytics.trackRegistrationStart.bind(analytics),
    trackRegistrationComplete: analytics.trackRegistrationComplete.bind(analytics),
    trackFirstLogin: analytics.trackFirstLogin.bind(analytics),
    trackProcessInitiation: analytics.trackProcessInitiation.bind(analytics),
    trackDocumentUpload: analytics.trackDocumentUpload.bind(analytics),
    trackProcessStageComplete: analytics.trackProcessStageComplete.bind(analytics),
    trackProcessComplete: analytics.trackProcessComplete.bind(analytics),
    getAnalyticsSummary: analytics.getAnalyticsSummary.bind(analytics),
    exportAnalytics: analytics.exportAnalytics.bind(analytics)
  };
};
