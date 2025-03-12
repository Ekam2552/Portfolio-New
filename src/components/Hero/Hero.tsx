import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.scss';
import { useAnimationContext } from '../../context/AnimationContext';
import {
  setupCurtainForHiddenElements,
  applyCurtainRevealToElement,
} from '../../utils/animations/textRevealAnimations';

import heroVideo from '../../assets/Hero_Video.mp4';
import HeroDownArrow from '../../assets/Hero_Down_Arrow.svg';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// TODO: Create the Hero component

const Hero = () => {
  // Create refs for the elements we want to animate
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollArrowRef = useRef<HTMLDivElement>(null);
  const scrollArrowImageRef = useRef<HTMLImageElement>(null);
  const scrollTextRef = useRef<HTMLHeadingElement>(null);

  // Get the loader completion state from context
  const { loaderComplete, timing } = useAnimationContext();

  // Effect to animate the video overlay opacity
  useEffect(() => {
    if (!overlayRef.current || !loaderComplete) return;

    // Start with fully opaque overlay (opacity 1)
    gsap.set(overlayRef.current, { opacity: 1 });

    // After a short delay, animate to final opacity
    const timer = setTimeout(() => {
      gsap.to(overlayRef.current, {
        opacity: 0.7,
        duration: 2,
        ease: 'power2.inOut',
      });
    }, timing.POST_LOADER_DELAY);

    return () => clearTimeout(timer);
  }, [loaderComplete, timing]);

  // Effect to prepare and apply curtain reveal animation after loader completes
  useEffect(() => {
    if (!heroRef.current || !loaderComplete) return;

    // Get all text elements that need curtain reveal
    const textElements = heroRef.current?.querySelectorAll('.reveal-text');
    if (!textElements || textElements.length === 0) return;

    // Phase 1: Setup all curtains but keep them covering the text
    const elements = setupCurtainForHiddenElements(heroRef.current, {
      textSelector: '.reveal-text',
      curtainColor: 'var(--primary-background)',
    });

    // Make sure curtains are properly positioned to cover text
    elements.forEach((element) => {
      const curtain = (element as HTMLElement).parentElement?.querySelector(
        '.text-curtain'
      ) as HTMLElement;
      if (curtain) {
        // Ensure curtain is covering the text
        curtain.style.transformOrigin = 'left center';
      }
    });

    // Phase 2: After delay, animate the curtains away
    const timer = setTimeout(() => {
      textElements.forEach((element, index) => {
        // Apply the proper curtain reveal animation with staggered delay
        applyCurtainRevealToElement(element as HTMLElement, {
          direction: 'left',
          duration: 1.5,
          ease: 'power3.out',
          delay: index * timing.DEFAULT_STAGGER,
          curtainColor: 'var(--primary-background)',
        });
      });
    }, timing.POST_LOADER_DELAY + 200); // Add a bit more delay after navbar animations

    return () => clearTimeout(timer);
  }, [loaderComplete, timing]);

  // Animation for scroll down arrow and text
  useEffect(() => {
    if (
      !loaderComplete ||
      !scrollArrowImageRef.current ||
      !scrollTextRef.current
    )
      return;

    // Store ref value for cleanup
    const textElement = scrollTextRef.current;

    // Function to create the infinite animation timeline
    const createInfiniteAnimation = () => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.2,
      });

      // Fade out while moving down
      tl.to(textElement, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
      })
        .set(textElement, {
          y: -30,
          opacity: 0,
        })
        .to(textElement, {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'power1.out',
        });

      return tl;
    };

    // Create initial entrance timeline
    const entranceTl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Start infinite animation after entrance
        createInfiniteAnimation();
      },
    });

    // Add initial animations to entrance timeline
    entranceTl
      .fromTo(
        scrollArrowImageRef.current,
        {
          autoAlpha: 0,
          y: 20,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
        }
      )
      .fromTo(
        textElement,
        {
          autoAlpha: 0,
          y: -20,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.7'
      );

    // Play the entrance timeline after loader completes
    const timer = setTimeout(() => {
      entranceTl.play();
    }, timing.POST_LOADER_DELAY + 1500);

    return () => {
      clearTimeout(timer);
      entranceTl.kill();
      // Kill any infinite animations to prevent memory leaks
      gsap.killTweensOf(textElement);
    };
  }, [loaderComplete, timing]);

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
          <div className="hero-down-arrow" ref={scrollArrowRef}>
            <img
              src={HeroDownArrow}
              alt="Hero Down Arrow"
              ref={scrollArrowImageRef}
            />
            <h4 ref={scrollTextRef}>Scroll Down</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
