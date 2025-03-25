import { useRef, useState } from "react";
import "./Navbar.scss";
import Overlay from "./Overlay";
import HamburgerButton from "./HamburgerButton";
import {
  useNavbarLinkAnimations,
  applyActiveLinkAnimation,
} from "../../utils/animations/navbarLinkAnimations";
import {
  setupCurtainForHiddenElements,
  applyCurtainRevealToElement,
} from "../../utils/animations/textRevealAnimations";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAnimationContext } from "../../context/AnimationContext";
import { SectionType } from "../../App";

// Register the GSAP plugin
gsap.registerPlugin(useGSAP);

// TODO: Add a text reveal animation to the navbar title and links.

interface NavbarProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const Navbar = ({ activeSection, onSectionChange }: NavbarProps) => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const activeLinkCleanupRef = useRef<(() => void) | null>(null);

  // Use the animation context to know when to start animations
  const { loaderComplete, timing } = useAnimationContext();

  // Use the navbar link animations hook with type assertion
  useNavbarLinkAnimations(navbarRef as unknown as React.RefObject<HTMLElement>);

  // Curtain reveal animation for navbar elements
  useGSAP(
    () => {
      if (!navbarRef.current || !loaderComplete) return;

      // Get all text elements that need curtain reveal
      const textElements = navbarRef.current?.querySelectorAll(".reveal-text");
      if (!textElements || textElements.length === 0) return;

      // Phase 1: Setup all curtains but keep them covering the text
      // Use the setup function to create curtain elements properly
      const elements = setupCurtainForHiddenElements(navbarRef.current, {
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
          gsap.set(curtain, { x: 0, y: 0 });
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
      }, timing.POST_LOADER_DELAY);

      return () => clearTimeout(timer);
    },
    { dependencies: [loaderComplete, timing], scope: navbarRef }
  );

  // Function to handle link clicks
  const handleLinkClick = (linkName: SectionType) => {
    onSectionChange(linkName);
    // Close mobile menu if it's open
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  // Active link animation
  useGSAP(
    () => {
      // Clean up previous animation if it exists
      if (activeLinkCleanupRef.current) {
        activeLinkCleanupRef.current();
        activeLinkCleanupRef.current = null;
      }

      // Apply animation to the new active link
      if (navbarRef.current) {
        const activeLinkElement = navbarRef.current.querySelector(
          `.link.${activeSection.toLowerCase()}`
        ) as HTMLElement;
        if (activeLinkElement) {
          // Store the cleanup function for later use
          activeLinkCleanupRef.current =
            applyActiveLinkAnimation(activeLinkElement);
        }
      }

      // Clean up on component unmount
      return () => {
        if (activeLinkCleanupRef.current) {
          activeLinkCleanupRef.current();
        }
      };
    },
    { dependencies: [activeSection], scope: navbarRef }
  );

  // Mobile menu animation
  useGSAP(
    () => {
      if (!mobileMenuRef.current) return;

      // Use GSAP to animate the menu with enhanced performance
      if (menuOpen) {
        // First, ensure the menu is visible but off-screen so curtains can be set up properly
        gsap.set(mobileMenuRef.current, {
          x: "100%", // Start off-screen
          opacity: 1, // Make visible
          pointerEvents: "auto",
        });

        // Pre-setup all curtain elements before any animation
        if (mobileMenuRef.current) {
          // Force layout recalculation to ensure elements are properly measured
          mobileMenuRef.current.getBoundingClientRect();

          // Set up curtains for all link elements
          const mobileLinks = setupCurtainForHiddenElements(
            mobileMenuRef.current,
            {
              textSelector: ".reveal-text",
              curtainColor: "var(--primary-background)",
            }
          );

          // Force each curtain to be visible and covering text
          mobileLinks.forEach((link) => {
            const curtain = (link as HTMLElement).parentElement?.querySelector(
              ".text-curtain"
            ) as HTMLElement;
            if (curtain) {
              gsap.set(curtain, { x: 0, y: 0, clearProps: "transform" });
            }
          });
        }

        // Now animate the menu to slide in
        gsap.to(mobileMenuRef.current, {
          x: "0%",
          duration: 0.4,
          ease: "power3.out",
          onComplete: () => {
            // Once menu is fully open, animate each curtain to reveal text
            if (mobileMenuRef.current) {
              const mobileLinks =
                mobileMenuRef.current.querySelectorAll(".reveal-text");

              // Define different directions for each link
              const directions = ["left", "left", "left", "left"];

              // Create a timeline for staggered animation
              const curtainTl = gsap.timeline();

              mobileLinks.forEach((link, index) => {
                const curtain =
                  link.parentElement?.querySelector(".text-curtain");
                if (curtain) {
                  // Set transform origin based on direction
                  const direction = directions[index % directions.length];
                  const curtainEl = curtain as HTMLElement;

                  if (direction === "left") {
                    curtainEl.style.transformOrigin = "left center";
                  } else if (direction === "right") {
                    curtainEl.style.transformOrigin = "right center";
                  } else if (direction === "top") {
                    curtainEl.style.transformOrigin = "center top";
                  } else if (direction === "bottom") {
                    curtainEl.style.transformOrigin = "center bottom";
                  }

                  // Add to timeline with staggered delay
                  curtainTl.to(
                    curtainEl,
                    {
                      x:
                        direction === "left"
                          ? "-100%"
                          : direction === "right"
                          ? "100%"
                          : 0,
                      y:
                        direction === "top"
                          ? "-100%"
                          : direction === "bottom"
                          ? "100%"
                          : 0,
                      duration: 0.6,
                      ease: "power3.out",
                    },
                    index * 0.1
                  ); // Stagger delay
                }
              });
            }
          },
        });

        // Prevent scrolling on body when menu is open
        document.body.style.overflow = "hidden";
      } else {
        // Reset curtain positions immediately for next opening
        if (mobileMenuRef.current) {
          const mobileCurtains =
            mobileMenuRef.current.querySelectorAll(".text-curtain");

          // Create a timeline for smooth transitions
          const tl = gsap.timeline();

          // First move curtains back to cover text (if they're not already)
          tl.to(mobileCurtains, {
            x: 0,
            y: 0,
            duration: 0.2,
            ease: "power1.in",
          });

          // Then slide the menu off screen
          tl.to(
            mobileMenuRef.current,
            {
              x: "100%",
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => {
                // Disable pointer events when animation completes
                if (mobileMenuRef.current) {
                  mobileMenuRef.current.style.pointerEvents = "none";
                }
              },
            },
            0.1
          ); // Start slightly after curtains begin moving
        }

        // Re-enable scrolling on body when menu is closed
        document.body.style.overflow = "";
      }
    },
    { dependencies: [menuOpen], scope: mobileMenuRef }
  );

  // Handle window resize - close mobile menu if screen becomes large
  useGSAP(
    () => {
      const handleResize = () => {
        if (window.innerWidth > 768 && menuOpen) {
          setMenuOpen(false);
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { dependencies: [menuOpen], scope: navbarRef }
  );

  // Log when hamburger state changes to verify it's working
  useGSAP(
    () => {
      console.log("Menu state:", menuOpen ? "open" : "closed");
    },
    { dependencies: [menuOpen], scope: navbarRef }
  );

  return (
    <div className="navbar" ref={navbarRef}>
      {/* The Overlay component is positioned absolutely and will ignore auto layout */}
      <Overlay menuOpen={menuOpen} />

      <h2 className="reveal-text">Ekam's Portfolio</h2>

      {/* Desktop navigation links */}
      <div className="navbar-links desktop-nav">
        <a
          className={`link reveal-text ${
            activeSection === "Home" ? "active" : ""
          }`}
          onClick={() => handleLinkClick("Home")}
        >
          Home
        </a>
        <a
          className={`link reveal-text ${
            activeSection === "About" ? "active" : ""
          }`}
          onClick={() => handleLinkClick("About")}
        >
          About
        </a>
        <a
          className={`link reveal-text ${
            activeSection === "Projects" ? "active" : ""
          }`}
          onClick={() => handleLinkClick("Projects")}
        >
          Projects
        </a>
        <a
          className={`link reveal-text ${
            activeSection === "Contact" ? "active" : ""
          }`}
          onClick={() => handleLinkClick("Contact")}
        >
          Contact
        </a>
      </div>

      {/* Hamburger menu button - ensure it's always in the DOM */}
      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      />

      {/* Mobile menu */}
      <div
        className={`mobile-menu ${menuOpen ? "active" : ""}`}
        ref={mobileMenuRef}
      >
        <div className="mobile-links">
          <a
            className={`link reveal-text ${
              activeSection === "Home" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("Home")}
          >
            Home
          </a>
          <a
            className={`link reveal-text ${
              activeSection === "About" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("About")}
          >
            About
          </a>
          <a
            className={`link reveal-text ${
              activeSection === "Projects" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("Projects")}
          >
            Projects
          </a>
          <a
            className={`link reveal-text ${
              activeSection === "Contact" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("Contact")}
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
