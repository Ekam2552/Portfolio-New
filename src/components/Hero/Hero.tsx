import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./Hero.scss";
import { useAnimationContext } from "../../context/useAnimationContext";
import {
  setupCurtainForHiddenElements,
  applyCurtainRevealToElement,
} from "../../utils/animations/textRevealAnimations";

import heroVideo from "../../assets/Hero_Video.mp4";

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// TODO: Create the Hero component

const Hero = () => {
  // Create refs for the elements we want to animate
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Get the loader completion state from context
  const { loaderComplete, timing } = useAnimationContext();

  // Cleanup function to remove animation-related elements
  const cleanupAnimationElements = () => {
    if (!heroRef.current) return;

    // Find all text elements with reveal-text class
    const textElements = heroRef.current.querySelectorAll(".reveal-text");

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

  // Animation for the video overlay opacity
  useGSAP(
    () => {
      if (!overlayRef.current || !loaderComplete) return;

      // Start with fully opaque overlay (opacity 1)
      gsap.set(overlayRef.current, { opacity: 1 });

      // After a short delay, animate to final opacity
      const timer = setTimeout(() => {
        gsap.to(overlayRef.current, {
          opacity: 0.7,
          duration: 2,
          ease: "power2.inOut",
        });
      }, timing.POST_LOADER_DELAY);

      return () => clearTimeout(timer);
    },
    { dependencies: [loaderComplete, timing], scope: heroRef }
  );

  // Text reveal animations after loader completes
  useGSAP(
    () => {
      if (!heroRef.current || !loaderComplete) return;

      // Clean up any existing animation elements
      cleanupAnimationElements();

      // Get all text elements that need curtain reveal
      const textElements = heroRef.current?.querySelectorAll(".reveal-text");
      if (!textElements || textElements.length === 0) return;

      // Phase 1: Setup all curtains but keep them covering the text
      const elements = setupCurtainForHiddenElements(heroRef.current, {
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
      }, timing.POST_LOADER_DELAY + 200); // Add a bit more delay after navbar animations

      return () => {
        clearTimeout(timer);
        cleanupAnimationElements();
      };
    },
    { dependencies: [loaderComplete, timing], scope: heroRef }
  );

  return (
    <div className="hero" ref={heroRef}>
      <div className="video-container">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay" ref={overlayRef}></div>
        <div className="hero-content">
          <div className="home-title">
            <h1 ref={titleRef} className="reveal-text">
              Full-Stack Innovation Meets Aesthetic Web Design.
            </h1>
            <p ref={paragraphRef} className="paragraph reveal-text">
              I'm Ekam, a Full-Stack Developer & Web Designer passionate about
              building high-performance applications with intuitive,
              pixel-perfect designs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
