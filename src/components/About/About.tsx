import { useRef, useState, useEffect } from "react";
import "./About.scss";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAnimationContext } from "../../context/useAnimationContext";
import { aboutContent } from "./AboutData";
import Ekam3 from "../../assets/Ekam3.png";
import {
  setupCurtainForHiddenElements,
  applyCurtainRevealToElement,
} from "../../utils/animations/textRevealAnimations";
import ScrollIndicator from "../common/ScrollIndicator";
import AsciiPortrait from "./AsciiPortrait";

// Register the GSAP plugin
gsap.registerPlugin(useGSAP);

const About = () => {
  // Create refs for the elements we want to animate
  const aboutRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Content cycling state
  const [contentIndex, setContentIndex] = useState(0); // Start with index 0 from aboutContent
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Get the loader completion state from context
  const { loaderComplete, timing } = useAnimationContext();

  // Cleanup function to remove animation-related elements
  const cleanupAnimationElements = () => {
    if (!aboutRef.current) return;

    // Find all text elements with reveal-text class
    const textElements = aboutRef.current.querySelectorAll(".reveal-text");

    textElements.forEach((element) => {
      const el = element as HTMLElement;
      const parent = el.parentElement;

      // If wrapped in a text-reveal-wrapper, unwrap it
      if (parent?.classList.contains("text-reveal-wrapper")) {
        const grandParent = parent.parentElement;
        if (grandParent) {
          // Preserve the original margin-top
          const computedStyle = window.getComputedStyle(parent);
          el.style.marginTop = computedStyle.marginTop;

          // Unwrap the element
          grandParent.insertBefore(el, parent);
          grandParent.removeChild(parent);
        }
      }
    });
  };

  // Handle scroll content cycling
  useEffect(() => {
    if (!contentRef.current || !loaderComplete) return;

    // Force reset scrolling state after a certain time as a safety measure
    const safetyReset = () => {
      if (isScrolling) {
        setIsScrolling(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Don't process wheel events if already scrolling
      if (isScrolling) return;

      // Set scrolling state to debounce rapid scrolling
      setIsScrolling(true);

      // Determine scroll direction
      const direction = e.deltaY > 0 ? "down" : "up";

      // Calculate next content index
      let newIndex = contentIndex;
      if (direction === "down") {
        newIndex = (contentIndex + 1) % aboutContent.length;
      } else {
        newIndex =
          contentIndex === 0 ? aboutContent.length - 1 : contentIndex - 1;
      }

      // Handle content cycling animation
      updateContent(direction, newIndex);

      // Set a safety timeout to reset scrolling state if animation fails
      setTimeout(safetyReset, 1500);
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      // Store the initial touch position
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default to stop page scrolling
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null || isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchDiff = touchStartY - touchEndY;

      // Only trigger if the swipe is significant enough (prevents accidental triggers)
      if (Math.abs(touchDiff) < 30) return;

      setIsScrolling(true);

      // Determine swipe direction (negative = swipe down, positive = swipe up)
      const direction = touchDiff > 0 ? "down" : "up";

      // Calculate next content index
      let newIndex = contentIndex;
      if (direction === "down") {
        newIndex = (contentIndex + 1) % aboutContent.length;
      } else {
        newIndex =
          contentIndex === 0 ? aboutContent.length - 1 : contentIndex - 1;
      }

      // Handle content cycling animation
      updateContent(direction, newIndex);

      // Reset touch start position
      setTouchStartY(null);

      // Set a safety timeout to reset scrolling state if animation fails
      setTimeout(safetyReset, 1500);
    };

    // Function to handle content updating animation
    const updateContent = (direction: "up" | "down", newIndex: number) => {
      if (titleRef.current && paragraphRef.current) {
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            // Allow scrolling again after animation + a small buffer
            if (scrollTimeoutRef.current) {
              window.clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = window.setTimeout(() => {
              setIsScrolling(false);
            }, 200); // Small buffer after animation completes
          },
        });

        // Initial fade out current content
        tl.to([titleRef.current, paragraphRef.current], {
          opacity: 0,
          y: direction === "down" ? -20 : 20,
          duration: 0.4,
          stagger: 0.05,
          onComplete: () => {
            // Update content index after fade out
            setContentIndex(newIndex);

            // Reset position for entrance animation
            gsap.set([titleRef.current, paragraphRef.current], {
              y: direction === "down" ? 20 : -20,
            });
          },
        });

        // Fade in new content after a small delay
        tl.to([titleRef.current, paragraphRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.1,
        });
      }
    };

    const contentElement = textContainerRef.current;
    if (contentElement) {
      contentElement.addEventListener("wheel", handleWheel, { passive: false });
      contentElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      contentElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      contentElement.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("wheel", handleWheel);
        contentElement.removeEventListener("touchstart", handleTouchStart);
        contentElement.removeEventListener("touchmove", handleTouchMove);
        contentElement.removeEventListener("touchend", handleTouchEnd);
      }
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [textContainerRef, contentIndex, isScrolling, loaderComplete, touchStartY]);

  // Text reveal animations
  useGSAP(
    () => {
      if (!aboutRef.current || !loaderComplete) return;

      // Clean up any existing animation elements
      cleanupAnimationElements();

      // Get all text elements that need curtain reveal
      const textElements = aboutRef.current?.querySelectorAll(".reveal-text");
      if (!textElements || textElements.length === 0) return;

      // Phase 1: Setup all curtains but keep them covering the text
      const elements = setupCurtainForHiddenElements(aboutRef.current, {
        textSelector: ".reveal-text",
        curtainColor: "var(--primary-background)",
      });

      // Make sure curtains are properly positioned to cover text
      elements.forEach((element) => {
        const curtain = (element as HTMLElement).parentElement?.querySelector(
          ".text-curtain"
        ) as HTMLElement;
        if (curtain) {
          // Ensure curtain is covering the text
          curtain.style.transformOrigin = "left center";
        }
      });

      // Phase 2: After delay, animate the curtains away
      const timer = setTimeout(() => {
        textElements.forEach((element, index) => {
          // Apply the proper curtain reveal animation with staggered delay
          applyCurtainRevealToElement(element as HTMLElement, {
            direction: "left",
            duration: 1.5,
            ease: "power3.out",
            delay: index * timing.DEFAULT_STAGGER,
            curtainColor: "var(--primary-background)",
          });
        });

        // Note: We no longer need to animate the scroll indicator here
        // as that's now handled by the ScrollIndicator component
      }, timing.POST_LOADER_DELAY + 200); // Add a bit more delay after navbar animations

      return () => {
        clearTimeout(timer);
        cleanupAnimationElements();
      };
    },
    { dependencies: [loaderComplete, timing], scope: aboutRef }
  );

  return (
    <div className="about" ref={aboutRef}>
      <div className="about-content" ref={contentRef}>
        <div ref={textContainerRef} className="text-content-wrapper">
          <h2 ref={titleRef} className="reveal-text">
            {aboutContent[contentIndex].title}
          </h2>
          <p ref={paragraphRef} className="paragraph reveal-text">
            {aboutContent[contentIndex].description}
          </p>
        </div>

        {/* Use the new ScrollIndicator component */}
        <ScrollIndicator
          position="left"
          delay={timing.POST_LOADER_DELAY / 1000 + 0.7}
          direction="vertical"
        />
      </div>
      <div className="about-ascii">
        <AsciiPortrait imageSrc={Ekam3} />
      </div>
    </div>
  );
};

export default About;
