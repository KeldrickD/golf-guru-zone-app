'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  imgSrc?: string;
  imgAlt?: string;
  gradient?: boolean;
  center?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  children,
  imgSrc,
  imgAlt = "Header image",
  gradient = true,
  center = false,
}) => {
  return (
    <div className={`relative overflow-hidden py-12 sm:py-16 ${gradient ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800' : 'bg-white dark:bg-gray-900'}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* Decorative blob */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-56 transform rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-24 translate-y-12 transform rounded-full bg-primary/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto ${center ? 'text-center' : ''}`}>
          <div className="flex flex-col items-start gap-4 sm:gap-6">
            {Icon && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-3 rounded-lg ${center ? 'mx-auto' : ''} bg-primary/10 text-primary`}
              >
                <Icon className="h-6 w-6" />
              </motion.div>
            )}
            
            {imgSrc && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-full ${center ? 'mx-auto' : ''} rounded-lg overflow-hidden mb-4 max-w-xs`}
              >
                <img 
                  src={imgSrc} 
                  alt={imgAlt} 
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            )}

            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white ${center ? 'mx-auto' : ''}`}
            >
              {title}
            </motion.h1>
            
            {description && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed ${center ? 'mx-auto text-center' : ''}`}
              >
                {description}
              </motion.p>
            )}
            
            {children && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`mt-4 ${center ? 'mx-auto' : ''}`}
              >
                {children}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 