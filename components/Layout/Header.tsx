
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../UI/Button';
import { BOT_INVITE_URL } from '../../constants';
import { useDiscordUser } from '../../contexts/DiscordContext';

// Discord Icon SVG from user
export const DiscordIcon = () => (
  <svg
    width="20px"
    height="20px"
    viewBox="0 -28.5 256 256"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    className="mr-2"
  >
    <g>
      <path
        d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
        fill="#FFFFFF"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { discordUser, login } = useDiscordUser();

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

          {discordUser ? (
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              {discordUser.avatar ? (
                <img
                  src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
                  alt={discordUser.username}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-trilo-orange flex items-center justify-center text-[10px] font-bold">
                  {discordUser.username[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold text-gray-200">
                {discordUser.username}
              </span>
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={() => window.open(BOT_INVITE_URL, '_blank')}
              className="flex items-center"
            >
              Add to Server
            </Button>
          )}
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

          {discordUser ? (
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              {discordUser.avatar ? (
                <img
                  src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
                  alt={discordUser.username}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-trilo-orange flex items-center justify-center text-lg font-bold">
                  {discordUser.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-bold text-white">{discordUser.username}</p>
                <p className="text-gray-500 text-xs">Connected via Discord</p>
              </div>
            </div>
          ) : (
            <Button
              size="lg"
              variant="primary"
              className="w-full flex items-center justify-center"
              onClick={() => window.open(BOT_INVITE_URL, '_blank')}
            >
              Add to Server
            </Button>
          )}
        </div>
      )}
    </header>
  );
};
