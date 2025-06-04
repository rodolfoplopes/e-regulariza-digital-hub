
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from './useSupabaseAuth';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { profile } = useSupabaseAuth();

  useEffect(() => {
    if (profile) {
      const onboardingKey = `onboarding_completed_${profile.id}`;
      const completed = localStorage.getItem(onboardingKey) === 'true';
      
      setHasCompletedOnboarding(completed);
      
      // Show onboarding for new users
      if (!completed) {
        // Small delay to ensure page is loaded
        setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
      }
    }
  }, [profile]);

  const completeOnboarding = () => {
    if (profile) {
      const onboardingKey = `onboarding_completed_${profile.id}`;
      localStorage.setItem(onboardingKey, 'true');
      setHasCompletedOnboarding(true);
      setShowOnboarding(false);
    }
  };

  const restartOnboarding = () => {
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    hasCompletedOnboarding,
    completeOnboarding,
    restartOnboarding
  };
};
