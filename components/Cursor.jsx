import React, { useState, useEffect } from 'react';

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false); // For click/active state

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Get all interactive elements (links, buttons, inputs etc.)
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"], [role="link"], [onClick], .interactive-element'
    );
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        className={`custom-pointer ${isHovering ? 'is-hovering' : ''} ${isActive ? 'is-active' : ''}`}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div className="triangle-pointer"></div>
      </div>

      <style jsx global>{`
        * {
          cursor: none !important; /* Force hide default cursor */
        }
        
        .custom-pointer {
          pointer-events: none; /* Allows clicks to pass through */
          position: fixed;
          top: 0;
          left: 0;
          z-index: 999999; /* Extremely high z-index to stay on top */
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.05s ease-out; /* Smooth tracking */
        }

        .triangle-pointer {
          width: 24px; /* Size of the triangle - adjusted for good visibility */
          height: 24px;
          background: linear-gradient(
            90deg, /* Ensures the gradient flows from left (purple) to right (green) */
            #b16cea 0%,   /* Purple */
            #ff5e69 50%,  /* Pink/Red */
            #a1ff4a 100%  /* Green/Yellow */
          );
          clip-path: polygon(0% 0%, 100% 50%, 0% 100%); /* Perfect triangle pointing right */
          transform: rotate(0deg); /* No initial rotation, points right */
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          /* Multi-color glow effect, adjusted for clarity */
          box-shadow: 
            0 0 5px rgba(177, 108, 234, 0.8),   /* Purple glow */
            0 0 10px rgba(255, 94, 105, 0.8),  /* Pink glow */
            0 0 15px rgba(161, 255, 74, 0.8);  /* Green glow */
        }

        /* Hover states */
        .custom-pointer.is-hovering .triangle-pointer {
          transform: scale(1.2); /* Slightly larger on hover */
          /* More intense glow on hover */
          box-shadow: 
            0 0 8px rgba(177, 108, 234, 1), 
            0 0 15px rgba(255, 94, 105, 1), 
            0 0 20px rgba(161, 255, 74, 1);
        }

        /* Active (click) states */
        .custom-pointer.is-active .triangle-pointer {
          transform: scale(0.9); /* Shrink on click */
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Dimmed glow on click */
        }

        /* Hide on mobile for better usability */
        @media (max-width: 768px) {
          .custom-pointer {
            display: none;
          }
          body, html {
            cursor: default !important; /* Show default cursor on mobile */
          }
        }
      `}</style>
    </>
  );
};

export default Cursor;