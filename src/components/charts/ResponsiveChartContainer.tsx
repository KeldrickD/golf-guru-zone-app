'use client';

import React, { ReactNode, ReactElement, useEffect, useState } from 'react';
import { ResponsiveContainer } from 'recharts';
import { useResponsiveScreen, ScreenSize } from '@/hooks/useResponsiveScreen';

interface AspectRatioSettings {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface ResponsiveChartContainerProps {
  children: ReactNode;
  aspectRatio?: AspectRatioSettings;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

/**
 * A custom wrapper around Recharts ResponsiveContainer with improved mobile responsiveness
 * It automatically adjusts the chart's aspect ratio based on screen size
 */
export const ResponsiveChartContainer: React.FC<ResponsiveChartContainerProps> = ({
  children,
  aspectRatio = { desktop: 2, tablet: 1.5, mobile: 1 },
  minHeight = 250,
  maxHeight = 600,
  className = '',
}) => {
  const { screenSize, width } = useResponsiveScreen();
  const [containerHeight, setContainerHeight] = useState(minHeight);
  
  useEffect(() => {
    // Calculate the height based on aspect ratio and container width
    const getCurrentAspectRatio = () => {
      switch (screenSize) {
        case 'mobile': return aspectRatio.mobile;
        case 'tablet': return aspectRatio.tablet;
        case 'desktop': return aspectRatio.desktop;
        default: return aspectRatio.desktop;
      }
    };
    
    // Get container width - we'll use a ref in a real implementation
    // For now we'll use an estimation
    let containerWidth = 0;
    
    if (typeof document !== 'undefined') {
      // Try to get chart container width
      const chartContainers = document.querySelectorAll('.chart-container');
      if (chartContainers.length > 0 && chartContainers[chartContainers.length - 1]) {
        containerWidth = chartContainers[chartContainers.length - 1].clientWidth;
      } else {
        // Fallback to approximate widths based on screen size
        containerWidth = width * (screenSize === 'mobile' ? 0.9 : screenSize === 'tablet' ? 0.8 : 0.7);
      }
    }
    
    // Calculate height based on aspect ratio
    const currentAspectRatio = getCurrentAspectRatio();
    let calculatedHeight = containerWidth / currentAspectRatio;
    
    // Enforce min/max height
    calculatedHeight = Math.max(minHeight, calculatedHeight);
    calculatedHeight = Math.min(maxHeight, calculatedHeight);
    
    setContainerHeight(calculatedHeight);
  }, [screenSize, aspectRatio, minHeight, maxHeight, width]);
  
  return (
    <div 
      className={`chart-container w-full ${className}`} 
      style={{ height: containerHeight }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as ReactElement}
      </ResponsiveContainer>
    </div>
  );
}; 