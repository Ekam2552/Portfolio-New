import "./WorkCard.scss";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface WorkCardProps {
  title: string;
  techStack: string[];
  image: string;
  video: string;
  link: string;
  id: string; // Add id to identify each card uniquely
}

// Custom event name for card clicks
const CARD_CLICK_EVENT = "workcard_clicked";

// Create a custom event with card ID
const createCardClickEvent = (cardId: string) => {
  return new CustomEvent(CARD_CLICK_EVENT, {
    detail: { cardId },
    bubbles: true,
  });
};

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

const WorkCard = ({ title, techStack, video, link, id }: WorkCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Track if details are showing (for mobile/tablet)
  const [detailsShowing, setDetailsShowing] = useState(false);
  // Track if device is mobile/tablet
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Detect mobile/tablet device based on multiple factors
  useEffect(() => {
    const checkDevice = () => {
      // Better tablet detection that includes iPad Pro in landscape (1366x1024)
      const isSmallScreen = window.innerWidth <= 1100;
      const isTablet = isTouchDevice();

      // Log detection for debugging
      console.log("Device detection:", {
        isSmallScreen,
        isTablet,
        width: window.innerWidth,
        height: window.innerHeight,
        touchPoints: navigator.maxTouchPoints,
      });

      setIsMobileOrTablet(isSmallScreen || isTablet);
    };

    // Check initially
    checkDevice();

    // Listen for window resize events
    window.addEventListener("resize", checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // Listen for other cards being clicked
  useEffect(() => {
    // Only listen if on mobile/tablet and details are showing
    if (!isMobileOrTablet) return;

    const handleOtherCardClick = (e: Event) => {
      const customEvent = e as CustomEvent;
      // If another card was clicked (not this one), hide details
      if (
        customEvent.detail &&
        customEvent.detail.cardId !== id &&
        detailsShowing
      ) {
        hideDetails();
      }
    };

    // Add event listener
    document.addEventListener(CARD_CLICK_EVENT, handleOtherCardClick);

    // Cleanup
    return () => {
      document.removeEventListener(CARD_CLICK_EVENT, handleOtherCardClick);
    };
  }, [isMobileOrTablet, detailsShowing, id]);

  // Handle outside clicks to close the details panel
  useEffect(() => {
    // Only add the listener if details are showing and on mobile/tablet
    if (!detailsShowing || !isMobileOrTablet) return;

    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the click was outside this card
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        hideDetails();
      }
    };

    // Add global click listener
    document.addEventListener("click", handleOutsideClick);

    // Clean up
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [detailsShowing, isMobileOrTablet]);

  useGSAP(() => {
    // Initial state - hidden
    gsap.set(detailsRef.current, { opacity: 0, x: "100%" });
    gsap.set(overlayRef.current, { opacity: 0 });
  }, []);

  // Show details
  const showDetails = () => {
    // Animate details in
    gsap.to(detailsRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    // Animate frosted glass overlay
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    setDetailsShowing(true);
  };

  // Hide details
  const hideDetails = () => {
    // Animate details out
    gsap.to(detailsRef.current, {
      opacity: 0,
      x: "100%",
      duration: 0.4,
      ease: "power2.in",
    });
    // Animate frosted glass out
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });

    setDetailsShowing(false);
  };

  // Handle mouse enter (desktop only)
  const handleMouseEnter = () => {
    if (!isMobileOrTablet) {
      showDetails();
    }
  };

  // Handle mouse leave (desktop only)
  const handleMouseLeave = () => {
    if (!isMobileOrTablet) {
      hideDetails();
    }
  };

  // Handle click action based on device type and state
  const handleClick = (e: React.MouseEvent) => {
    // Stop propagation to prevent the outside click handler from triggering
    e.stopPropagation();

    // Force touch behavior for iPads and other tablets regardless of screen width
    const forceTouch =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      /Android/.test(navigator.userAgent);

    if (isMobileOrTablet || forceTouch) {
      // Dispatch custom event to notify other cards
      document.dispatchEvent(createCardClickEvent(id));

      // On mobile/tablet: first click shows details, second click navigates
      if (detailsShowing) {
        // Navigate to link on second click
        window.open(
          link.startsWith("http") ? link : `https://${link}`,
          "_blank"
        );
      } else {
        // Show details on first click
        showDetails();
      }
    } else {
      // On desktop: click always navigates
      window.open(link.startsWith("http") ? link : `https://${link}`, "_blank");
    }
  };

  return (
    <div
      className={`work-card ${detailsShowing ? "details-showing" : ""}`}
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video src={video} autoPlay muted loop />
      <div ref={overlayRef} className="frosted-overlay" />
      <div className="card-details" ref={detailsRef}>
        <h4>{title}</h4>
        <div className="card-details-container">
          {techStack.map((tech, index) => (
            <p key={index} className="paragraph">
              {tech}
            </p>
          ))}
        </div>
        {isMobileOrTablet && detailsShowing && (
          <div className="tap-hint">Tap again to open project</div>
        )}
      </div>
    </div>
  );
};

export default WorkCard;
