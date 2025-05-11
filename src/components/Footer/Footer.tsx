import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./Footer.scss";
import { useAnimationContext } from "../../context/useAnimationContext";
import {
  setupCurtainForHiddenElements,
  applyCurtainRevealToElement,
} from "../../utils/animations/textRevealAnimations";

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const { loaderComplete, timing } = useAnimationContext();

  // Initially hide all reveal-text elements
  useEffect(() => {
    if (footerRef.current) {
      const textElements = footerRef.current.querySelectorAll(".reveal-text");
      textElements.forEach((element) => {
        (element as HTMLElement).style.visibility = "hidden";
      });
    }
  }, []);

  // Cleanup function to remove animation-related elements
  const cleanupAnimationElements = () => {
    if (!footerRef.current) return;

    // Find all text elements with reveal-text class
    const textElements = footerRef.current.querySelectorAll(".reveal-text");

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

  // Text reveal animations
  useGSAP(
    () => {
      if (!footerRef.current || !loaderComplete) return;

      // Clean up any existing animation elements
      cleanupAnimationElements();

      // Get all text elements that need curtain reveal
      const textElements = footerRef.current?.querySelectorAll(".reveal-text");
      if (!textElements || textElements.length === 0) return;

      // Make all elements visible before setting up curtains
      textElements.forEach((element) => {
        (element as HTMLElement).style.visibility = "visible";
      });

      // Phase 1: Setup all curtains but keep them covering the text
      const elements = setupCurtainForHiddenElements(footerRef.current, {
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

      // Phase 2: Apply the curtain reveal animation
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

      return () => {
        cleanupAnimationElements();
      };
    },
    { dependencies: [loaderComplete, timing], scope: footerRef }
  );

  // Link hover and click animations - run after reveal animations are completed
  useGSAP(
    () => {
      if (!footerRef.current) return;

      // Wait until reveal animations have likely completed
      const animationCompletionDelay = 1000 + 5 * timing.DEFAULT_STAGGER * 1000;

      setTimeout(() => {
        const links = footerRef.current!.querySelectorAll(".link");

        links.forEach((link) => {
          // Find the actual link element (could be the original or the one inside the curtain wrapper)
          const actualLink = link.classList.contains("text-reveal-wrapper")
            ? link.querySelector(".link")
            : link;

          if (!actualLink) return;

          // Apply hover animation
          actualLink.addEventListener("mouseenter", () => {
            gsap.to(actualLink, {
              y: -2,
              duration: 0.2,
              ease: "power1.out",
            });
          });

          // Reset on mouse leave
          actualLink.addEventListener("mouseleave", () => {
            gsap.to(actualLink, {
              y: 0,
              duration: 0.2,
              ease: "power1.out",
            });
          });

          // Click animation - slight bounce
          actualLink.addEventListener("click", () => {
            gsap
              .timeline()
              .to(actualLink, {
                scale: 0.9,
                duration: 0.1,
                ease: "power1.in",
              })
              .to(actualLink, {
                scale: 1.1,
                duration: 0.1,
                ease: "back.out(1.5)",
              })
              .to(actualLink, {
                scale: 1,
                duration: 0.2,
                ease: "power1.out",
              });
          });
        });
      }, animationCompletionDelay);
    },
    { scope: footerRef, dependencies: [loaderComplete, timing] }
  );

  return (
    <div className="footer" ref={footerRef}>
      <div className="footer-upper">
        <h1 className="reveal-text">
          Designed with passion, coded with precision.
        </h1>
      </div>
      <div className="footer-lower">
        <p className="caption reveal-text">© 2025 Ekam's Portfolio</p>
        <div className="footer-links">
          <a
            href={import.meta.env.VITE_LINKEDIN_URL}
            className="link linkedin reveal-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href={import.meta.env.VITE_INSTAGRAM_URL}
            className="link instagram reveal-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href={import.meta.env.VITE_GITHUB_URL}
            className="link github reveal-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href={`mailto:${import.meta.env.VITE_EMAIL_ADDRESS}`}
            className="link mail reveal-text"
          >
            Mail
          </a>
          <a
            href={`tel:${import.meta.env.VITE_PHONE_NUMBER}`}
            className="link phone reveal-text"
          >
            Phone
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
