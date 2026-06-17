import React, { useState } from 'react';
import { Check, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { DISCORD_SUPPORT_URL } from '../constants';
import { DiscordIcon } from '../components/Layout/Header';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { useDiscordUser } from '../contexts/DiscordContext';

type PlanId = 'monthly' | 'annual';

const plans: Array<{
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  cta: string;
  sec: string;
  row: string;
  seat: string;
  serial: string;
}> = [
  {
    id: 'monthly',
    name: 'Monthly Pass',
    price: '$4.99',
    period: '/month',
    description: 'Best for running a short dynasty season or trial league cycle.',
    cta: 'Select Monthly',
    sec: 'MON',
    row: 'COMMISH',
    seat: '12',
    serial: 'TRILO-PASS-M-2026'
  },
  {
    id: 'annual',
    name: 'Annual Pass',
    price: '$39',
    period: '/year',
    description: 'The standard playbook license. Full CFB and Madden seasonal coverage.',
    badge: 'Best value',
    cta: 'Select Annual',
    sec: 'ANN',
    row: 'COMMISH',
    seat: '01',
    serial: 'TRILO-PASS-A-2026'
  },
];

const features = [
  'One license activates one Discord server',
  'AI schedule scan (OCR image processing)',
  'NFL, CFB, and NBA team database sync',
  'Progression points ledger & upgrade requests',
  'Automated matchups, game channels, & pings',
  'Commissioner-first Discord priority support',
];

export const Pricing: React.FC = () => {
  const savedPlan = typeof window !== 'undefined' ? localStorage.getItem('selectedPlan') : null;
  const initialPlan = savedPlan === 'monthly' || savedPlan === 'annual' ? savedPlan : 'annual';
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(initialPlan);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { discordUser, login, logout, manageSubscription } = useDiscordUser();

  const handleCheckout = async (plan: PlanId) => {
    if (!discordUser) {
      localStorage.setItem('selectedPlan', plan);
      login();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          discordUserId: discordUser.id,
          discordUsername: `${discordUser.username}#${discordUser.discriminator}`,
          discordEmail: discordUser.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const selected = plans.find((plan) => plan.id === selectedPlan) ?? plans[1];

  return (
    <div className="pt-36 pb-20 field-grid">
      <div className="noise-bg fixed inset-0 z-[-1]" />
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border-2 border-trilo-orange/30 bg-trilo-orange/5 px-4 py-1.5 mb-6 select-none">
            <Sparkles size={14} className="text-trilo-orange animate-pulse" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-trilo-orange">ONE LICENSE. ONE SERVER.</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-heading font-extrabold text-white mb-6 uppercase tracking-tight leading-none athletic-tracking">
            SELECT YOUR SEASON PASS.
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto uppercase tracking-wide font-heading font-semibold">
            Running leagues takes effort. Automating matches costs less than the game itself.
          </p>
        </div>

        {/* Discord user status check banner */}
        {discordUser ? (
          <div className="max-w-4xl mx-auto mb-10 border-2 border-[#5865F2]/30 bg-[#14161a] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {discordUser.avatar ? (
                <img
                  src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
                  alt={discordUser.username}
                  className="w-12 h-12 rounded-none border-2 border-[#5865F2]/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-none bg-[#5865F2] flex items-center justify-center text-white font-heading font-bold text-lg">
                  {discordUser.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white font-heading font-bold uppercase tracking-wider text-sm">CONNECTED USER: {discordUser.username}</p>
                <p className="text-gray-400 text-xs">License will be bound to this Discord account and delivered via DM.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="discord" className="w-full sm:w-auto" onClick={manageSubscription}>
                Manage Billing
              </Button>
              <Button variant="ghost" className="w-full sm:w-auto text-xs uppercase" onClick={logout}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mb-10 border-2 border-trilo-orange/30 bg-trilo-orange/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-trilo-orange mt-0.5 flex-shrink-0" />
              <p className="text-gray-300 text-xs font-heading font-bold uppercase tracking-wider">
                Connect your Discord identity before checkout to associate your server license.
              </p>
            </div>
            <Button variant="discord" className="flex items-center justify-center gap-2 w-full md:w-auto" onClick={login}>
              <DiscordIcon />
              Connect Discord
            </Button>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-10 border-2 border-red-500/30 bg-red-500/5 p-4 text-red-200 text-xs uppercase tracking-wider font-mono">
            {error}
          </div>
        )}

        {/* Tickets and details grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 max-w-5xl mx-auto mb-16">
          
          {/* Ticket passes */}
          <div className="space-y-6">
            {plans.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left ticket-stub border-2 p-6 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-stretch justify-between shine-sweep ${
                    active
                      ? 'border-trilo-orange bg-[#1c1e22] shadow-[4px_4px_0px_rgba(255,107,53,0.15)]'
                      : 'border-white/10 bg-[#131518] hover:border-white/20'
                  }`}
                >
                  <div className="ticket-cutout-l" />
                  <div className="ticket-cutout-r" />

                  {/* Left part: Plan details */}
                  <div className="flex-grow flex flex-col justify-between pr-4 mb-4 md:mb-0">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-heading font-extrabold text-2xl uppercase tracking-wider">{plan.name}</h3>
                        {plan.badge && (
                          <span className="text-[8px] font-heading font-bold uppercase tracking-widest bg-trilo-orange text-white px-2 py-0.5">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed max-w-sm font-sans">{plan.description}</p>
                    </div>

                    {/* Section metrics */}
                    <div className="flex gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-6">
                      <div>SEC <span className="text-white font-bold block">{plan.sec}</span></div>
                      <div>ROW <span className="text-white font-bold block">{plan.row}</span></div>
                      <div>SEAT <span className="text-white font-bold block">{plan.seat}</span></div>
                    </div>
                  </div>

                  {/* Perforation divider */}
                  <div className="hidden md:block border-r-2 border-dashed border-white/15 mx-4 self-stretch" />

                  {/* Right part: Ticket stub pricing & Barcode */}
                  <div className="flex flex-col justify-between items-center md:items-end text-center md:text-right pl-0 md:pl-4 min-w-[140px]">
                    <div className="mb-4 md:mb-0">
                      <p className="text-white font-heading font-extrabold text-4xl leading-none">{plan.price}</p>
                      <p className="text-gray-500 font-mono text-[9px] uppercase tracking-wider mt-1">{plan.period}</p>
                    </div>

                    {/* CSS Barcode */}
                    <div className="flex flex-col items-center md:items-end mt-4">
                      <div className="flex gap-[2px] h-8 w-24 bg-transparent items-center opacity-60">
                        <div className="w-[2px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[3px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[2px] h-full bg-white" />
                        <div className="w-[4px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[2px] h-full bg-white" />
                        <div className="w-[3px] h-full bg-white" />
                        <div className="w-[1px] h-full bg-white" />
                        <div className="w-[2px] h-full bg-white" />
                      </div>
                      <span className="text-[7px] font-mono text-gray-500 mt-1 uppercase tracking-widest">{plan.serial}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Checkout Detail Card */}
          <Card className="border-trilo-orange/30 bg-[#171b1e] flex flex-col justify-between h-full relative">
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-trilo-orange opacity-40" />
            
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-none bg-trilo-orange/10 border border-trilo-orange/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-trilo-orange" />
                </div>
                <div>
                  <p className="text-gray-500 text-[9px] uppercase tracking-widest font-heading font-extrabold">SEAT CONFIRMATION</p>
                  <h2 className="text-white font-heading font-extrabold text-2xl uppercase tracking-wider">{selected.name}</h2>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-8 border-b border-white/5 pb-6">
                <span className="text-5xl md:text-6xl font-heading font-extrabold text-white">{selected.price}</span>
                <span className="text-gray-500 text-xs font-heading font-bold uppercase tracking-widest">{selected.period}</span>
              </div>

              {/* Bullet details */}
              <div className="space-y-4 mb-8">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-gray-300 text-xs uppercase tracking-wider font-semibold">
                    <Check size={14} className="text-trilo-orange flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Button className="w-full" onClick={() => handleCheckout(selected.id)} disabled={isLoading}>
                {isLoading ? 'Opening Desk Checkout...' : `Purchase ${selected.name}`}
              </Button>

              <p className="text-gray-500 text-[10px] text-center mt-4 uppercase tracking-widest font-mono">
                Active license? Run <code className="bg-white/5 text-gray-300 px-1 py-0.5 border border-white/10">/admin activate</code> in Discord.
              </p>
            </div>
          </Card>
        </div>

        {/* Commissioner Help Desk */}
        <div className="max-w-4xl mx-auto border-2 border-white/10 bg-[#131518]/65 p-8 text-center">
          <h3 className="text-white font-heading font-extrabold text-2xl uppercase tracking-wider mb-3">COMMISSIONER SUPPORT DESK</h3>
          <p className="text-gray-400 text-xs font-sans leading-relaxed max-w-2xl mx-auto mb-6">
            Need help configuring activations, transferring keys, or upgrading server subscriptions? Drop into our Discord support lobby and query @trillsapp.
          </p>
          <Button variant="discord" className="mx-auto flex items-center justify-center gap-2" onClick={() => window.open(DISCORD_SUPPORT_URL, '_blank')}>
            <DiscordIcon />
            Open Help Lobby
          </Button>
        </div>
      </div>
    </div>
  );
};
