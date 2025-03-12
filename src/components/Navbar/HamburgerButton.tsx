import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './HamburgerButton.scss';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen,
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const middleLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);

  // Initial reveal animation when component mounts
  useGSAP(
    () => {
      if (
        !buttonRef.current ||
        !topLineRef.current ||
        !middleLineRef.current ||
        !bottomLineRef.current
      )
        return;

      // Set up initial state - lines hidden but button container visible
      gsap.set(
        [topLineRef.current, middleLineRef.current, bottomLineRef.current],
        {
          width: '0%',
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
        }
      );

      // Create a timeline for the reveal animation
      const tl = gsap.timeline({ delay: 0.3 });

      // Make lines appear without using curtain effect (simpler and more reliable)
      tl.to(topLineRef.current, {
        width: '100%',
        duration: 0.7,
        ease: 'power2.out',
      })
        .to(
          middleLineRef.current,
          {
            width: '100%',
            duration: 0.7,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        .to(
          bottomLineRef.current,
          {
            width: '100%',
            duration: 0.7,
            ease: 'power2.out',
          },
          '-=0.4'
        );

      return () => {
        tl.kill();
      };
    },
    { scope: buttonRef }
  );

  // Animation for toggling between hamburger and close
  useGSAP(
    () => {
      if (
        !topLineRef.current ||
        !middleLineRef.current ||
        !bottomLineRef.current
      )
        return;

      if (isOpen) {
        // Animate to X (close icon)
        gsap.to(topLineRef.current, {
          width: '24px', // Ensure full width for visibility
          y: 5,
          rotation: 45,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(middleLineRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
        });

        gsap.to(bottomLineRef.current, {
          width: '24px', // Ensure full width for visibility
          y: -3,
          rotation: -45,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        // Animate to hamburger icon
        gsap.to(topLineRef.current, {
          width: '24px', // Ensure full width
          y: 0,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(middleLineRef.current, {
          width: '24px', // Ensure full width
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out',
        });

        gsap.to(bottomLineRef.current, {
          width: '24px', // Ensure full width
          y: 0,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    },
    { scope: buttonRef, dependencies: [isOpen] }
  );

  return (
    <button
      ref={buttonRef}
      className="hamburger-button"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div ref={topLineRef} className="hamburger-line"></div>
      <div ref={middleLineRef} className="hamburger-line"></div>
      <div ref={bottomLineRef} className="hamburger-line"></div>
    </button>
  );
};

export default HamburgerButton;
