import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RefObject } from "react";

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hook to apply curtain reveal animation to text elements
 * This animation reveals text by sliding a "curtain" away when the element is in view
 * @param containerRef Reference to the container element that holds the text to animate
 * @param options Configuration options for the animation
 */
export const useCurtainRevealAnimation = (
  containerRef: RefObject<HTMLElement>,
  options = {
    textSelector: ".reveal-text", // CSS selector for text elements to animate
    direction: "left", // Direction from which the curtain slides: 'left', 'right', 'top', 'bottom'
    duration: 0.8, // Duration of the animation in seconds
    stagger: 0.1, // Stagger timing between multiple elements
    ease: "power3.out", // Easing function
    start: "top 80%", // ScrollTrigger start position
    markers: false, // Show ScrollTrigger markers (for debugging)
    curtainColor: "var(--primary-background, #1a1a1a)", // Color of the curtain element
  }
) => {
  useGSAP(
    () => {
      // Early return if containerRef doesn't exist
      if (!containerRef.current) return;

      // Get all text elements to animate
      const textElements = containerRef.current.querySelectorAll(
        options.textSelector
      );

      // If no elements found, return early
      if (textElements.length === 0) return;

      textElements.forEach((element) => {
        // Create the wrapper and curtain elements
        setupCurtainElements(element as HTMLElement, options.curtainColor);

        // Set initial transform origin based on direction
        const curtain = (element as HTMLElement).parentElement?.querySelector(
          ".text-curtain"
        ) as HTMLElement;
        if (curtain) {
          if (options.direction === "left") {
            curtain.style.transformOrigin = "left center";
          } else if (options.direction === "right") {
            curtain.style.transformOrigin = "right center";
          } else if (options.direction === "top") {
            curtain.style.transformOrigin = "center top";
          } else if (options.direction === "bottom") {
            curtain.style.transformOrigin = "center bottom";
          }
        }
      });

      // Create the curtain reveal animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: options.start,
          markers: options.markers,
          toggleActions: "play none none none",
        },
      });

      // Apply the animation to each text element
      tl.to(
        containerRef.current.querySelectorAll(".text-curtain"),
        {
          x:
            options.direction === "left"
              ? "-100%"
              : options.direction === "right"
              ? "100%"
              : 0,
          y:
            options.direction === "top"
              ? "-100%"
              : options.direction === "bottom"
              ? "100%"
              : 0,
          duration: options.duration,
          stagger: options.stagger,
          ease: options.ease,
        },
        0
      );

      // Cleanup function
      return () => {
        // Kill ScrollTrigger instances to prevent memory leaks
        ScrollTrigger.getAll().forEach((st) => st.kill());

        // Remove curtain elements if needed
        textElements.forEach((element) => {
          const parent = element.parentElement;
          if (parent?.classList.contains("text-reveal-wrapper")) {
            // Unwrap the element
            const grandParent = parent.parentElement;
            if (grandParent) {
              grandParent.insertBefore(element, parent);
              grandParent.removeChild(parent);
            }
          }
        });
      };
    },
    { scope: containerRef }
  );
};

/**
 * Helper function to set up the DOM structure for curtain reveal
 * Creates a wrapper and curtain element for each text element
 */
const setupCurtainElements = (
  element: HTMLElement,
  curtainColor: string = "var(--primary-background, #1a1a1a)"
) => {
  // If already set up, skip
  if (element.parentElement?.classList.contains("text-reveal-wrapper")) {
    return;
  }

  // Save original styles to preserve them
  const originalStyles = {
    display: element.style.display || "",
    position: element.style.position || "",
    zIndex: element.style.zIndex || "",
  };

  // Get computed styles to determine proper display type
  const computedStyle = window.getComputedStyle(element);
  const displayStyle = computedStyle.display;

  // Set the element to inline-block if it's not already a block-level element
  if (displayStyle === "inline") {
    element.style.display = "inline-block";
  }

  // Create wrapper with proper dimensions and positioning
  const wrapper = document.createElement("div");
  wrapper.className = "text-reveal-wrapper";
  wrapper.style.position = "relative";
  wrapper.style.display =
    displayStyle === "inline" ? "inline-block" : displayStyle;
  wrapper.style.overflow = "hidden";
  wrapper.dataset.originalDisplay = originalStyles.display; // Store original display for later reference

  // Preserve margins and padding
  wrapper.style.margin = computedStyle.margin;
  wrapper.style.padding = computedStyle.padding;

  // Insert the wrapper before the element
  element.parentNode?.insertBefore(wrapper, element);

  // Move the element inside the wrapper
  wrapper.appendChild(element);

  // Reset element margins and adjust positioning
  element.style.margin = "0";
  element.style.position = "relative";
  element.style.zIndex = "1";

  // Create curtain element - this should completely cover the text
  const curtain = document.createElement("div");
  curtain.className = "text-curtain";
  curtain.style.position = "absolute";
  curtain.style.top = "0";
  curtain.style.left = "-1px"; // Slight overlap to prevent edge artifacts
  curtain.style.width = "calc(100% + 2px)"; // Add 2px to ensure full coverage
  curtain.style.height = "101%"; // Slightly taller to ensure complete coverage
  curtain.style.backgroundColor = curtainColor;
  curtain.style.zIndex = "2";

  // Ensure no transform is applied initially
  curtain.style.transform = "";

  // Add the curtain to the wrapper
  wrapper.appendChild(curtain);
};

