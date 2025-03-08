'use client';

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { colors, typography, borderRadius, shadows, transitions } from '@/styles/designSystem';
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'gradient';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonIconPosition = 'left' | 'right';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Size styles
const buttonSizes = {
  small: css`
    height: 36px;
    padding: 0 12px;
    font-size: ${typography.fontSize.sm};
    border-radius: ${borderRadius.md};
  `,
  
  medium: css`
    height: 44px;
    padding: 0 16px;
    font-size: ${typography.fontSize.md};
    border-radius: ${borderRadius.lg};
  `,
  
  large: css`
    height: 56px;
    padding: 0 24px;
    font-size: ${typography.fontSize.lg};
    border-radius: ${borderRadius.xl};
  `,
};

// Loading spinner
const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.75s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Styled button component
const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $hasIcon: boolean;
  $iconPosition: ButtonIconPosition;
  $animateOnPress: boolean;
}>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  white-space: nowrap;
  vertical-align: middle;
  outline: none;
  cursor: pointer;
  font-family: ${typography.fontFamily.main};
  font-weight: ${typography.fontWeight.medium};
  letter-spacing: 0.025em;
  transition: ${transitions.default};
  box-shadow: ${shadows.sm};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  /* Disable text selection */
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  
  /* Variant styles */
  ${props => buttonVariants({ variant: props.$variant })}
  
  /* Size styles */
  ${props => buttonSizes[props.$size]}
  
  /* Icon spacing */
  ${props => props.$hasIcon && props.$iconPosition === 'left' && `
    & > svg:first-child {
      margin-right: 8px;
    }
  `}
  
  ${props => props.$hasIcon && props.$iconPosition === 'right' && `
    & > svg:last-child {
      margin-left: 8px;
    }
  `}
  
  /* Animations */
  ${props => props.$animateOnPress && `
    transform-origin: center;
    
    &:active {
      transform: scale(0.96);
    }
  `}
  
  &:focus-visible {
    box-shadow: ${shadows.outline};
  }
  
  &:disabled {
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  isLoading = false,
  animateOnPress = true,
  children,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const handleMouseDown = () => {
    setIsPressed(true);
  };
  
  const handleMouseUp = () => {
    setIsPressed(false);
  };
  
  const hasIcon = !!icon;
  
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $hasIcon={hasIcon}
      $iconPosition={iconPosition}
      $animateOnPress={animateOnPress}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={isPressed ? handleMouseUp : undefined}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {children}
        </>
      ) : (
        <>
          {hasIcon && iconPosition === 'left' && icon}
          {children}
          {hasIcon && iconPosition === 'right' && icon}
        </>
      )}
    </StyledButton>
  );
};

export default Button;

export { Button, buttonVariants }; 