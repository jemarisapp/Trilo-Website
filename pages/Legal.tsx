
import React from 'react';

interface LegalProps {
  title: string;
  children: React.ReactNode;
}

export const Legal: React.FC<LegalProps> = ({ title, children }) => {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-12">{title}</h1>
        <div className="prose prose-invert prose-orange max-w-none text-gray-400 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
