
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, ArrowRight } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { DISCORD_SUPPORT_URL } from '../constants';

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "10 Days",
      description: "Full access to experience the power of Trilo automation.",
      features: [
        "All Pro Tier features included",
        "Team Management",
        "AI Image Matchups",
        "Unlimited Messaging",
        "24/7 Support"
      ],
      cta: "Try for Free",
      popular: false
    },
    {
      name: "Core",
      price: isAnnual ? "$35.99" : "$7.99",
      period: isAnnual ? "Per Year" : "Per Month",
      description: "Essential tools for any starting dynasty league.",
      features: [
        "Full Team Management",
        "Manual Matchup Creation",
        "Smart Messaging & Pings",
        "Custom Settings Support",
        "Basic Event Logging"
      ],
      cta: "Get Core",
      popular: false
    },
    {
      name: "Pro",
      price: isAnnual ? "$59.99" : "$14.99",
      period: isAnnual ? "Per Year" : "Per Month",
      description: "Advanced automation for serious, high-activity leagues.",
      features: [
        "AI Image Matchups (Schedule Upload)",
        "Complete Attribute Points System",
        "Bulk Operations & Mass Editing",
        "Priority Discord Support",
        "Early Access to Beta Features"
      ],
      cta: "Get Pro",
      popular: true
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6">SIMPLE PRICING.</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Choose the plan that fits your league's complexity. Upgrade or downgrade at any time.
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
              Annual <span className="text-trilo-yellow ml-1 text-xs uppercase bg-trilo-yellow/10 px-1.5 py-0.5 rounded">Save 60%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan, i) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${plan.popular ? 'border-trilo-orange/40 bg-trilo-orange/[0.03]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-trilo-orange text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-heading font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-heading font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500 font-medium">{plan.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map(f => (
                  <div key={f} className="flex gap-3 items-center text-sm text-gray-300">
                    <Check size={16} className="text-trilo-orange flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <Button 
                variant={plan.popular ? 'primary' : 'secondary'} 
                className="w-full"
                onClick={() => window.open(DISCORD_SUPPORT_URL, '_blank')}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Note about Stripe */}
        <div className="max-w-3xl mx-auto bg-trilo-elevated/20 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Info size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-heading font-bold mb-1">Stripe Checkout Coming Soon</h4>
            <p className="text-gray-400 text-sm">We are currently integrating automated payments. For now, please join our Discord support server to purchase or start your trial.</p>
          </div>
          <Button variant="ghost" className="whitespace-nowrap" onClick={() => window.open(DISCORD_SUPPORT_URL, '_blank')}>
            Contact Support <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
