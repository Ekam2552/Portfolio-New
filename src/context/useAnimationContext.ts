import { useContext } from "react";
import {
  AnimationContext,
  AnimationContextType,
} from "./AnimationContextDefinition";

// Custom hook to use the animation context
export const useAnimationContext = (): AnimationContextType => {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error(
      "useAnimationContext must be used within an AnimationProvider"
    );
  }

  return context;
};
