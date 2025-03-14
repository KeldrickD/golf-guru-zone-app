'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullWidth?: boolean;
  darkBackground?: boolean;
  pattern?: boolean;
  noPadding?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
  className,
  id,
  fullWidth = false,
  darkBackground = false,
  pattern = false,
  noPadding = false,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section 
      id={id}
      className={cn(
        noPadding ? '' : 'py-8 sm:py-12 md:py-16',
        'relative overflow-hidden',
        darkBackground ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-900',
        className
      )}
    >
      {pattern && (
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-50"></div>
      )}
      
      <div className={cn('relative z-10', fullWidth ? 'container-fluid px-3 sm:px-4' : 'container mx-auto px-3 sm:px-4')}>
        {(title || description) && (
          <motion.div 
            className="text-center max-w-full sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {title && (
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 sm:mb-4"
                variants={itemVariants}
              >
                {title}
              </motion.h2>
            )}
            
            {description && (
              <motion.p 
                className="text-base sm:text-lg text-gray-600 dark:text-gray-300"
                variants={itemVariants}
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        )}
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section; 