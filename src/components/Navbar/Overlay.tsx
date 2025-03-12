import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './Overlay.scss';

interface OverlayProps {
  menuOpen?: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ menuOpen = false }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Initial reveal animation when the component mounts
  useGSAP(() => {
    if (overlayRef.current) {
      // Start with the overlay hidden
      gsap.set(overlayRef.current, { 
        opacity: 0,
        backdropFilter: 'blur(0px)',
        webkitBackdropFilter: 'blur(0px)'
      });
      
      // Animate the overlay in
      gsap.to(overlayRef.current, {
        opacity: 1,
        backdropFilter: 'blur(15px)',
        webkitBackdropFilter: 'blur(15px)',
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.2
      });
    }
  }, { scope: overlayRef }); // Scope to overlayRef for cleanup
  
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
