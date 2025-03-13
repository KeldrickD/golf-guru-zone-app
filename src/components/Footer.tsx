'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Twitter, Facebook, Instagram, Mail, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Trophy className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                Golf Guru Zone
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
              Your AI-powered golf companion for improving your game through data analysis, equipment recommendations, and more.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* Site Links */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/analytics" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Performance Analysis
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Rules Assistant
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Equipment Recommender
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Course Discovery
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Golf Guru Zone. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 