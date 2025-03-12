import React, { createContext, useState, useContext, ReactNode } from 'react';

// Animation timing configuration
export const AnimationTiming = {
  // Time in ms to wait after loader completes before starting components' animations
  POST_LOADER_DELAY: 250,
  // Default stagger between elements in a sequence
  DEFAULT_STAGGER: 0.15,
};

type AnimationContextType = {
  loaderComplete: boolean;
  setLoaderComplete: (complete: boolean) => void;
  timing: typeof AnimationTiming;
};

// Create context with default values
const AnimationContext = createContext<AnimationContextType>({
  loaderComplete: false,
  setLoaderComplete: () => {},
  timing: AnimationTiming,
});

// Hook for easy context consumption
export const useAnimationContext = () => useContext(AnimationContext);

// Provider component
export const AnimationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loaderComplete, setLoaderComplete] = useState(false);

  return (
    <AnimationContext.Provider
      value={{
        loaderComplete,
        setLoaderComplete,
        timing: AnimationTiming,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
