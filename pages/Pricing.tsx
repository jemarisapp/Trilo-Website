
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
}> = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
    description: 'Best for trying Trilo during a season or short league cycle.',
    cta: 'Start Monthly',
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$39',
    period: '/year',
    description: 'The best default for commissioners running a full CFB or Madden year.',
    badge: 'Best value',
    cta: 'Get Annual',
  },
];

const features = [
  'One license activates one Discord server',
  'AI matchup creation from screenshots',
  'CFB, NFL, and NBA team tools',
  'Attribute points with requests and approvals',
  'Smart matchup channels, pings, and bulk actions',
  'Commissioner-first Discord support',
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
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-trilo-orange/10 border border-trilo-orange/20 text-trilo-orange text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            <Sparkles size={14} />
            One license. One server.
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-white mb-6">
            SIMPLE PRICING FOR SERIOUS COMMISSIONERS.
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Trilo costs less than the game, saves hours every week, and keeps your league running inside Discord.
          </p>
        </div>

        {discordUser ? (
          <div className="max-w-4xl mx-auto mb-8 bg-[#0f1115] border border-[#5865F2]/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {discordUser.avatar ? (
                <img
                  src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`}
                  alt={discordUser.username}
                  className="w-12 h-12 rounded-full border border-[#5865F2]/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold">
                  {discordUser.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-white font-heading font-bold">{discordUser.username}</p>
                <p className="text-gray-400 text-sm">Your license key will be shown after checkout and sent by Discord DM.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="discord" onClick={manageSubscription}>
                Manage Billing
              </Button>
              <Button variant="ghost" onClick={logout}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mb-8 bg-trilo-orange/10 border border-trilo-orange/20 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-trilo-orange mt-0.5 flex-shrink-0" />
              <p className="text-gray-300 text-sm">
                Connect Discord before checkout so Trilo can deliver your license key and tie billing to your account.
              </p>
            </div>
            <Button variant="discord" className="flex items-center justify-center gap-2" onClick={login}>
              <DiscordIcon />
              Connect Discord
            </Button>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 gap-4">
            {plans.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`text-left rounded-xl border p-5 transition-all ${
                    active
                      ? 'bg-trilo-orange/10 border-trilo-orange/50'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-heading font-bold text-2xl">{plan.name}</h3>
                        {plan.badge && (
                          <span className="text-[10px] uppercase tracking-widest bg-trilo-orange text-white px-2 py-1 rounded font-bold">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-heading font-bold text-3xl">{plan.price}</p>
                      <p className="text-gray-500 text-xs uppercase tracking-widest">{plan.period}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Card className="border-trilo-orange/30 bg-trilo-orange/[0.03] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-trilo-orange/10 border border-trilo-orange/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-trilo-orange" />
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Selected plan</p>
                <h2 className="text-white font-heading font-bold text-3xl">{selected.name}</h2>
              </div>
            </div>

            <div className="flex items-end gap-2 mb-6">
              <span className="text-6xl font-heading font-extrabold text-white">{selected.price}</span>
              <span className="text-gray-500 font-semibold mb-2">{selected.period}</span>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-gray-300 text-sm">
                  <Check size={16} className="text-trilo-orange flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={() => handleCheckout(selected.id)} disabled={isLoading}>
              {isLoading ? 'Opening Checkout...' : selected.cta}
            </Button>

            <p className="text-gray-500 text-xs text-center mt-4">
              Already have a license? Run <code className="bg-white/10 text-gray-300 px-1.5 py-0.5 rounded">/admin activate</code> in Discord.
            </p>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto bg-trilo-elevated/20 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-white font-heading font-bold text-2xl mb-3">Need a hand setting up?</h3>
          <p className="text-gray-400 mb-6">
            Join the support server and message @trillsapp. I can help you pick the right plan, activate your license, or move an activation between servers.
          </p>
          <Button variant="discord" className="mx-auto flex items-center justify-center gap-2" onClick={() => window.open(DISCORD_SUPPORT_URL, '_blank')}>
            <DiscordIcon />
            Get Help on Discord
          </Button>

        </div>
      </div>
    </div>
  );
};
