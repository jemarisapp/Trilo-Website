
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
  const baseStyles = "inline-flex items-center justify-center font-heading font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

  const variants = {
    primary: "bg-gradient-to-br from-trilo-orange to-trilo-yellow text-white electric-glow hover:shadow-[0_0_25px_rgba(255,107,53,0.4)]",
    secondary: "bg-trilo-elevated text-white hover:bg-[#3D3D3D] border border-white/10",
    ghost: "bg-transparent text-white hover:bg-white/5",
    discord: "bg-[#5865F2] text-white hover:bg-[#4752C4]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg"
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
