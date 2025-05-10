import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "./ScrollIndicator.scss";

interface ScrollIndicatorProps {
  position?: "left" | "center" | "right";
  className?: string;
  delay?: number;
  direction?: "vertical" | "horizontal";
}

const ScrollIndicator = ({
  position = "left",
  className = "",
  delay = 0.5,
  direction = "vertical",
}: ScrollIndicatorProps) => {
  const indicatorRef = useRef<HTMLDivElement>(null);

  // Use GSAP animation with useGSAP hook
  useGSAP(
    () => {
      if (!indicatorRef.current) return;

      // Initially hide scroll indicator
      gsap.set(indicatorRef.current, {
        opacity: 0,
        y: 20,
      });

      // Animate in after specified delay
      gsap.to(indicatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: delay,
      });
    },
    { scope: indicatorRef }
  );

  return (
    <div
      className={`scroll-indicator position-${position} direction-${direction} ${className}`}
      ref={indicatorRef}
    >
      <div className="scroll-text">Scroll to explore</div>
      <div className="scroll-arrows">
        {direction === "vertical" ? (
          <>
        <div className="arrow up">↑</div>
        <div className="arrow down">↓</div>
          </>
        ) : (
          <>
            <div className="arrow left">←</div>
            <div className="arrow right">→</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScrollIndicator;
