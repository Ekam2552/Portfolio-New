import "./Work.scss";
import ScrollIndicator from "../common/ScrollIndicator";
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAnimationContext } from "../../context/useAnimationContext";
import { applyCurtainRevealToElement } from "../../utils/animations/textRevealAnimations";

// WorkCard component and data
import WorkCard from "./WorkCard/WorkCard";
import workData from "./WorkData";

// Function to detect if device is mobile or tablet
const isTouchDevice = () => {
  // Check for touch capability
  const hasTouchPoints =
    navigator.maxTouchPoints > 0 || "ontouchstart" in window;

  // iPad detection (iPads with newer iOS report as desktop Safari)
  const isIPad =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // Android tablet detection
  const isAndroidTablet =
    /Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent);

  // Broader tablet viewport detection (includes larger iPads in landscape mode)
  const isTabletViewport =
    window.innerWidth <= 1366 || window.innerHeight <= 1024;

  return hasTouchPoints && (isTabletViewport || isIPad || isAndroidTablet);
};

const Work = () => {
  // Create refs for animations
  const workRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsHolderRef = useRef<HTMLDivElement>(null);

  // State for screen size to determine ScrollIndicator direction
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  // State to detect landscape mode (low height)
  const [isLandscape, setIsLandscape] = useState(false);

  // State to track window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Get animation context
  const { loaderComplete, timing } = useAnimationContext();

  // Update screen size state when window resizes
  useEffect(() => {
    const handleResize = () => {
      // Update window width
      setWindowWidth(window.innerWidth);

      // Better tablet detection that includes iPad Pro in landscape (1366x1024)
      const isSmallScreen = window.innerWidth <= 1100;
      const isTablet = isTouchDevice();
      setIsTabletOrMobile(isSmallScreen || isTablet);

      // Update landscape detection
      setIsLandscape(window.innerHeight <= 450);
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Cleanup function to remove animation-related elements
  const cleanupAnimationElements = () => {
    if (!workRef.current) return;

    // Find all text elements with reveal-text class
    const textElements = workRef.current.querySelectorAll(".reveal-text");

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

  // Text reveal animation for heading
  useGSAP(
    () => {
      if (!workRef.current || !loaderComplete || !headingRef.current) return;

      // Clean up any existing animation elements
      cleanupAnimationElements();

      // Apply curtain reveal to heading
      applyCurtainRevealToElement(headingRef.current, {
        direction: "left",
        duration: 1.5,
        ease: "power3.out",
        delay: timing.POST_LOADER_DELAY / 1000,
        curtainColor: "var(--primary-background)",
      });

      return () => {
        cleanupAnimationElements();
      };
    },
    { dependencies: [loaderComplete, timing], scope: workRef }
  );

  // Fade-in animation for cards
  useGSAP(
    () => {
      if (!cardsHolderRef.current || !loaderComplete) return;

      // Get all cards
      const cards = cardsHolderRef.current.querySelectorAll(".work-card");

      // Set initial state - hidden
      gsap.set(cards, {
        opacity: 0,
        y: 20,
      });

      // Create staggered animation
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: timing.POST_LOADER_DELAY / 1000 + 0.5, // Start after heading animation
      });
    },
    { dependencies: [loaderComplete, timing], scope: cardsHolderRef }
  );

  // Only show ScrollIndicator if not in landscape mode
  const shouldShowIndicator = workData.length > 2 && !isLandscape;

  return (
    <div className="work" ref={workRef}>
      <h1 ref={headingRef} className="reveal-text">
        Work
      </h1>
      <div className="cards-holder" ref={cardsHolderRef}>
        {workData.map((work) => (
          <WorkCard
            key={work.id}
            id={work.id.toString()}
            title={work.title || ""}
            techStack={work.techStack || []}
            image={work.image || ""}
            video={work.video || ""}
            link={work.link || ""}
          />
        ))}
      </div>

      {/* Only show ScrollIndicator if not in landscape mode */}
      {shouldShowIndicator && (
        <ScrollIndicator
          position="left"
          delay={0.5}
          direction={windowWidth > 1100 ? "horizontal" : "vertical"}
          className={isTabletOrMobile ? "mobile-indicator" : ""}
        />
      )}
    </div>
  );
};

export default Work;
