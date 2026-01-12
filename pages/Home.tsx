
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Zap, Trophy, ShieldCheck, Users, Calendar, Award } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { FEATURES, BOT_INVITE_URL, DISCORD_SUPPORT_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <div className="noise-bg fixed inset-0 z-[-1]" />

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-trilo-orange/10 blur-[120px] rounded-full z-[-1]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-trilo-yellow/10 blur-[120px] rounded-full z-[-1]" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-8 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-trilo-orange px-1.5 py-0.5 rounded text-white">New</span>
            <span className="text-xs text-gray-400 font-medium">Trilo v2.0 is now live for all leagues</span>
            <ChevronRight size={14} className="text-gray-500" />
          </div>

          <h1 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter text-white mb-6 max-w-5xl mx-auto leading-[0.9]">
            DYNASTY LEAGUE MANAGEMENT, <span className="bg-clip-text text-transparent bg-gradient-to-br from-trilo-orange to-trilo-yellow">AUTOMATED</span>.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            The Discord bot that runs your league so you don't have to.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto px-12" onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
              Add to Server
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-12" onClick={() => window.open(DISCORD_SUPPORT_URL, '_blank')}>
              Join Our Community
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats / Proof */}
      <section className="py-12 border-y border-white/5 bg-trilo-dark/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'AI-Powered Matchups', icon: <Zap size={24} className="text-trilo-orange" /> },
              { label: 'Team Management', icon: <Users size={24} className="text-trilo-orange" /> },
              { label: 'Attribute Points', icon: <Award size={24} className="text-trilo-orange" /> },
              { label: '24/7 Uptime', icon: <ShieldCheck size={24} className="text-trilo-orange" /> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-trilo-orange/10 border border-trilo-orange/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="text-sm text-gray-400 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Built for Commissioners.</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Everything you need to run your dynasty league<br />professionally without the manual headache.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <Card key={i} className="group relative overflow-hidden">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              {feature.isPro && (
                <div className="absolute top-4 right-4 bg-trilo-orange/10 border border-trilo-orange/20 text-trilo-orange text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Pro Tier</div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-black/40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-10">Start Automating in Seconds.</h2>
              <div className="space-y-8">
                {[
                  { title: "Invite Trilo", desc: "Add our bot to your Discord server in two clicks. No complex OAuth setups required." },
                  { title: "Configure Settings", desc: "Set your commissioner roles and league type (CFB or NFL) using simple slash commands." },
                  { title: "Enjoy Automation", desc: "Let Trilo handle the tedious work of matchups, pings, and attribute point tracking." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-trilo-elevated flex items-center justify-center font-heading font-bold text-xl text-trilo-orange border border-white/5">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-heading font-bold text-white mb-2">{step.title}</h4>
                      <p className="text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-12" onClick={() => navigate('/setup')}>
                View Setup Guide <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-trilo-orange/20 to-transparent rounded-full blur-[80px] absolute inset-0" />
              <Card hover={false} className="relative z-10 p-0 border-white/10 overflow-hidden shadow-2xl">
                <div className="bg-trilo-elevated/50 p-4 border-b border-white/5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/30" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                    <div className="w-3 h-3 rounded-full bg-green-500/30" />
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-4">Discord Bot UI Preview</div>
                </div>
                <div className="p-6 bg-[#0B0B0B] font-mono text-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-trilo-orange to-trilo-yellow flex items-center justify-center font-bold text-white text-xs">
                      T
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">Trilo</span>
                        <span className="text-[10px] bg-[#5865F2] px-1 rounded text-white font-sans font-medium">APP</span>
                        <span className="text-gray-500 text-[11px]">Today at 4:20 PM</span>
                      </div>
                      <div className="text-gray-300">
                        <div className="bg-[#1A1A1A] border-l-4 border-trilo-orange p-3 rounded-r-md">
                          <div className="font-bold text-white mb-1">Matchups Created: Week 1</div>
                          <p className="text-gray-400 text-xs">Successfully created 6 matchups in category <span className="text-trilo-yellow font-bold">"Week 1"</span>.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="bg-gradient-to-br from-trilo-orange to-trilo-yellow p-1 rounded-3xl">
          <div className="bg-trilo-dark rounded-[22px] py-20 px-6 text-center overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6">READY TO TAKE CONTROL?</h2>
              <p className="text-xl text-gray-400 max-w-xl mx-auto mb-10">Stop spending hours on spreadsheets. Join the future of dynasty league management today.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto px-12" onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
                  Add to Server
                </Button>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white" onClick={() => navigate('/pricing')}>
                  View Pricing <ChevronRight size={20} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