/**
 * Apply curtain reveal to elements that already exist in the DOM
 * Use this for elements that are conditionally rendered or loaded dynamically
 */
export const applyCurtainRevealToElement = (
  element: HTMLElement,
  options = {
    direction: "left",
    duration: 0.8,
    ease: "power3.out",
    delay: 0,
    curtainColor: "var(--primary-background, #1a1a1a)",
  }
) => {
  // Setup the curtain elements
  setupCurtainElements(element, options.curtainColor);

  // Find the curtain element
  const curtainElement = element.parentElement?.querySelector(
    ".text-curtain"
  ) as HTMLElement;

  if (curtainElement) {
    // Create a GSAP context for this animation for better cleanup
    const ctx = gsap.context(() => {
      // Set the transform origin based on direction
      if (options.direction === "left") {
        curtainElement.style.transformOrigin = "left center";
      } else if (options.direction === "right") {
        curtainElement.style.transformOrigin = "right center";
      } else if (options.direction === "top") {
        curtainElement.style.transformOrigin = "center top";
      } else if (options.direction === "bottom") {
        curtainElement.style.transformOrigin = "center bottom";
      }

      // Animate the curtain
      return gsap.to(curtainElement, {
        x:
          options.direction === "left"
            ? "-101%" // Slightly more than 100% to ensure complete exit
            : options.direction === "right"
            ? "101%" // Slightly more than 100% to ensure complete exit
            : 0,
        y:
          options.direction === "top"
            ? "-101%" // Slightly more than 100% to ensure complete exit
            : options.direction === "bottom"
            ? "101%" // Slightly more than 100% to ensure complete exit
            : 0,
        duration: options.duration,
        ease: options.ease,
        delay: options.delay,
      });
    }, element.parentElement || element); // Scope to the parent element which contains the curtain

    // Return a function that will revert/kill the animation when called
    return () => ctx.revert();
  }

  return null;
};

/**
 * Sets up curtain animations for elements that might be in hidden containers
 * This is useful for elements in modal dialogs or off-screen menus that aren't visible on page load
 * @param container The container element that has the reveal-text elements
 * @param options Options for customizing the curtain setup
 */
export const setupCurtainForHiddenElements = (
  container: HTMLElement,
  options = {
    textSelector: ".reveal-text",
    curtainColor: "var(--primary-background, #1a1a1a)",
  }
) => {
  // Get all text elements to animate within the container
  const textElements = container.querySelectorAll(options.textSelector);

  // First ensure all elements have curtains
  textElements.forEach((element) => {
    const el = element as HTMLElement;

    // Remove any existing curtain wrappers to avoid nesting issues
    if (el.parentElement?.classList.contains("text-reveal-wrapper")) {
      const parent = el.parentElement;
      const grandParent = parent.parentElement;
      if (grandParent) {
        // Unwrap the element
        grandParent.insertBefore(el, parent);

        // Remove the old wrapper
        try {
          grandParent.removeChild(parent);
        } catch (e) {
          console.warn("Failed to remove old wrapper", e);
        }
      }
    }

    // Now set up fresh curtain elements
    setupCurtainElements(el, options.curtainColor);

    // Ensure curtain is in the initial position (fully covering the text)
    const curtain = el.parentElement?.querySelector(
      ".text-curtain"
    ) as HTMLElement;
    if (curtain) {
      // Create a context for consistent cleanup
      gsap.context(() => {
        // Reset any existing transforms to ensure proper starting state
        curtain.style.transform = "";
        gsap.set(curtain, { x: 0, y: 0, clearProps: "transformOrigin" });
      }, el.parentElement || el);
    }
  });

  return textElements;
};
