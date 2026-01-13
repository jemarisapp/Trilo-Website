
import React, { useState, useEffect } from 'react';
import { Check, Info, ArrowRight, Gamepad2 } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { DISCORD_SUPPORT_URL } from '../constants';
import { DiscordIcon } from '../components/Layout/Header';

import { useDiscordUser } from '../contexts/DiscordContext';

// Stripe Price IDs - these are set in environment variables
// In Vite, use import.meta.env instead of process.env
const STRIPE_PRICE_ID_MONTHLY = import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY;
const STRIPE_PRICE_ID_ANNUAL = import.meta.env.VITE_STRIPE_PRICE_ID_ANNUAL;
const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { discordUser, logout, isProcessingAuth, manageSubscription } = useDiscordUser();

  /**
   * Handle Discord OAuth
   * Redirect to Discord authorization page
   */
  const handleDiscordAuth = () => {
    const redirectUri = `${SITE_URL}/auth/callback`;
    const scope = 'identify email';
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;

    // Store the selected plan before redirecting
    localStorage.setItem('selectedPlan', isAnnual ? 'annual' : 'monthly');

    window.location.href = authUrl;
  };

  /**
   * Handle Discord disconnect
   * Clears the Discord user state and localStorage
   */
  const handleDisconnect = () => {
    logout();
  };

  /**
   * Handle checkout button click
   * Redirects to Stripe checkout (license key generated after payment)
   */
  const handleCheckout = async (isTrial: boolean) => {
    // For trial, redirect to Discord support
    if (isTrial) {
      window.open(DISCORD_SUPPORT_URL, '_blank');
      return;
    }

    // If no Discord user, prompt to connect
    if (!discordUser) {
      handleDiscordAuth();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call checkout API with Discord user info
      const priceId = isAnnual ? STRIPE_PRICE_ID_ANNUAL : STRIPE_PRICE_ID_MONTHLY;

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          discordUserId: discordUser.id,
          discordUsername: `${discordUser.username}#${discordUser.discriminator}`,
          discordEmail: discordUser.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
      alert(`Error: ${err.message || 'Something went wrong. Please try again.'}`);
    }
  };

  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "10 Days",
      description: "Full access to experience the power of Trilo automation.",
      features: [
        "All features included",
        "AI Image Matchups",
        "Complete Attribute Points System",
        "Full Team Management",
        "Priority Support"
      ],
      cta: "Try for Free",
      popular: false,
      isTrial: true
    },
    {
      name: "Trilo",
      price: isAnnual ? "$69.99" : "$14.99",
      period: isAnnual ? "Per Year" : "Per Month",
      description: isAnnual ? "Same price as Madden and CFB. Runs your league all year." : "Dynasty league automation that saves 3+ hours weekly.",
      features: [
        "Use on Up to 3 Discord Servers",
        "AI Image Matchups (Screenshot Upload)",
        "Complete Attribute Points System",
        "Full Team Management (CFB & NFL)",
        "Smart Messaging & Automation",
        "Bulk Operations & Mass Editing",
        "Priority Discord Support",
        "Early Access to Beta Features",
        "All Future Features (Dashboard, Analytics)"
      ],
      cta: isAnnual ? "Get Annual Plan" : "Get Monthly Plan",
      popular: true,
      isTrial: false
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6">ONE PLAN. ALL FEATURES.</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            No tiers. No upgrades. Everything included from day one.
          </p>
          <p className="text-md text-gray-500 max-w-xl mx-auto mb-10">
            Save 3+ hours every week. All from Discord.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-semibold transition-colors ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-trilo-elevated rounded-full p-1 relative flex items-center transition-all border border-white/5"
            >
              <div className={`w-6 h-6 bg-trilo-orange rounded-full transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-semibold transition-colors ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
              Annual <span className="text-trilo-yellow ml-1 text-xs uppercase bg-trilo-yellow/10 px-1.5 py-0.5 rounded">Save 61%</span>
            </span>
          </div>

          {/* Discord Connection Banner */}
          {discordUser ? (
            <div className="max-w-2xl mx-auto mb-10 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5865F2] to-[#5865F2]/50 rounded-2xl opacity-20 blur transition duration-1000 group-hover:opacity-40" />
              <div className="relative bg-[#0f1115] border border-[#5865F2]/30 rounded-xl p-5 flex items-center justify-between overflow-hidden">

                <div className="flex items-center gap-5 relative z-10">
                  <div className="relative">
                    {discordUser.avatar ? (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
                        alt={discordUser.username}
                        className="w-14 h-14 rounded-full border-2 border-[#5865F2]/20"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#5865F2] flex items-center justify-center text-white text-xl font-bold border-2 border-[#5865F2]/20">
                        {discordUser.username[0].toUpperCase()}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0f1115]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-white font-heading font-bold text-lg">
                        {discordUser.username}
                      </h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[#5865F2] text-white tracking-wide">
                        Connected
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      License key will be sent to your DMs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <button
                    onClick={() => manageSubscription()}
                    className="text-white hover:text-trilo-blue transition-colors text-sm font-semibold px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg"
                  >
                    Manage Subscription
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="text-gray-500 hover:text-white transition-colors text-sm font-semibold px-2 py-1"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto mb-8 p-6 bg-trilo-orange/10 border border-trilo-orange/20 rounded-xl text-center">
              <p className="text-gray-300 text-sm mb-4">
                <Info size={16} className="inline mr-2" />
                Connect Discord when you subscribe to receive your license key instantly
              </p>
              <Button
                variant="discord"
                onClick={handleDiscordAuth}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <DiscordIcon />
                Connect Discord
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${plan.popular ? 'border-trilo-orange/40 bg-trilo-orange/[0.03] md:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-trilo-orange text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-heading font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6 min-h-[2.5rem]">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-heading font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 font-medium">{plan.period}</span>
                </div>
                {!plan.isTrial && isAnnual && (
                  <p className="text-sm text-trilo-yellow mt-2">Just $5.83/month</p>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map(f => (
                  <div key={f} className="flex gap-3 items-start text-sm text-gray-300">
                    <Check size={16} className="text-trilo-orange flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.popular ? 'primary' : 'secondary'}
                className="w-full"
                onClick={() => handleCheckout(plan.isTrial)}
                disabled={isLoading}
              >
                {isLoading && !plan.isTrial ? 'Loading...' : plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Game Price Comparison */}
        {isAnnual && (
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-trilo-orange/5 to-trilo-yellow/5 border border-trilo-orange/20 rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-trilo-orange/10 flex items-center justify-center">
                <Gamepad2 size={20} className="text-trilo-orange" />
              </div>
              <h4 className="text-white font-heading font-bold text-lg">Why $69.99?</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 mb-1">Madden 26</p>
                <p className="text-white font-bold text-xl">$69.99</p>
                <p className="text-gray-500 text-xs mt-1">Plays the game</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 mb-1">College Football 26</p>
                <p className="text-white font-bold text-xl">$69.99</p>
                <p className="text-gray-500 text-xs mt-1">Plays the game</p>
              </div>
              <div className="bg-trilo-orange/10 rounded-lg p-4 border border-trilo-orange/30">
                <p className="text-gray-400 mb-1">Trilo Annual</p>
                <p className="text-trilo-orange font-bold text-xl">$69.99</p>
                <p className="text-gray-400 text-xs mt-1">Runs your league for a year</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-6 text-center">
              Same price as the game. Covers this season <span className="text-white font-semibold">AND</span> next. Even if your league only runs 5 months, it's cheaper than monthly.
            </p>
          </div>
        )}

        {/* Unlimited Leagues Comparison */}
        {isAnnual && (
          <div className="max-w-3xl mx-auto bg-trilo-elevated/20 border border-white/10 rounded-2xl p-8 mb-12">
            <h4 className="text-white font-heading font-bold text-lg mb-6 text-center">One Price. Unlimited Leagues.</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-gray-400 font-semibold mb-3">Other Bots</p>
                <p className="text-red-400 text-sm mb-1.5">❌ $34.99 per Madden league</p>
                <p className="text-red-400 text-sm mb-1.5">❌ $14.99 per CFB league</p>
                <p className="text-red-400 text-sm mb-3">❌ Pay separately for each</p>
                <p className="text-gray-500 text-xs mt-4 pt-4 border-t border-white/10">
                  Run 2 Madden + 1 CFB? <span className="text-white font-semibold">$84.97/year</span>
                </p>
              </div>
              <div className="bg-trilo-orange/10 rounded-lg p-6 border border-trilo-orange/30">
                <p className="text-trilo-orange font-semibold mb-3">Trilo</p>
                <p className="text-trilo-orange text-sm mb-1.5">✅ Works on 3 servers</p>
                <p className="text-trilo-orange text-sm mb-1.5">✅ Unlimited Madden leagues</p>
                <p className="text-trilo-orange text-sm mb-1.5">✅ Unlimited CFB leagues</p>
                <p className="text-trilo-orange text-sm mb-3">✅ One price covers everything</p>
                <p className="text-gray-400 text-xs mt-4 pt-4 border-t border-trilo-orange/30">
                  Run 2 Madden + 1 CFB? <span className="text-trilo-orange font-semibold">Still $69.99/year</span>
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm text-center mt-6">
              One license works on 3 servers. Manage your main league, your side league, and help your friends—all with one purchase.
            </p>
          </div>
        )}

        {/* Help Notice */}
        <div className="max-w-3xl mx-auto bg-trilo-elevated/20 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Info size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-heading font-bold mb-1">How Activation Works</h4>
            <p className="text-gray-400 text-sm">After purchase, you'll receive a license key. Run <code className="bg-white/10 px-2 py-1 rounded text-xs">/admin activate</code> in your Discord server to activate. Your license works on up to 3 servers. Need help? Contact <span className="text-trilo-orange">@trillsapp</span> on Discord.</p>
          </div>
          <Button variant="ghost" className="whitespace-nowrap" onClick={() => window.open(DISCORD_SUPPORT_URL, '_blank')}>
            Get Help <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
