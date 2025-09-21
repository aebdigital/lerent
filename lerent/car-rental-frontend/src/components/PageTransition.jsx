import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const location = useLocation();
  
  const smoothScrollToTop = useCallback(() => {
    const startPosition = window.pageYOffset;
    const distance = startPosition;
    const duration = 800; // 800ms for smooth scroll
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth animation
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentPosition = startPosition - (distance * ease);
      
      window.scrollTo(0, currentPosition);
      
      // Update overlay opacity during scroll (fade out gradually)
      const scrollProgress = progress;
      const newOpacity = 1 - (scrollProgress * 0.7); // Keep some opacity until end
      setOverlayOpacity(Math.max(newOpacity, 0.3));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Scroll completed
        setIsScrolling(false);
        setShowContent(true);
        
        // Final fade out of overlay
        setTimeout(() => {
          setOverlayOpacity(0);
        }, 100);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);
  
  useEffect(() => {
    // Start transition when route changes
    setShowContent(false);
    setIsScrolling(true);
    
    // Immediate overlay fade in
    setTimeout(() => {
      setOverlayOpacity(1);
    }, 50);
    
    // Start scrolling after overlay is visible
    setTimeout(() => {
      smoothScrollToTop();
    }, 200);

    return () => {
      // Cleanup if component unmounts during animation
      setIsScrolling(false);
    };
  }, [location.pathname, smoothScrollToTop]);

  return (
    <div className="relative">
      {/* White overlay for transition - only covers main content */}
      <div 
        className="absolute inset-0 bg-white z-40 pointer-events-none"
        style={{
          opacity: overlayOpacity,
          transition: isScrolling ? 'none' : 'opacity 0.3s ease-in-out',
          visibility: overlayOpacity > 0 ? 'visible' : 'hidden'
        }}
      />
      
      {/* Page content */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition; 