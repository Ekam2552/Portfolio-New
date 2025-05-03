import { createContext } from "react";
import { AnimationTiming } from "./AnimationTimingConfig";

// Define the context type
export type AnimationContextType = {
  loaderComplete: boolean;
  setLoaderComplete: (complete: boolean) => void;
  timing: typeof AnimationTiming;
};

// Create context with default values
export const AnimationContext = createContext<AnimationContextType>({
  loaderComplete: false,
  setLoaderComplete: () => {},
  timing: AnimationTiming,
});
