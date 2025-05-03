import React, { useState, ReactNode } from "react";
import { AnimationContext } from "./AnimationContextDefinition";
import { AnimationTiming } from "./AnimationTimingConfig";

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
