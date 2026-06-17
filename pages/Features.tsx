import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, Target, Check, ArrowRight, ChevronRight, Clock, MessageSquare, Calendar, Bell, BarChart3, AlertTriangle } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { MatchupPreview } from '../components/MatchupPreview';
import { StaticPreview } from '../components/StaticPreview';
import { AttributeEconomyPreview } from '../components/AttributeEconomyPreview';
import { useNavigate } from 'react-router-dom';
import { BOT_INVITE_URL } from '../constants';

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const detailedFeatures = [
    {
      id: "matchups",
      title: "Matchup Engine",
      icon: <Zap className="w-8 h-8 text-trilo-orange" />,
      tagline: "Total scheduling and channel orchestration.",
      preview: <MatchupPreview />,
      bullets: [
        "AI Image Recognition: Screenshot a schedule, upload, and watch Trilo extract games.",
        "Bulk Category Creation: Organize matchups into clean Discord category blocks automatically.",
        "Duo Role Pings: Ping both matchup owners automatically when channels are built.",
        "Streamlined Matchups: Track weekly channels and cleanup legacy runs with simple commands."
      ]
    },
    {
      id: "teams",
      title: "Team Management",
      icon: <Users className="w-8 h-8 text-trilo-orange" />,
      tagline: "Sync owners to roster teams instantly.",
      preview: <StaticPreview title="TEAM MANAGEMENT" imageSrc="/teams.jpg" imageAlt="Team Management Preview" />,
      bullets: [
        "Interactive Binding: Map Discord users to specific team names (Ducks, Buckeyes, etc.).",
        "Roster Search: Query instantly to find ownership details inside Discord channels.",
        "Reset Utilities: Clear individual assignments or reset the whole roster registry for new seasons.",
        "Active Live Lists: Automatically update dynamic command readouts when owners change."
      ]
    },
    {
      id: "attributes",
      title: "Attribute Points",
      icon: <Target className="w-8 h-8 text-trilo-orange" />,
      tagline: "Gamify progression and track currencies.",
      preview: <AttributeEconomyPreview />,
      bullets: [
        "Progression Ledger: Award and deduct point balances for participation and wins.",
        "Upgrade Store: Let league members spend points to submit player attribute boosts.",
        "Approval Queue: View, approve, or deny progression boosts in a commissioner channel.",
        "Transaction Auditing: Track every ledger change in a dedicated admin log channel."
      ]
    }
  ];

  return (
    <div className="pt-36 pb-20 field-grid">
      <div className="noise-bg fixed inset-0 z-[-1]" />
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Pain Point Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-trilo-orange text-xs uppercase tracking-widest font-heading font-bold mb-2 block">DIRECTIVE OVERVIEW</span>
          <h1 className="text-5xl md:text-8xl font-heading font-extrabold text-white uppercase tracking-tight leading-none athletic-tracking">
            UNCOMPROMISING <br />CONTROL.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mt-4 uppercase tracking-wide font-heading font-bold">
            Trilo replaces spreadsheet friction with solid, automated Discord frameworks.
          </p>
        </motion.div>

        {/* The Problem (Scouting Report: League Penalties) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-4xl mx-auto mb-24 relative overflow-hidden bg-[#161819] border-2 border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.03)] rounded-none"
        >
          {/* Header Diagonal Banner */}
          <div className="absolute top-0 right-0 bg-red-600 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-8 py-1.5 rotate-45 translate-x-6 translate-y-3 shadow-md z-20">
            CRITICAL
          </div>

          <div className="p-8 lg:p-10 relative">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-red-500/20">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block font-bold">DIAGNOSTIC REPORT</span>
                  <h3 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider leading-none mt-1">COMMISSIONER PENALTIES</h3>
                </div>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">STATUS: CRITICAL LEAGUE FRICTION</span>
              </div>
            </div>

            {/* Penalties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  code: "PENALTY #01",
                  title: "DELAYED KICKOFF",
                  desc: "Spending hours manually building matchups week after week.",
                  sub: "Manual Matchups",
                  icon: <Clock className="w-4 h-4" />
                },
                {
                  code: "PENALTY #02",
                  title: "DELAY OF GAME",
                  desc: "Chasing league owners across multiple channels and DMs.",
                  sub: "DM Gridlock",
                  icon: <MessageSquare className="w-4 h-4" />
                },
                {
                  code: "PENALTY #03",
                  title: "BAD SNAP",
                  desc: "Messy cell formulas and broken sheets tracking attributes.",
                  sub: "Broken Formulas",
                  icon: <Calendar className="w-4 h-4" />
                }
              ].map((penalty, idx) => (
                <div key={idx} className="relative bg-[#1a1d1f] border border-red-500/15 p-6 flex flex-col justify-between group hover:border-red-500/40 transition-all duration-300">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500/30" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono text-red-500 font-bold">{penalty.code}</span>
                      <div className="text-red-500/40 group-hover:text-red-500/80 transition-colors">
                        {penalty.icon}
                      </div>
                    </div>
                    <h4 className="text-white font-heading font-extrabold text-lg uppercase tracking-wider mb-3 group-hover:text-red-400 transition-colors">
                      {penalty.title}
                    </h4>
                    <p className="text-gray-400 text-xs font-sans leading-relaxed">
                      {penalty.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-red-500/10 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">{penalty.sub}</span>
                    <span className="text-[9px] font-mono text-red-500/60 uppercase font-bold tracking-widest group-hover:text-red-500 transition-colors">SYSTEM LOSS</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Inscription */}
            <div className="mt-8 pt-8 border-t border-red-500/20 text-center relative">
              <p className="text-gray-300 uppercase tracking-widest text-xs font-heading font-extrabold">
                Trilo wipes the chalkboard clean. <span className="text-trilo-orange">PERMANENTLY.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Features */}
        <div className="space-y-36 mb-36">
          {detailedFeatures.map((f, i) => (
            <div key={f.id} className={`flex flex-col lg:flex-row gap-16 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-grow flex-shrink-0 lg:max-w-md">
                <div className="w-12 h-12 rounded-none bg-trilo-orange/10 border border-trilo-orange/20 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h2 className="text-4xl font-heading font-extrabold text-white uppercase tracking-wider">{f.title}</h2>
                <p className="text-trilo-orange font-heading font-extrabold uppercase tracking-widest text-xs mt-1 mb-8">{f.tagline}</p>
                <ul className="space-y-4">
                  {f.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-4 items-start text-gray-400">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-none bg-trilo-orange/10 border border-trilo-orange/30 flex items-center justify-center text-trilo-orange">
                        <Check size={12} />
                      </div>
                      <span className="text-sm font-sans font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full max-w-[550px] aspect-square border-2 border-white/10 p-2 bg-[#111315]/85 mx-auto">
                <div className="w-full h-full">{f.preview}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Extras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-36"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white text-center uppercase tracking-wider mb-12">ADDITIONAL PLAYS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Bell className="w-6 h-6 text-trilo-orange" />, title: "Live Streams alerts", desc: "Tag server roles and announce live feeds automatically when members start streaming." },
              { icon: <BarChart3 className="w-6 h-6 text-trilo-orange" />, title: "Progressive analytics", desc: "Future dashboard features to trace roster activations and member engagement stats." },
              { icon: <Calendar className="w-6 h-6 text-trilo-orange" />, title: "Season archiving", desc: "Archive completed schedules and roll over player registers with seasonal sync commands." },
            ].map((item, i) => (
              <Card key={i} className="text-center flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-none bg-trilo-orange/10 border border-trilo-orange/20 flex items-center justify-center mx-auto mb-6">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-heading font-bold text-white uppercase tracking-wider mb-3">{item.title}</h4>
                  <p className="text-gray-400 text-xs font-sans leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Playbook Comparison Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-36"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white text-center uppercase tracking-wider mb-12">
            SCOUTING COMPARISON
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Spreadsheet Play */}
            <div className="bg-[#191212] border-2 border-red-500/20 p-8 relative">
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block mb-4">FAILED PLAYBOOK (SPREADSHEET)</span>
              <h4 className="text-white font-heading font-extrabold text-xl uppercase tracking-wider mb-6">Manual Administration</h4>
              <ul className="space-y-4 text-xs font-heading font-bold uppercase tracking-wider text-gray-400">
                <li className="flex items-center gap-3 text-red-500/80"><span className="text-lg font-bold">✗</span> Create matchup chats one by one</li>
                <li className="flex items-center gap-3 text-red-500/80"><span className="text-lg font-bold">✗</span> Copy/paste rosters from separate logs</li>
                <li className="flex items-center gap-3 text-red-500/80"><span className="text-lg font-bold">✗</span> Ping participants individually in DMs</li>
                <li className="flex items-center gap-3 text-red-500/80"><span className="text-lg font-bold">✗</span> Balance upgrade points in broken sheets</li>
                <li className="flex items-center gap-3 text-red-500/80"><span className="text-lg font-bold">✗</span> 4+ Admin hours spent weekly</li>
              </ul>
            </div>

            {/* Trilo Play */}
            <div className="bg-[#1a1d1f] border-2 border-trilo-orange/40 p-8 relative">
              <span className="text-[10px] font-mono text-trilo-orange uppercase tracking-widest block mb-4">SUCCESSFUL PLAYBOOK (TRILO)</span>
              <h4 className="text-white font-heading font-extrabold text-xl uppercase tracking-wider mb-6">Trilo Orchestration</h4>
              <ul className="space-y-4 text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
                <li className="flex items-center gap-3"><span className="text-trilo-orange text-lg">✓</span> Upload schedule → instant channels</li>
                <li className="flex items-center gap-3"><span className="text-trilo-orange text-lg">✓</span> Query team ownership within Discord</li>
                <li className="flex items-center gap-3"><span className="text-trilo-orange text-lg">✓</span> Automated pings to both opponents</li>
                <li className="flex items-center gap-3"><span className="text-trilo-orange text-lg">✓</span> Native progression points registry</li>
                <li className="flex items-center gap-3"><span className="text-trilo-orange text-lg">✓</span> Minutes per week, not hours</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Testimonials - Scouting Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-36"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white text-center uppercase tracking-wider mb-4">
            COMMISH SCOUTING REPORTS
          </h2>
          <p className="text-gray-400 text-center uppercase tracking-widest text-xs font-heading font-bold mb-12">Reviews from the league operations center</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[#181a1c] flex flex-col justify-between">
              <p className="text-gray-300 mb-6 italic text-sm font-sans">
                "Trilo has completely redefined how I operate my college fantasy football server. Creating matchups via screenshots saved my Sundays."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-none border-2 border-trilo-orange/30 bg-trilo-orange/10 flex items-center justify-center text-trilo-orange font-heading font-extrabold text-lg">C</div>
                <div>
                  <p className="text-white font-heading font-bold uppercase tracking-wider text-sm">CFB Dynasty Commissioner</p>
                  <p className="text-gray-500 font-mono text-[10px] uppercase">32 Teams Assigned</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#181a1c] flex flex-col justify-between">
              <p className="text-gray-300 mb-6 italic text-sm font-sans">
                "The point banking ledger is excellent. Upgrades are submitted by owners, and I can approve them in one channel. Highly recommend."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-none border-2 border-trilo-orange/30 bg-trilo-orange/10 flex items-center justify-center text-trilo-orange font-heading font-extrabold text-lg">M</div>
                <div>
                  <p className="text-white font-heading font-bold uppercase tracking-wider text-sm">Madden League Admin</p>
                  <p className="text-gray-500 font-mono text-[10px] uppercase">64 Active Roster bindings</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Pricing Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-36"
        >
          <div className="inline-flex items-center gap-2 border-2 border-trilo-orange/30 bg-trilo-orange/5 px-4 py-1.5 mb-6 select-none">
            <span className="text-trilo-orange text-xs font-heading font-bold uppercase tracking-wider">PLANS FROM $4.99/MO</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 uppercase tracking-wider">
            LESS COST. BETTER AUTOMATION.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8 uppercase tracking-wide text-xs font-heading font-bold">
            Select a season-ticket license to power one Discord server completely.
          </p>
          <Button size="lg" onClick={() => navigate('/pricing')}>
            View Season Pricing
          </Button>
        </motion.div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto border-2 border-trilo-orange/40 bg-[#1a1d1f] p-12 text-center relative overflow-hidden shine-sweep">
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-trilo-orange opacity-60" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-trilo-orange opacity-60" />
          
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 uppercase tracking-wider">AUTOMATE THE SEASON</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-xs uppercase tracking-widest font-heading font-bold">
            Invite Trilo to your server and initialize automation in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
              Add to Server <ArrowRight className="ml-2" size={16} />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/pricing')}>
              View Pricing <ChevronRight className="ml-1" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
