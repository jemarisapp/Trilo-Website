import React from 'react';
import { Link } from 'react-router-dom';
import { DISCORD_SUPPORT_URL } from '../../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d0f11] py-16 border-t-2 border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/trilo-logo.JPG" alt="Trilo" className="w-9 h-9 rounded-none border border-white/10" />
              <span className="font-heading font-extrabold text-2xl tracking-wider uppercase">TRILO</span>
            </Link>
            <p className="text-gray-400 max-w-sm text-sm">
              The Discord bot that runs your league so you don't have to. Built for serious commissioners.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-6">Product</h4>
            <ul className="space-y-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">
              <li><Link to="/features" className="hover:text-trilo-orange">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-trilo-orange">Pricing</Link></li>
              <li><Link to="/setup" className="hover:text-trilo-orange">Setup Guide</Link></li>
              <li><a href={DISCORD_SUPPORT_URL} className="hover:text-trilo-orange">Support Discord</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">
              <li><Link to="/privacy" className="hover:text-trilo-orange">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-trilo-orange">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs uppercase tracking-widest">
          <p>© 2026 Trilo. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href={DISCORD_SUPPORT_URL} className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
