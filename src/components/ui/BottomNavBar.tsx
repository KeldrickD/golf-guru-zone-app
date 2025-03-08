'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, typography, shadows, transitions, borderRadius } from '@/styles/designSystem';

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

interface BottomNavBarProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  centerActionButton?: {
    icon: React.ReactNode;
    onClick: () => void;
    label: string;
  };
}

const NavBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.background.paper};
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  box-shadow: ${shadows.lg};
  z-index: 50;
  padding: 0 16px;
`;

const NavItemButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  border: none;
  background: none;
  padding: 8px 0;
  cursor: pointer;
  color: ${props => props.$active ? colors.primary.main : colors.text.secondary};
  transition: ${transitions.default};
  position: relative;
  
  &:hover {
    color: ${colors.primary.light};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Active indicator line */
  ${props => props.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 25%;
      width: 50%;
      height: 3px;
      background-color: ${colors.primary.main};
      border-radius: ${borderRadius.full} ${borderRadius.full} 0 0;
    }
  `}
`;

const NavItemIcon = styled.div<{ $active: boolean }>`
  font-size: 24px;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
  transition: transform 0.2s ease;
  
  ${props => props.$active && `
    transform: translateY(-2px);
  `}
  
  /* Target SVG elements */
  & > svg {
    width: 24px;
    height: 24px;
  }
`;

const NavItemLabel = styled.span<{ $active: boolean }>`
  font-size: ${typography.fontSize.xs};
  font-weight: ${props => props.$active ? typography.fontWeight.medium : typography.fontWeight.regular};
  max-width: 64px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CenterActionButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${colors.gradients.primaryGradient};
  color: white;
  border: none;
  box-shadow: ${shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${transitions.bounce};
  transform: translateY(-20px);
  position: relative;
  z-index: 1;
  
  /* Target SVG elements */
  & > svg {
    width: 28px;
    height: 28px;
  }
  
  &:hover {
    transform: translateY(-24px);
    box-shadow: ${shadows.lg};
  }
  
  &:active {
    transform: translateY(-18px) scale(0.95);
  }
`;

const CenterActionLabel = styled.span`
  position: absolute;
  bottom: -20px;
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  white-space: nowrap;
`;

// Optional ripple effect for touch feedback
const Ripple = styled.span`
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 0.6s linear;
  background-color: rgba(255, 255, 255, 0.7);
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  items,
  activeItem,
  onItemClick,
  centerActionButton
}) => {
  // State for ripple effect
  const [ripple, setRipple] = useState<{ 
    x: number;
    y: number;
    id: string;
  } | null>(null);
  
  // Clear ripple after animation
  useEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => {
        setRipple(null);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [ripple]);
  
  // Handle item click with ripple effect
  const handleItemClick = (
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Create ripple effect
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setRipple({ x, y, id });
    
    // Trigger navigation
    onItemClick(id);
  };
  
  // Divide items for layout with center button
  const middleIndex = Math.floor(items.length / 2);
  const leftItems = centerActionButton ? items.slice(0, middleIndex) : items.slice(0, Math.ceil(items.length / 2));
  const rightItems = centerActionButton ? items.slice(middleIndex) : items.slice(Math.ceil(items.length / 2));
  
  return (
    <NavBarContainer>
      {/* Left items */}
      {leftItems.map((item) => (
        <NavItemButton
          key={item.id}
          $active={activeItem === item.id}
          onClick={(e) => handleItemClick(item.id, e)}
          aria-label={item.label}
        >
          <NavItemIcon $active={activeItem === item.id}>
            {item.icon}
          </NavItemIcon>
          <NavItemLabel $active={activeItem === item.id}>
            {item.label}
          </NavItemLabel>
          
          {/* Ripple effect */}
          {ripple && ripple.id === item.id && (
            <Ripple
              style={{
                left: ripple.x,
                top: ripple.y
              }}
            />
          )}
        </NavItemButton>
      ))}
      
      {/* Center Action Button */}
      {centerActionButton && (
        <CenterActionButton 
          onClick={centerActionButton.onClick}
          aria-label={centerActionButton.label}
        >
          {centerActionButton.icon}
          <CenterActionLabel>{centerActionButton.label}</CenterActionLabel>
        </CenterActionButton>
      )}
      
      {/* Right items */}
      {rightItems.map((item) => (
        <NavItemButton
          key={item.id}
          $active={activeItem === item.id}
          onClick={(e) => handleItemClick(item.id, e)}
          aria-label={item.label}
        >
          <NavItemIcon $active={activeItem === item.id}>
            {item.icon}
          </NavItemIcon>
          <NavItemLabel $active={activeItem === item.id}>
            {item.label}
          </NavItemLabel>
          
          {/* Ripple effect */}
          {ripple && ripple.id === item.id && (
            <Ripple
              style={{
                left: ripple.x,
                top: ripple.y
              }}
            />
          )}
        </NavItemButton>
      ))}
    </NavBarContainer>
  );
};

export default BottomNavBar; 