import React from "react";
import { AnimationTiming } from "./AnimationTimingConfig";

// Define the type for the context
export interface AnimationContextType {
  loaderComplete: boolean;
  setLoaderComplete: React.Dispatch<React.SetStateAction<boolean>>;
  timing: typeof AnimationTiming;
}

// Create the context with a default value
export const AnimationContext = React.createContext<AnimationContextType>({
  loaderComplete: false,
  setLoaderComplete: () => {},
  timing: AnimationTiming,
});
