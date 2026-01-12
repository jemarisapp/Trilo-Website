
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Copy, Check, Search,
  Terminal as TerminalIcon, ShieldAlert, Zap,
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
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Sidebar Navigation */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-8">
              <div>
                <h4 className="font-heading font-bold text-white mb-4 uppercase tracking-widest text-xs">League Progress</h4>
                <div className="w-full bg-trilo-elevated h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-trilo-orange h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-gray-500 text-xs font-semibold">{progressPercent || 0}% Setup Completed</p>
              </div>

              <nav className="space-y-1">
                {filteredGuide.map(section => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToId(section.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium group text-left"
                  >
                    <span className="text-gray-400 group-hover:text-white transition-colors">{section.title}</span>
                    {section.steps.length > 0 && section.steps.every(s => completedSteps.includes(s.id)) && (
                      <CheckCircle2 size={14} className="text-green-500" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Setup Guide</h1>
              <p className="text-gray-400 mb-8">Follow this interactive guide to get Trilo configured for your server in minutes.</p>

              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search commands..."
                  className="w-full bg-trilo-elevated border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-trilo-orange transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </header>

            <div className="space-y-16">
              {filteredGuide.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-heading font-bold text-white">{section.title}</h2>
                    <div className="h-px bg-white/5 flex-1" />
                  </div>
                  <p className="text-gray-400 mb-8">{section.description}</p>

                  <div className="space-y-6">
                    {section.steps.map((step) => (
                      <Card key={step.id} hover={false} className="p-0 border-white/5 overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="p-0 sm:p-6 flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-trilo-orange font-bold px-2 py-0.5 bg-trilo-orange/10 rounded">{step.id}</span>
                                <h3 className="text-lg font-heading font-bold text-white">
                                  {step.displayTitle || step.title}
                                </h3>
                              </div>
                              {step.isPro && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-trilo-yellow uppercase bg-trilo-yellow/10 px-2 py-0.5 rounded border border-trilo-yellow/20">
                                  <Zap size={10} /> Pro Tier
                                </span>
                              )}
                            </div>

                            {step.notes && (
                              <div className="flex gap-2 text-sm text-gray-400 mb-6 bg-white/5 p-3 rounded-lg border border-white/5">
                                <ShieldAlert size={16} className="text-trilo-yellow flex-shrink-0 mt-0.5" />
                                <span>{step.notes}</span>
                              </div>
                            )}

                            {step.command ? (
                              <div className="relative group">
                                <div className="bg-[#0B0B0B] rounded-xl p-4 pr-12 font-mono text-sm text-trilo-yellow border border-white/5 overflow-x-auto whitespace-nowrap scrollbar-hide">
                                  {step.command}
                                </div>
                                <button
                                  onClick={() => copyToClipboard(step.command!, step.id)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
                                >
                                  {copiedId === step.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                              </div>
                            ) : step.button ? (
                              <Button
                                className="w-full sm:w-auto"
                                onClick={() => window.open(step.button!.url, '_blank')}
                              >
                                {step.button.label} <ExternalLink size={16} className="ml-2" />
                              </Button>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleStep(step.id)}
                            className={`w-full sm:w-20 mt-4 sm:mt-0 py-4 sm:py-0 flex items-center justify-center transition-colors border-t sm:border-t-0 sm:border-l border-white/5 ${completedSteps.includes(step.id) ? 'bg-green-500/10 text-green-500' : 'bg-transparent text-gray-600 hover:text-white hover:bg-white/5'}`}
                          >
                            {completedSteps.includes(step.id) ? <CheckCircle2 size={24} /> : <Circle size={24} />}
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