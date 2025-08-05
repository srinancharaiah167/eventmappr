import React, { useState, useEffect, useRef } from 'react';

const Cursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const cursorRef = useRef(null);
  const trailRef = useRef(null); // for the ghost trail
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

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

    const smoothFollow = () => {
      // Main pointer easing (faster)
      position.current.x += (target.current.x - position.current.x) * 0.2;
      position.current.y += (target.current.y - position.current.y) * 0.2;

      // Ghost trail easing (slower)
      trailPos.current.x += (target.current.x - trailPos.current.x) * 0.1;
      trailPos.current.y += (target.current.y - trailPos.current.y) * 0.1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x}px, ${trailPos.current.y}px)`;
      }

      requestAnimationFrame(smoothFollow);
    };
    smoothFollow();

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
      {/* Ghost trail */}
      <div ref={trailRef} className="cursor-trail"></div>
      {/* Main cursor */}
      <div 
        ref={cursorRef}
        className={`custom-pointer ${isHovering ? 'is-hovering' : ''} ${isActive ? 'is-active' : ''}`}
      >
        <div className="triangle-pointer"></div>
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }

        .custom-pointer, .cursor-trail {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Main triangle cursor */
        .triangle-pointer {
  width: 18px;
  height: 18px;
  background: black; /* Dark fill for visibility on light backgrounds */
  clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
  opacity: 1;
  box-shadow:
    0 0 0 2px white,      /* white border for visibility on dark backgrounds */
    0 0 6px rgba(255,255,255,0.5); /* soft glow */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 9999;
  pointer-events: none;
}



        /* Ghost trail (faded triangle) */
        .cursor-trail {
          width: 16px;
          height: 16px;
          background: rgba(255,255,255,0.3);
          clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
          filter: blur(4px);
          opacity: 0.4;
          transition: transform 0.4s ease;
        }

        /* Hover and click interactions */
        .custom-pointer.is-hovering .triangle-pointer {
          transform: scale(1.1);
          box-shadow: 0 0 8px rgba(0,0,0,0.4);
        }

        .custom-pointer.is-active .triangle-pointer {
          transform: scale(0.9);
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .custom-pointer, .cursor-trail {
            display: none;
          }
          body, html {
            cursor: default !important;
          }
        }
      `}</style>
    </>
  );
};

export default Cursor;
