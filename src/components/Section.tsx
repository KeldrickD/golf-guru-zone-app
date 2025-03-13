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
        'py-12 sm:py-20 relative overflow-hidden',
        darkBackground ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-900',
        className
      )}
    >
      {pattern && (
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-50"></div>
      )}
      
      <div className={cn('relative z-10', fullWidth ? 'container-fluid px-4' : 'container mx-auto px-4')}>
        {(title || description) && (
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {title && (
              <motion.h2 
                className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4"
                variants={itemVariants}
              >
                {title}
              </motion.h2>
            )}
            
            {description && (
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300"
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
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default Section; 