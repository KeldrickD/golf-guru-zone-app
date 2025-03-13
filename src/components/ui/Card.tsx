'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import { colors, shadows, borderRadius, transitions } from '@/styles/designSystem';
import { cn } from "@/lib/utils"

export type CardElevation = 'flat' | 'low' | 'medium' | 'high';
export type CardInteraction = 'none' | 'hover' | 'clickable';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: CardElevation;
  interaction?: CardInteraction;
  hoverEffect?: boolean;
  borderHighlight?: boolean;
  noPadding?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

// Elevation styles
const cardElevations = {
  flat: css`
    box-shadow: none;
    border: 1px solid ${colors.border.light};
  `,
  
  low: css`
    box-shadow: ${shadows.sm};
  `,
  
  medium: css`
    box-shadow: ${shadows.md};
  `,
  
  high: css`
    box-shadow: ${shadows.lg};
  `,
};

// Interaction styles
const cardInteractions = {
  none: css``,
  
  hover: css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${shadows.lg};
    }
  `,
  
  clickable: css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${shadows.lg};
    }
    
    &:active {
      transform: translateY(-2px);
      box-shadow: ${shadows.md};
    }
  `,
};

const StyledCard = styled.div<{
  $elevation: CardElevation;
  $interaction: CardInteraction;
  $hoverEffect: boolean;
  $borderHighlight: boolean;
  $noPadding: boolean;
  $fullWidth: boolean;
}>`
  background-color: ${colors.background.paper};
  border-radius: ${borderRadius['2xl']};
  transition: ${transitions.default};
  overflow: hidden;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  padding: ${props => props.$noPadding ? '0' : '1.5rem'};
  position: relative;
  
  /* Elevation styles */
  ${props => cardElevations[props.$elevation]}
  
  /* Interaction styles */
  ${props => cardInteractions[props.$interaction]}
  
  /* Border highlight */
  ${props => props.$borderHighlight && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: ${colors.gradients.primaryGradient};
      border-radius: ${borderRadius['2xl']} ${borderRadius['2xl']} 0 0;
    }
  `}
  
  /* Hover Effect - subtle glow */
  ${props => props.$hoverEffect && `
    &:hover {
      box-shadow: 0 8px 20px rgba(10, 95, 56, 0.15);
    }
  `}
`;

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

export default Card; 