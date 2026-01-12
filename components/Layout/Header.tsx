
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../UI/Button';
import { BOT_INVITE_URL } from '../../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Setup', path: '/setup' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-trilo-dark/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/trilo-logo.JPG"
            alt="Trilo"
            className="w-10 h-10 rounded-xl transition-transform group-hover:scale-110"
          />
          <span className="font-heading font-extrabold text-2xl tracking-tight hidden sm:block">TRILO</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors hover:text-trilo-orange ${location.pathname === link.path ? 'text-trilo-orange' : 'text-gray-400'}`}
            >
              {link.name}
            </Link>
          ))}
          <Button onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
            Add to Server
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[72px] bg-trilo-dark z-40 md:hidden flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-heading font-bold"
            >
              {link.name}
            </Link>
          ))}
          <Button size="lg" className="w-full" onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
            Add to Server
          </Button>
        </div>
      )}
    </header>
  );
};
