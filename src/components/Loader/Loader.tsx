import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./Loader.scss";
import { useAnimationContext } from "../../context/useAnimationContext";
import {
  setupCurtainForHiddenElements,
  applyCurtainRevealToElement,
} from "../../utils/animations/textRevealAnimations";

interface LoaderProps {
  duration?: number; // Duration in seconds
  onComplete?: () => void; // Callback when loader animation completes
}

const Loader: React.FC<LoaderProps> = ({
  duration = 7, // 7 seconds default duration
  onComplete,
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);

  // State to track percentage counter value
  const [percentage, setPercentage] = useState(0);

  // State to track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(false);

  // State to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Get the setLoaderComplete function from context
  const { setLoaderComplete } = useAnimationContext();

  // Effect to mark component as mounted
  useEffect(() => {
    setIsMounted(true);

    // Simple approach: hide all elements at first
    const textElements = [
      titleRef.current,
      nameRef.current,
      roleRef.current,
      taglineRef.current,
      percentageRef.current,
    ];

    textElements.forEach((el) => {
      if (el) gsap.set(el, { autoAlpha: 0 }); // Use autoAlpha to handle both visibility and opacity
    });

    return () => {
      setIsMounted(false);
    };
  }, []);

  // Animate the percentage counter
  useEffect(() => {
    if (!percentageRef.current || !isMounted) return;

    // Create a counter animation that accelerates then decelerates
    const counterTl = gsap.timeline({
      delay: 3.5, // Start after the tagline appears
    });

    // Animate the percentage counter value
    counterTl.to(
      {},
      {
        duration: 3, // Fixed duration to ensure it reaches 100%
        ease: "slow(0.3, 0.7, false)", // Custom ease with acceleration and deceleration
        onUpdate: function () {
          // Calculate progress (0-1) and convert to percentage (0-100)
          const progress = counterTl.progress();
          const calculatedValue = Math.min(100, Math.round(progress * 150)); // Multiply by 150 to make it go faster in the middle
          setPercentage(calculatedValue > 100 ? 100 : calculatedValue);
        },
      }
    );

    return () => {
      counterTl.kill();
    };
  }, [duration, isMounted]);

  // Main loader animation
  useGSAP(
    () => {
      if (!loaderRef.current || !contentRef.current || !isMounted) return;

      // Make sure the background is visible
      gsap.set(loaderRef.current, { autoAlpha: 1 });
      gsap.set(overlayRef.current, { autoAlpha: 1 });

      // Mark all text elements with reveal-text class for the curtain animation
      const allElements = [
        titleRef.current,
        nameRef.current,
        roleRef.current,
        taglineRef.current,
        percentageRef.current,
      ];

      allElements.forEach((el) => {
        if (el) {
          el.classList.add("reveal-text");
          // Make sure the element itself is visible (the curtain will cover it)
          gsap.set(el, { autoAlpha: 1 });
        }
      });

      // Set up curtains for all text elements
      if (contentRef.current) {
        setupCurtainForHiddenElements(contentRef.current, {
          textSelector: ".reveal-text",
          curtainColor: "var(--primary-background)",
        });
      }

      // Function to create a curtain reveal with delay
      const revealWithCurtain = (
        element: HTMLElement | null,
        delay: number
      ) => {
        if (!element) return null;

        // Apply the curtain reveal animation - returns a cleanup function, not a Tween
        return applyCurtainRevealToElement(element, {
          direction: "top",
          duration: 1.2,
          ease: "power3.out",
          delay: delay,
          curtainColor: "var(--primary-background)",
        });
      };

      // Create a sequence of curtain reveals with proper timing
      const titleAnim = revealWithCurtain(titleRef.current, 0.5);
      const nameAnim = revealWithCurtain(nameRef.current, 1.0);
      const roleAnim = revealWithCurtain(roleRef.current, 1.5);
      const taglineAnim = revealWithCurtain(taglineRef.current, 2.0);

      // Reveal percentage with a longer delay
      let percentageAnim: (() => void) | null = null;
      setTimeout(() => {
        if (percentageRef.current) {
          percentageAnim = revealWithCurtain(percentageRef.current, 0);
        }
      }, 3500);

      // Ensure loader stays visible long enough
      const minimumLoaderDuration = Math.max(7, duration);

      // Handle the fadeout
      const mainTl = gsap.timeline({
        delay: minimumLoaderDuration - 1.5,
        onComplete: () => {
          setAnimationComplete(true);
          setLoaderComplete(true);
          if (onComplete) onComplete();
        },
      });

      // Fade out elements
      mainTl.to(allElements.filter(Boolean), {
        opacity: 0,
        y: -20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.in",
      });

      // Fade out the overlay
      mainTl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        "+=0.3"
      );

      // Return cleanup function
      return () => {
        // Call the cleanup functions instead of using kill()
        if (titleAnim) titleAnim();
        if (nameAnim) nameAnim();
        if (roleAnim) roleAnim();
        if (taglineAnim) taglineAnim();
        if (percentageAnim) percentageAnim();
        mainTl.kill();
      };
    },
    { scope: loaderRef, dependencies: [isMounted] }
  );

  // Hide the loader from the DOM after fade out
  useEffect(() => {
    if (animationComplete && loaderRef.current) {
      // Short timeout to ensure animation is complete
      const timeout = setTimeout(() => {
        if (loaderRef.current) {
          loaderRef.current.style.display = "none";
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [animationComplete]);

  return (
    <div className="loader" ref={loaderRef}>
      <div className="loader-overlay" ref={overlayRef}>
        <div className="loader-content" ref={contentRef}>
          <div className="title-line" ref={titleRef}>
            PORTFOLIO
          </div>
          <div className="name-line" ref={nameRef}>
            EKAM'S
          </div>
          <div className="role-line" ref={roleRef}>
            DEVELOPER / DESIGNER
          </div>
          <div className="tagline-line" ref={taglineRef}>
            CRAFTING DIGITAL EXPERIENCES
          </div>
          <div className="percentage-line" ref={percentageRef}>
            {percentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
