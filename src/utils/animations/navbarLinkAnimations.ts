import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { RefObject, useRef } from "react";

/**
 * Digital Noise Transition animation for navbar links
 * Creates a futuristic glitch/noise effect on hover and click
 */
export const useNavbarLinkAnimations = (navbarRef: RefObject<HTMLElement>) => {
  // Reference to store active animations for cleanup
  const activeAnimations = useRef<(gsap.core.Tween | gsap.core.Timeline)[]>([]);

  // Function to clear any active animations
  const clearAnimations = () => {
    activeAnimations.current.forEach((anim) => anim.kill());
    activeAnimations.current = [];
  };

  useGSAP(
    () => {
      // Early return if navbarRef doesn't exist
      if (!navbarRef.current) return;

      // Get all navbar links
      const links = navbarRef.current.querySelectorAll(".link");

      // Apply animations to each link
      links.forEach((link) => {
        // Create a container for the glitch effect
        const linkElement = link as HTMLElement;
        const linkText = linkElement.textContent || "";

        // Create glitch elements
        const glitchContainer = document.createElement("span");
        glitchContainer.className = "glitch-container";
        glitchContainer.style.position = "absolute";
        glitchContainer.style.top = "0";
        glitchContainer.style.left = "0";
        glitchContainer.style.width = "100%";
        glitchContainer.style.height = "100%";
        glitchContainer.style.overflow = "hidden";
        glitchContainer.style.pointerEvents = "none"; // Don't interfere with clicks
        glitchContainer.style.opacity = "0";
        glitchContainer.style.zIndex = "-1";

        // Create multiple noise layers for the glitch effect
        for (let i = 0; i < 3; i++) {
          const noiseLayer = document.createElement("span");
          noiseLayer.className = `noise-layer noise-layer-${i}`;
          noiseLayer.textContent = linkText;
          noiseLayer.style.position = "absolute";
          noiseLayer.style.top = "0";
          noiseLayer.style.left = "0";
          noiseLayer.style.width = "100%";
          noiseLayer.style.height = "100%";
          noiseLayer.style.opacity = "0";
          glitchContainer.appendChild(noiseLayer);
        }

        // Set link to relative positioning if not already set
        if (getComputedStyle(linkElement).position === "static") {
          linkElement.style.position = "relative";
        }

        // Add glitch container to the link
        linkElement.appendChild(glitchContainer);

        // Hover animation
        linkElement.addEventListener("mouseenter", () => {
          clearAnimations();

          // Show the glitch container
          const showGlitch = gsap.to(glitchContainer, {
            opacity: 1,
            duration: 0.2,
            ease: "power1.inOut",
          });
          activeAnimations.current.push(showGlitch);

          // Animate each noise layer with random shifts
          const noiseLayers = glitchContainer.querySelectorAll(".noise-layer");
          noiseLayers.forEach((layer) => {
            const layerAnim = gsap.to(layer, {
              opacity: () => Math.random() * 0.4 + 0.1, // Random opacity
              x: () => (Math.random() - 0.5) * 5, // Random slight x shift
              y: () => (Math.random() - 0.5) * 5, // Random slight y shift
              color: "var(--optional-pop-accent-for-links-and-buttons)",
              duration: 0.1,
              repeat: -1, // Infinite
              repeatRefresh: true, // Use new random values on each repeat
              ease: "none",
            });
            activeAnimations.current.push(layerAnim);
          });
        });

        // Remove hover animation
        linkElement.addEventListener("mouseleave", () => {
          clearAnimations();

          // Hide the glitch container
          const hideGlitch = gsap.to(glitchContainer, {
            opacity: 0,
            duration: 0.3,
            ease: "power1.out",
          });
          activeAnimations.current.push(hideGlitch);
        });

        // Click animation (more intense version of hover)
        linkElement.addEventListener("click", () => {
          clearAnimations();

          // More pronounced glitch effect
          const clickGlitch = gsap.timeline();

          // First make the entire link flicker
          clickGlitch
            .to(linkElement, {
              opacity: 0.7,
              duration: 0.05,
              ease: "none",
            })
            .to(linkElement, {
              opacity: 1,
              duration: 0.05,
              ease: "none",
            })
            .to(linkElement, {
              opacity: 0.8,
              duration: 0.05,
              ease: "none",
            })
            .to(linkElement, {
              opacity: 1,
              duration: 0.05,
              ease: "none",
            });

          // Then add more intense glitch effects
          const noiseLayers = glitchContainer.querySelectorAll(".noise-layer");
          clickGlitch.to(glitchContainer, { opacity: 1, duration: 0.05 }, 0);

          noiseLayers.forEach((layer, index) => {
            clickGlitch.to(
              layer,
              {
                opacity: 0.5,
                x: () => (Math.random() - 0.5) * 15, // Larger shifts
                y: () => (Math.random() - 0.5) * 10,
                color: "var(--optional-pop-accent-for-links-and-buttons)",
                duration: 0.1,
                ease: "none",
              },
              0.05 * index
            );
          });

          // Return to normal
          clickGlitch.to(glitchContainer, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          });

          activeAnimations.current.push(clickGlitch);
        });
      });

      // Cleanup function to remove event listeners and animations
      return () => {
        clearAnimations();

        links.forEach((link) => {
          const linkElement = link as HTMLElement;
          const glitchContainer =
            linkElement.querySelector(".glitch-container");
          if (glitchContainer) {
            linkElement.removeChild(glitchContainer);
          }
        });
      };
    },
    { scope: navbarRef }
  ); // Scope to the navbar element

  // Return any additional controls if needed
  return {
    clearAnimations,
  };
};

