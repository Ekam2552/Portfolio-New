import { useRef, useState, useEffect } from "react";
import "./About.scss";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAnimationContext } from "../../context/useAnimationContext";
import { aboutContent, aboutImages } from "./AboutData";
import {
  setupCurtainForHiddenElements,
  applyCurtainRevealToElement,
} from "../../utils/animations/textRevealAnimations";
import ScrollIndicator from "../common/ScrollIndicator";

// Register the GSAP plugin
gsap.registerPlugin(useGSAP);

const About = () => {
  // Create refs for the elements we want to animate
  const aboutRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Image cycling state
  const [currentImageIndex, setCurrentImageIndex] = useState(2); // Start with the default image (index 2)
  const [nextImageIndex, setNextImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    };

    // Touch event handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
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

    const contentElement = contentRef.current;
    contentElement.addEventListener("wheel", handleWheel, { passive: false });
    contentElement.addEventListener("touchstart", handleTouchStart);
    contentElement.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("wheel", handleWheel);
        contentElement.removeEventListener("touchstart", handleTouchStart);
        contentElement.removeEventListener("touchend", handleTouchEnd);
      }
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [contentRef, contentIndex, isScrolling, loaderComplete, touchStartY]);

  // Create next image element for smoother transitions
  useEffect(() => {
    if (!imageContainerRef.current) return;

    // Create a new image element for the next image (if it doesn't exist)
    if (!imageContainerRef.current.querySelector(".next-image")) {
      const nextImage = document.createElement("img");
      nextImage.className = "next-image";
      nextImage.alt = "Ekam Next";
      nextImage.src = aboutImages[nextImageIndex].image;

      // Force consistent positioning for both desktop and mobile
      nextImage.style.position = "absolute";
      nextImage.style.top = "50%";
      nextImage.style.left = "50%";
      nextImage.style.transform = "translate(-50%, -50%)";
      nextImage.style.maxWidth = "100%";
      nextImage.style.maxHeight = "100%";
      nextImage.style.objectFit = "contain";
      nextImage.style.opacity = "0";
      nextImage.style.zIndex = "1";

      imageContainerRef.current.appendChild(nextImage);
    }
  }, [nextImageIndex]);

  // Force early positioning of the image element as soon as component mounts
  useEffect(() => {
    if (imageRef.current) {
      // Apply correct positioning before any animations start
      imageRef.current.style.position = "absolute";
      imageRef.current.style.top = "50%";
      imageRef.current.style.left = "50%";
      imageRef.current.style.transform = "translate(-50%, -50%)";
      imageRef.current.style.opacity = "0";
      imageRef.current.style.maxWidth = "100%";
      imageRef.current.style.maxHeight = "100%";
      imageRef.current.style.width = "auto";
      imageRef.current.style.height = "auto";
      imageRef.current.style.objectFit = "contain";
    }
  }, []);

  // Image opacity animation
  useGSAP(
    () => {
      if (!imageRef.current || !loaderComplete) return;

      // Set consistent positioning immediately when component mounts
      gsap.set(imageRef.current, {
        opacity: 0,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "100%",
        maxHeight: "100%",
      });

      // After a short delay, animate to final opacity
      const timer = setTimeout(() => {
        gsap.to(imageRef.current, {
          opacity: 1,
          duration: 2,
          ease: "power2.inOut",
        });
      }, timing.POST_LOADER_DELAY);

      return () => clearTimeout(timer);
    },
    { dependencies: [loaderComplete, timing], scope: aboutRef }
  );

  // Image cycling animation
  useGSAP(
    () => {
      if (!imageContainerRef.current || !loaderComplete || isTransitioning)
        return;

      // Create a timer to cycle through images
      // This timer waits 5 seconds before starting any transition
      const cycleTimer = setTimeout(() => {
        // Use sequential approach
        const newIndex = (currentImageIndex + 1) % aboutImages.length;

        // Set the next image index
        setNextImageIndex(newIndex);

        // Set transitioning flag
        setIsTransitioning(true);
      }, 5000); // Wait 5 seconds before starting any transition

      return () => clearTimeout(cycleTimer);
    },
    {
      dependencies: [loaderComplete, currentImageIndex, isTransitioning],
      scope: aboutRef,
    }
  );

  // Handle the actual transition between images
  useGSAP(
    () => {
      if (!imageContainerRef.current || !isTransitioning) return;

      const nextImage = imageContainerRef.current.querySelector(
        ".next-image"
      ) as HTMLImageElement;
      const currentImage = imageContainerRef.current.querySelector(
        ".current-image"
      ) as HTMLImageElement;
      if (!nextImage || !currentImage) return;

      // Update the next image source
      nextImage.src = aboutImages[nextImageIndex].image;

      // Force consistent positioning for both images
      gsap.set([currentImage, nextImage], {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "100%",
        maxHeight: "100%",
      });

      // Create a timeline for smooth transition with clear pauses
      const tl = gsap.timeline({
        onComplete: () => {
          // When transition completes, update the current image and reset transition state
          setCurrentImageIndex(nextImageIndex);
          setIsTransitioning(false);

          // Reset the next image opacity
          if (nextImage) {
            gsap.set(nextImage, {
              opacity: 0,
            });
          }

          // Update the main image src
          if (imageRef.current) {
            imageRef.current.src = aboutImages[nextImageIndex].image;

            // Reset the main image to full opacity while maintaining position
            gsap.set(imageRef.current, {
              opacity: 1,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "100%",
              maxHeight: "100%",
            });
          }
        },
      });

      // Phase 1: Fade out current image completely
      tl.to(currentImage, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
      });

      // Pause for 1 second between fade out and fade in
      tl.to({}, { duration: 1 });

      // Phase 3: Fade in the next image
      tl.to(nextImage, {
        opacity: 1,
        duration: 0.7,
        ease: "power2.inOut",
      });
    },
    {
      dependencies: [isTransitioning, nextImageIndex],
      scope: imageContainerRef,
    }
  );

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
        <h2 ref={titleRef} className="reveal-text">
          {aboutContent[contentIndex].title}
        </h2>
        <p ref={paragraphRef} className="paragraph reveal-text">
          {aboutContent[contentIndex].description}
        </p>

        {/* Use the new ScrollIndicator component */}
        <ScrollIndicator
          position="left"
          delay={timing.POST_LOADER_DELAY / 1000 + 0.7}
          direction="vertical"
        />
      </div>
      <div className="about-images" ref={imageContainerRef}>
        <img
          ref={imageRef}
          src={aboutImages[currentImageIndex].image}
          alt="Ekam"
          className="current-image"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0, // Start invisible to prevent flash
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default About;
