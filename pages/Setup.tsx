import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Copy, Check, Search,
  Terminal as TerminalIcon, ShieldAlert,
  Menu, ChevronDown, ChevronRight, ExternalLink
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { SETUP_GUIDE } from '../constants';

export const Setup: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('trilo_setup_progress');
    if (saved) setCompletedSteps(JSON.parse(saved));
  }, []);

  const toggleStep = (id: string) => {
    const updated = completedSteps.includes(id)
      ? completedSteps.filter(s => s !== id)
      : [...completedSteps, id];
    setCompletedSteps(updated);
    localStorage.setItem('trilo_setup_progress', JSON.stringify(updated));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalSteps = SETUP_GUIDE.reduce((acc, section) => acc + section.steps.length, 0);
  const progressPercent = Math.round((completedSteps.length / totalSteps) * 100);

  const filteredGuide = SETUP_GUIDE.map(section => ({
    ...section,
    steps: section.steps.filter(step =>
      step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (step.command && step.command.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(section => section.steps.length > 0 || section.id === 'intro');

  return (
    <div className="pt-36 pb-20 field-grid">
      <div className="noise-bg fixed inset-0 z-[-1]" />
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar Navigation: Tactical Board Room */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-36 border-2 border-white/10 bg-[#181a1c]/90 p-5 space-y-8">
              
              {/* Scoreboard Completion */}
              <div className="text-left">
                <h4 className="font-heading font-extrabold text-white uppercase tracking-wider text-xs mb-3">PLAYBOOK PROGRESS</h4>
                
                {/* Simulated Digital LED display */}
                <div className="bg-[#0a0c0e] border border-white/10 p-3 flex justify-between items-center mb-3">
                  <div className="font-mono text-xl text-trilo-orange font-bold tracking-widest">
                    {String(completedSteps.length).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
                  </div>
                  <span className="font-mono text-[9px] text-trilo-yellow uppercase tracking-widest">COMPLETED</span>
                </div>

                <div className="w-full bg-[#1a1d1f] h-3 border border-white/5 overflow-hidden mb-1">
                  <div
                    className="bg-trilo-orange h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">{progressPercent || 0}% SYNCHRONIZED</p>
              </div>

              {/* Navigation plays */}
              <nav className="space-y-1">
                {filteredGuide.map(section => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToId(section.id)}
                    className="w-full flex items-center justify-between p-2 hover:bg-white/5 transition-colors font-heading text-xs font-bold uppercase tracking-wider text-left border-l-2 border-transparent hover:border-trilo-orange"
                  >
                    <span className="text-gray-400 hover:text-white transition-colors">{section.title}</span>
                    {section.steps.length > 0 && section.steps.every(s => completedSteps.includes(s.id)) && (
                      <CheckCircle2 size={12} className="text-green-500" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Playbook Guide */}
          <main className="flex-1">
            <header className="mb-12">
              <span className="text-trilo-orange text-xs uppercase tracking-widest font-heading font-bold mb-2 block">COMMISSIONER REFERENCE SHEET</span>
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white uppercase tracking-tight">LEAGUE RUN DIRECTIVE</h1>
              <p className="text-gray-400 text-sm mt-2 max-w-xl">
                Follow this sequential playbook to activate license registrations, configure commissioner bounds, and sync weekly matchup schedules.
              </p>

              <div className="relative max-w-md mt-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="SEARCH PLAYBOOK COMMANDS..."
                  className="w-full bg-[#111315] border-2 border-white/10 rounded-none py-3 pl-12 pr-4 font-heading text-xs uppercase tracking-wider text-white placeholder-gray-600 focus:outline-none focus:border-trilo-orange transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </header>

            {/* List of steps */}
            <div className="space-y-16">
              {filteredGuide.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-36">
                  {/* Section Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">{section.title}</h2>
                    <div className="h-[2px] bg-white/5 flex-1 border-b border-dashed border-white/10" />
                  </div>
                  <p className="text-gray-400 text-sm font-sans mb-8 leading-relaxed">{section.description}</p>

                  {/* Step cards */}
                  <div className="space-y-6">
                    {section.steps.map((step) => (
                      <Card key={step.id} hover={false} className="p-0 border-white/10 overflow-hidden bg-[#181a1c]/90 relative">
                        
                        {/* Clipboard metal clip style visual */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#27292c] border-b border-l border-r border-white/10" />
                        
                        <div className="flex flex-col sm:flex-row items-stretch">
                          <div className="p-6 flex-1 text-left">
                            <div className="flex items-center gap-3 mb-4 mt-2">
                              <span className="text-[10px] font-mono text-trilo-orange font-bold px-2 py-0.5 border border-trilo-orange/30 bg-trilo-orange/5">
                                PLAY {step.id}
                              </span>
                              <h3 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider">
                                {step.displayTitle || step.title}
                              </h3>
                            </div>

                            {step.notes && (
                              <div className="flex gap-2 text-xs text-gray-400 mb-6 bg-yellow-500/5 p-3 border border-yellow-500/10">
                                <ShieldAlert size={14} className="text-trilo-yellow flex-shrink-0 mt-0.5" />
                                <span className="font-sans leading-relaxed">{step.notes}</span>
                              </div>
                            )}

                            {step.command ? (
                              <div className="relative group">
                                <div className="bg-[#0a0c0e] border border-white/10 p-4 pr-12 font-mono text-xs text-trilo-yellow overflow-x-auto whitespace-nowrap scrollbar-hide">
                                  {step.command}
                                </div>
                                <button
                                  onClick={() => copyToClipboard(step.command!, step.id)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-none transition-colors text-gray-500 hover:text-white"
                                >
                                  {copiedId === step.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                </button>
                              </div>
                            ) : step.button ? (
                              <Button
                                className="w-full sm:w-auto"
                                onClick={() => window.open(step.button!.url, '_blank')}
                              >
                                {step.button.label} <ExternalLink size={14} className="ml-2" />
                              </Button>
                            ) : null}
                          </div>

                          {/* Completion checkbox toggler */}
                          <button
                            type="button"
                            onClick={() => toggleStep(step.id)}
                            className={`w-full sm:w-20 mt-4 sm:mt-0 py-6 sm:py-0 flex items-center justify-center transition-all border-t sm:border-t-0 sm:border-l border-white/10 ${
                              completedSteps.includes(step.id) 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-transparent text-gray-600 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {completedSteps.includes(step.id) 
                              ? <CheckCircle2 size={24} className="scale-110" /> 
                              : <Circle size={24} />
                            }
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};