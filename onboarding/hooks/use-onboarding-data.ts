'use client';

import { useEffect } from 'react';
import {
  useOnboardingDataStore,
  usePetStore,
  usePassportStore,
} from '../stores';

/**
 * Custom hook to manage data loading and state for the onboarding flow
 *
 * This hook coordinates between the different domain-specific stores
 * and provides a unified interface for components to work with
 */
export function useOnboardingData(petId?: string | null) {
  const { initializeOnboardingData } = useOnboardingDataStore();
  const { isLoading: isPetLoading, error: petError } = usePetStore();
  const { isLoading: isPassportLoading, error: passportError } =
    usePassportStore();

  // Consolidated loading state
  const isLoading = isPetLoading || isPassportLoading;

  // Consolidated error state
  const error = petError || passportError;

  // Initialize data when the component mounts
  useEffect(() => {
    initializeOnboardingData(petId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  return {
    isLoading,
    error,
  };
}