/**
 * Apply a digital noise animation to the active link
 * @param linkElement The active link element
 */
export const applyActiveLinkAnimation = (linkElement: HTMLElement) => {
  // Create a GSAP context for better cleanup and memory management
  const ctx = gsap.context(() => {
    // Add a subtle persistent animation to the active link
    gsap.to(linkElement, {
      color: "var(--optional-pop-accent-for-links-and-buttons)",
      fontWeight: "var(--weight-medium)",
      duration: 0.3,
      ease: "power1.out",
    });

    // Add a subtle accent underline
    const underline = document.createElement("span");
    underline.className = "active-link-underline";
    underline.style.position = "absolute";
    underline.style.bottom = "-2px";
    underline.style.left = "0";
    underline.style.width = "0%";
    underline.style.height = "1px";
    underline.style.backgroundColor =
      "var(--optional-pop-accent-for-links-and-buttons)";

    // Set link to relative positioning if not already set
    if (getComputedStyle(linkElement).position === "static") {
      linkElement.style.position = "relative";
    }

    linkElement.appendChild(underline);

    // Animate the underline
    gsap.to(underline, {
      width: "100%",
      duration: 0.4,
      ease: "power2.out",
    });
  }, linkElement); // Scope the context to the link element

  // Return a cleanup function
  return () => {
    // Find the underline element
    const underline = linkElement.querySelector(".active-link-underline");

    if (underline) {
      // Create a context for cleanup animation
      const cleanupCtx = gsap.context(() => {
        gsap.to(underline, {
          width: "0%",
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            if (linkElement.contains(underline)) {
              linkElement.removeChild(underline);
            }
          },
        });

        // Reset the link style
        gsap.to(linkElement, {
          color: "var(--primary-text)",
          fontWeight: "var(--weight-regular)",
          duration: 0.3,
          ease: "power1.out",
        });
      }, linkElement);

      // Return another cleanup function that will kill all animations
      return () => {
        cleanupCtx.revert(); // This kills all animations in the context
        ctx.revert(); // This kills all animations in the main context
      };
    }

    // If no underline found, just kill the main context
    ctx.revert();
  };
};
