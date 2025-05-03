import { useContext } from "react";
import {
  AnimationContext,
  AnimationContextType,
} from "./AnimationContextDefinition";

// Hook for easy context consumption
export const useAnimationContext = (): AnimationContextType =>
  useContext(AnimationContext);
