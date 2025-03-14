'use client';

import React, { ReactNode } from 'react';

interface TooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  labelFormatter?: (label: string) => ReactNode;
  contentFormatter?: (entry: any) => ReactNode;
  valueFormatter?: (value: number) => string;
  wrapperClassName?: string;
  labelClassName?: string;
  itemClassName?: string;
}

/**
 * A responsive tooltip component for Recharts that works well on mobile devices
 */
export const ResponsiveTooltip = ({
  active,
  payload,
  label,
  labelFormatter,
  contentFormatter,
  valueFormatter = (value) => String(value),
  wrapperClassName = '',
  labelClassName = '',
  itemClassName = '',
}: TooltipContentProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className={`
      bg-white dark:bg-gray-800 
      p-2 sm:p-3 
      shadow-lg 
      rounded-md 
      border border-gray-200 dark:border-gray-700
      text-xs sm:text-sm 
      max-w-[200px] sm:max-w-[300px]
      z-50
      ${wrapperClassName}
    `}>
      <div className={`font-medium mb-1 ${labelClassName}`}>
        {labelFormatter ? labelFormatter(label || '') : label}
      </div>
      
      <div className="space-y-1">
        {contentFormatter ? (
          // If a custom content formatter is provided, use it
          payload.map((entry, index) => (
            <div key={`item-${index}`} className={itemClassName}>
              {contentFormatter(entry)}
            </div>
          ))
        ) : (
          // Otherwise, use the default layout
          payload.map((entry, index) => (
            <div 
              key={`item-${index}`} 
              className={`flex items-center gap-1.5 ${itemClassName}`}
            >
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{entry.name}:</span>
                <span className="ml-1">
                  {typeof entry.value === 'number' 
                    ? valueFormatter(entry.value) 
                    : entry.value}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 