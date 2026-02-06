import React, { useState, useRef, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPulling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Helper to find the nearest scrollable parent
    const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
      if (!node) return null;
      if (node.scrollHeight > node.clientHeight && 
         (window.getComputedStyle(node).overflowY === 'auto' || window.getComputedStyle(node).overflowY === 'scroll')) {
        return node;
      }
      return getScrollParent(node.parentElement);
    };

    const scrollParent = getScrollParent(container) || document.body;

    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull if at the very top
      if (scrollParent.scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      } else {
        startY.current = 0;
        isPulling.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;
      
      const y = e.touches[0].clientY;
      const diff = y - startY.current;

      // If pulling down at top
      if (diff > 0 && scrollParent.scrollTop <= 0) {
        // Prevent default browser scrolling/refresh
        if (e.cancelable) {
            e.preventDefault();
        }
        // Add resistance
        setPullY(Math.min(diff * 0.45, 100));
      } else {
        // If they scroll back up or down, cancel the pull logic
        isPulling.current = false;
        setPullY(0);
      }
    };

    const handleTouchEnd = async () => {
      isPulling.current = false;
      if (isRefreshing) return;

      if (pullY > 50) {
        // Trigger Refresh
        setIsRefreshing(true);
        setPullY(60); // Snap to loading position
        
        try {
            await onRefresh();
        } finally {
            // Reset
            setIsRefreshing(false);
            setPullY(0);
        }
      } else {
        // Cancel
        setPullY(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullY, isRefreshing, onRefresh]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Loading Indicator */}
      <div 
        className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none z-10"
        style={{ 
          height: '60px',
          marginTop: '-60px',
          transform: `translateY(${pullY}px)`,
          opacity: pullY > 0 ? 1 : 0,
          transition: isRefreshing ? 'transform 0.2s' : 'none'
        }}
      >
        <div className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-full shadow-md flex items-center justify-center">
            {isRefreshing ? (
                <span className="material-symbols-outlined text-blue-600 animate-spin text-[20px]">progress_activity</span>
            ) : (
                <span 
                    className="material-symbols-outlined text-blue-600 text-[20px] transition-transform duration-200" 
                    style={{ transform: `rotate(${pullY * 2.5}deg)` }}
                >
                    arrow_downward
                </span>
            )}
        </div>
      </div>

      {/* Content Wrapper */}
      <div 
        style={{ 
            transform: `translateY(${pullY}px)`,
            transition: isPulling.current ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;