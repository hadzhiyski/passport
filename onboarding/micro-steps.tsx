'use client';

import { STEPS_CONFIG } from '@passport/onboarding';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

function getAvailableMicroSteps<T extends keyof typeof STEPS_CONFIG>(
  step: T,
): string[] | null {
  const microSteps = STEPS_CONFIG[step]?.microSteps;
  if (!microSteps) return null;

  return Object.keys(microSteps);
}

type MicroStepContextProps = {
  current: string | null;
  setCurrent: (step: string) => void;
  next: () => boolean;
  previous: () => boolean;
  reset: () => void;
  all: string[] | null;
  index: number;
  total: number;
};

const MicroStepContext = createContext<MicroStepContextProps | undefined>(
  undefined,
);

interface MicroStepsProviderProps {
  children: React.ReactNode;
  mainStep: keyof typeof STEPS_CONFIG;
  initialMicroStep?: string;
}

export function MicroStepsProvider({
  children,
  mainStep,
  initialMicroStep,
}: MicroStepsProviderProps) {
  const all = getAvailableMicroSteps(mainStep);
  const initialCurrentStep =
    initialMicroStep || (all && all.length > 0 ? all[0] : null);

  const [current, updateCurrent] = useState<string | null>(initialCurrentStep);

  useEffect(() => {
    updateCurrent(initialCurrentStep);
  }, [initialCurrentStep]);

  const index = current && all ? all.indexOf(current) : -1;

  const total = all ? all.length : 0;

  const setCurrent = useCallback(
    (step: string) => {
      if (!all || !all.includes(step)) {
        console.error(
          `Micro step "${step}" is not available for main step "${mainStep}"`,
        );
        return;
      }
      updateCurrent(step);
    },
    [all, mainStep],
  );

  const reset = useCallback(() => {
    if (all && all.length > 0) {
      updateCurrent(all[0]);
    } else {
      updateCurrent(null);
    }
  }, [all]);

  const next = useCallback(() => {
    if (!all || !current) return false;

    const currentIndex = all.indexOf(current);
    if (currentIndex < all.length - 1) {
      updateCurrent(all[currentIndex + 1]);
      return true;
    }
    return false;
  }, [all, current]);

  const previous = useCallback(() => {
    if (!all || !current) return false;

    const currentIndex = all.indexOf(current);
    if (currentIndex > 0) {
      updateCurrent(all[currentIndex - 1]);
      return true;
    }
    return false;
  }, [all, current]);

  const value = {
    current,
    setCurrent,
    next,
    previous,
    reset,
    all,
    index,
    total,
  } satisfies MicroStepContextProps;

  return (
    <MicroStepContext.Provider value={value}>
      {children}
    </MicroStepContext.Provider>
  );
}

export function useMicroSteps() {
  const context = useContext(MicroStepContext);
  if (context === undefined) {
    throw new Error('useMicroSteps must be used within a MicroStepsProvider');
  }
  return context;
}
