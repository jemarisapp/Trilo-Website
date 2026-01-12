
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  return (
    <motion.div 
      whileHover={hover ? { y: -4, borderColor: 'rgba(255,107,53,0.3)' } : {}}
      className={`glass-card p-6 rounded-2xl transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};
