import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './Overlay.scss';
import { useAnimationContext } from '../../context/AnimationContext';

interface OverlayProps {
  menuOpen?: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ menuOpen = false }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Use the animation context to know when to start animations
  const { loaderComplete, timing } = useAnimationContext();
  
  // Initial reveal animation when the loader completes
  useEffect(() => {
    if (!overlayRef.current || !loaderComplete) return;
    
    // Immediately hide the overlay
    gsap.set(overlayRef.current, { 
      opacity: 0,
      backdropFilter: 'blur(0px)',
      webkitBackdropFilter: 'blur(0px)',
      visibility: 'hidden' // Ensure it's completely hidden initially
    });
    
    // Add delay to ensure loader is completely gone
    const timer = setTimeout(() => {
      // First make it visible but still transparent
      gsap.set(overlayRef.current, {
        visibility: 'visible'
      });
      
      // Then animate the overlay in
      gsap.to(overlayRef.current, {
        opacity: 1,
        backdropFilter: 'blur(15px)',
        webkitBackdropFilter: 'blur(15px)',
        duration: 1.2,
        ease: 'power2.out'
      });
    }, timing.POST_LOADER_DELAY);
    
    return () => clearTimeout(timer);
  }, [loaderComplete, timing]);
  
  // Animation when menu opens/closes
  useGSAP(() => {
    if (!overlayRef.current) return;
    
    if (menuOpen) {
      // When menu opens, enhance the blur effect slightly
      gsap.to(overlayRef.current, {
        backdropFilter: 'blur(20px)',
        webkitBackdropFilter: 'blur(20px)',
        scale: 1.01, // Subtle scale effect
        duration: 0.4,
        ease: 'power2.out'
      });
    } else {
      // Reset to normal state when menu closes
      gsap.to(overlayRef.current, {
        backdropFilter: 'blur(15px)',
        webkitBackdropFilter: 'blur(15px)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }, { scope: overlayRef, dependencies: [menuOpen] }); // Scope and dependencies
  
  return (
    <div 
      ref={overlayRef}
      className={`navbar-overlay ${menuOpen ? 'menu-open' : ''}`} 
      aria-hidden="true"
    >
      {/* This div is purely decorative, so we use aria-hidden */}
    </div>
  );
};

export default Overlay;
