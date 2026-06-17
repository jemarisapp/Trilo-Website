
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'discord';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-none border-2 text-center select-none shine-sweep";

  const variants = {
    primary: "border-trilo-orange bg-trilo-orange text-white hover:bg-transparent hover:text-trilo-orange shadow-[4px_4px_0px_rgba(255,107,53,0.2)] hover:shadow-none",
    secondary: "border-white/20 bg-transparent text-white hover:border-white hover:bg-white/5",
    ghost: "border-transparent bg-transparent text-white hover:bg-white/5",
    discord: "border-[#5865F2] bg-[#5865F2] text-white hover:bg-transparent hover:text-[#5865F2]"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs tracking-widest",
    md: "px-6 py-2.5 text-sm tracking-wider",
    lg: "px-8 py-3.5 text-base tracking-widest"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
