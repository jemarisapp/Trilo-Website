import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, Play, Terminal, HelpCircle, Trophy, Sparkles, AlertTriangle } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { BOT_INVITE_URL, DISCORD_SUPPORT_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

// Chalkboard SVG Tactical Animations
const ChalkboardPlay1 = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full stroke-white/80 fill-none stroke-[2]" strokeLinecap="round" strokeDasharray="6 6">
    <text x="40" y="45" className="fill-white/30 font-mono text-[10px] tracking-widest stroke-none">PLAY 01: SCHEDULE SCAN OCR</text>
    <circle cx="80" cy="110" r="14" className="stroke-trilo-orange/80" />
    <text x="75" y="115" className="fill-trilo-orange font-heading text-sm font-bold stroke-none">X1</text>
    <circle cx="80" cy="190" r="14" className="stroke-trilo-yellow/80" />
    <text x="75" y="195" className="fill-trilo-yellow font-heading text-sm font-bold stroke-none">X2</text>
    
    <motion.path 
      d="M 100 110 C 180 110, 180 150, 250 150" 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="stroke-trilo-orange"
    />
    <motion.path 
      d="M 100 190 C 180 190, 180 150, 250 150" 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
      className="stroke-trilo-yellow"
    />
    
    <rect x="260" y="115" width="110" height="70" rx="2" className="stroke-white/40" />
    <text x="272" y="138" className="fill-white/60 font-heading text-[11px] font-bold stroke-none">MATCHUP CHANNEL</text>
    <text x="272" y="156" className="fill-trilo-orange font-mono text-[9px] stroke-none">#week-1-matchup</text>
    <text x="272" y="172" className="fill-white/30 font-mono text-[8px] stroke-none">PING: @X1 VS @X2</text>
  </svg>
);

const ChalkboardPlay2 = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full stroke-white/80 fill-none stroke-[2]" strokeLinecap="round" strokeDasharray="6 6">
    <text x="40" y="45" className="fill-white/30 font-mono text-[10px] tracking-widest stroke-none">PLAY 02: TEAM ALLOCATION</text>
    <circle cx="100" cy="150" r="18" className="stroke-white/30" />
    <text x="91" y="154" className="fill-white/50 font-heading text-xs font-bold stroke-none">USER</text>

    <motion.path 
      d="M 130 150 Q 200 90 260 140" 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
      className="stroke-trilo-orange"
    />
    <text x="160" y="95" className="fill-trilo-orange font-mono text-[9px] stroke-none">/teams assign</text>

    <rect x="270" y="120" width="90" height="60" rx="2" className="stroke-trilo-orange" />
    <text x="285" y="145" className="fill-trilo-orange font-heading text-xs font-bold stroke-none">OREGON DUCKS</text>
    <text x="285" y="163" className="fill-white/30 font-mono text-[8px] stroke-none">STATUS: ASSIGNED</text>
  </svg>
);

const ChalkboardPlay3 = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full stroke-white/80 fill-none stroke-[2]" strokeLinecap="round" strokeDasharray="6 6">
    <text x="40" y="45" className="fill-white/30 font-mono text-[10px] tracking-widest stroke-none">PLAY 03: UPGRADE ECONOMY</text>
    
    {/* Commish Node */}
    <circle cx="80" cy="110" r="18" className="stroke-white/30" />
    <text x="80" y="113" textAnchor="middle" className="fill-white/50 font-heading text-[9px] font-bold stroke-none">COMMISH</text>

    {/* Player WR Node */}
    <circle cx="80" cy="200" r="18" className="stroke-white/20" />
    <text x="80" y="203" textAnchor="middle" className="fill-white/40 font-mono text-[9px] stroke-none">WR #88</text>

    {/* Commish Approval Path */}
    <motion.path 
      d="M 98 110 C 180 110, 180 140, 260 140" 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8 }}
      className="stroke-trilo-yellow"
    />
    {/* Commish Arrowhead */}
    <path d="M 252 136 L 260 140 L 252 145" className="stroke-trilo-yellow" strokeWidth="2" strokeDasharray="none" />
    <text x="180" y="98" textAnchor="middle" className="fill-trilo-yellow font-mono text-[8px] stroke-none">APPROVES UPGRADE</text>

    {/* WR Roster Progression Route */}
    <motion.path 
      d="M 98 200 C 180 200, 180 150, 260 150" 
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="stroke-trilo-orange"
    />
    {/* WR Route Arrowhead */}
    <path d="M 252 145 L 260 150 L 252 154" className="stroke-trilo-orange" strokeWidth="2" strokeDasharray="none" />
    <text x="180" y="222" textAnchor="middle" className="fill-trilo-orange font-mono text-[8px] stroke-none">SPENDS CURRENCY</text>

    {/* Upgrade Success Target */}
    <polygon points="290,120 294,133 308,133 297,141 301,154 290,145 279,154 283,141 272,133 286,133" className="stroke-trilo-yellow fill-trilo-yellow/10" />
    <text x="290" y="172" textAnchor="middle" className="fill-white/70 font-heading text-[10px] font-bold stroke-none">SPEED BOOST</text>
    <text x="290" y="185" textAnchor="middle" className="fill-white/30 font-mono text-[7px] stroke-none">UPGRADE SUCCESS</text>
  </svg>
);

const SIM_COMMANDS = [
  {
    name: "OCR Scheduling",
    command: "/matchups create-from-image category_name:Week-5 image:schedule.jpg",
    terminalOutput: "Initializing Schedule OCR scanner...\nDetected Week 5 schedule screenshot.\nExtracting matchups...\nFound 3 matchups.\nCreating channels...",
    discordOutput: {
      title: "Matchups Created: Week 5",
      description: "Successfully processed schedule screenshot and created 3 weekly channels under category Week 5.",
      details: [
        "🔊 #oregon-vs-buckeyes (Week 5)",
        "🔊 #gators-vs-tide (Week 5)",
        "🔊 #longhorns-vs-sooners (Week 5)"
      ],
      tag: "OCR SUCCESS",
      borderColor: "border-l-4 border-trilo-orange",
      tagColor: "bg-trilo-orange/10 text-trilo-orange border border-trilo-orange/20"
    }
  },
  {
    name: "Award Points",
    command: "/attributes give user:@commissioner amount:150",
    terminalOutput: "Connecting to secure license registry...\nUpdating balance for @commissioner...\nLogging ledger transaction...",
    discordOutput: {
      title: "Attribute Points Awarded",
      description: "Commissioner points ledger updated successfully.",
      details: [
        "Recipient: @commissioner",
        "Points Awarded: +150 Points",
        "New Balance: 420 Points",
        "Transaction Logged: #attribute-logs"
      ],
      tag: "LEDGER SYNC",
      borderColor: "border-l-4 border-trilo-yellow",
      tagColor: "bg-trilo-yellow/10 text-trilo-yellow border border-trilo-yellow/20"
    }
  },
  {
    name: "Team Sync",
    command: "/teams assign-user user:@coach team_name:Ohio-State",
    terminalOutput: "Verifying user registration...\nBinding Discord ID to Ohio State Buckeyes Team...",
    discordOutput: {
      title: "Team Assignment Complete",
      description: "Team roster ownership bind completed for the current season.",
      details: [
        "User Bind: @coach",
        "Assigned Team: Ohio State Buckeyes 🌰",
        "Status: Active Owner",
        "Team Registry: Synchronized"
      ],
      tag: "TEAM SYNC",
      borderColor: "border-l-4 border-indigo-400",
      tagColor: "bg-indigo-400/10 text-indigo-400 border border-indigo-400/20"
    }
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activePlay, setActivePlay] = useState(0);
  const [simIndex, setSimIndex] = useState(0);
  const [simState, setSimState] = useState<'idle' | 'typing' | 'running' | 'done'>('idle');
  const [typedText, setTypedText] = useState("");
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const plays = [
    {
      title: "Play #01: Matchup OCR",
      tagline: "OCR scheduling automation",
      desc: "Tired of creating matchups by hand? Capture your franchise schedules, upload the image, and let Trilo automatically build, tag, and configure game channels.",
      component: <ChalkboardPlay1 />
    },
    {
      title: "Play #02: Team Sync",
      tagline: "Discord-to-Team bindings",
      desc: "Ditch the external text files. Bind Discord accounts to teams. Run search queries like /teams who-owns to resolve matchups instantly inside your server.",
      component: <ChalkboardPlay2 />
    },
    {
      title: "Play #03: Attribute Economy",
      tagline: "Dynasty upgrade tracking",
      desc: "Gamify your leagues. Reward players for activity, manage balances, and handle player progression requests with a complete ledger approval system.",
      component: <ChalkboardPlay3 />
    }
  ];

  const runSimulation = (index: number) => {
    if (typingTimer.current) clearInterval(typingTimer.current);
    setSimIndex(index);
    setSimState('typing');
    setTypedText("");
    
    const targetCommand = SIM_COMMANDS[index].command;
    let charIdx = 0;
    
    typingTimer.current = setInterval(() => {
      if (charIdx < targetCommand.length) {
        setTypedText(prev => prev + targetCommand.charAt(charIdx));
        charIdx++;
      } else {
        if (typingTimer.current) clearInterval(typingTimer.current);
        setSimState('running');
        setTimeout(() => {
          setSimState('done');
        }, 1200);
      }
    }, 30);
  };

  useEffect(() => {
    runSimulation(0);
    return () => {
      if (typingTimer.current) clearInterval(typingTimer.current);
    };
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen field-grid">
      <div className="noise-bg fixed inset-0 z-[-1]" />

      {/* Hero Section */}
      <section className="pt-36 pb-20 md:pt-52 md:pb-28 container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >


          <h1 className="text-6xl md:text-9xl uppercase font-heading font-extrabold tracking-tighter text-white mb-6 max-w-6xl mx-auto leading-[0.85] athletic-tracking">
            DYNASTY LEAGUE <br />MANAGEMENT, <span className="text-trilo-orange">AUTOMATED</span>.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 uppercase tracking-wide font-heading font-semibold">
            The tactical Discord coordinator that runs team syncs, schedules, and progression ledgers for your franchise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
              Add to Server
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => window.open(DISCORD_SUPPORT_URL, '_blank')}>
              Join Support Discord
            </Button>
          </div>
        </motion.div>

        {/* Hero visual: Before/After Slider */}
        <div className="mt-20 max-w-4xl mx-auto border-2 border-white/10 p-2 bg-[#111315]/85">
          <BeforeAfterSlider />
        </div>
      </section>

      {/* Playbook Chalkboard Section */}
      <section className="py-24 container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="text-trilo-orange text-xs uppercase tracking-widest font-heading font-bold mb-2">OPERATIONS DIRECTIVE</p>
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white uppercase tracking-tight">THE LEAGUE PLAYBOOK</h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-2 text-sm">Review the core strategic plays programmed directly into Trilo's automation framework.</p>
        </div>

        {/* Chalkboard Board */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 max-w-5xl mx-auto">
          {/* Play Selector */}
          <div className="flex flex-col gap-3">
            {plays.map((play, idx) => {
              const active = activePlay === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActivePlay(idx)}
                  className={`text-left p-5 border-2 transition-all duration-300 ${
                    active 
                      ? 'border-trilo-orange bg-trilo-orange/10 shadow-[4px_4px_0px_rgba(255,107,53,0.15)]' 
                      : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <h4 className="font-heading font-bold text-lg text-white uppercase tracking-wider">{play.title}</h4>
                  <p className="text-xs uppercase tracking-widest text-trilo-orange mt-1 font-semibold">{play.tagline}</p>
                </button>
              );
            })}
          </div>

          {/* Chalkboard Canvas Box */}
          <div className="chalkboard-bg p-6 relative flex flex-col justify-between min-h-[350px] overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-600/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-600/80" />
            </div>

            <div className="flex-grow flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex-1 text-left">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">TACTICAL PLANNER</span>
                <h3 className="text-2xl font-heading font-bold text-white uppercase mt-1 tracking-wider">{plays[activePlay].title.split(': ')[1]}</h3>
                <p className="text-white/70 text-sm mt-3 leading-relaxed font-sans">{plays[activePlay].desc}</p>
              </div>
              <div className="flex-1 w-full max-w-[280px] aspect-square relative bg-black/20 border border-white/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePlay}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    {plays[activePlay].component}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works: Commish Command Simulator */}
      <section className="py-24 border-t border-b border-white/5 bg-[#111315]/65 relative z-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Simulation Controller */}
            <div className="flex-1 text-left">
              <span className="text-trilo-orange text-xs uppercase tracking-widest font-heading font-bold">INTERACTIVE SIMULATOR</span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white uppercase mt-2 leading-none">TEST COMMISH COMMANDS</h2>
              <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                Click any of the playbook command buttons below to watch the simulated terminal run the sequence and outputs in Discord:
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {SIM_COMMANDS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => runSimulation(idx)}
                    className={`flex items-center justify-between p-4 border-2 transition-all ${
                      simIndex === idx
                        ? 'border-trilo-orange bg-trilo-orange/5'
                        : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                    }`}
                  >
                    <span className="font-heading font-bold text-white text-sm uppercase tracking-wider">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-gray-500 hidden md:block">
                        {item.command.split(" ")[0]}
                      </code>
                      <Play size={12} className={`${simIndex === idx ? 'text-trilo-orange' : 'text-gray-600'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Terminal / UI Visual */}
            <div className="flex-1 w-full max-w-lg">
              <div className="border-2 border-white/10 bg-[#070908] overflow-hidden shadow-2xl">
                {/* Visual Header */}
                <div className="bg-[#24272a] p-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-trilo-orange" />
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">TRILO SIMULATOR TERMINAL</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-trilo-orange/50" />
                  </div>
                </div>

                {/* Simulated Screen */}
                <div className="p-5 font-mono text-xs text-left min-h-[280px] flex flex-col justify-between">
                  {/* Command Row */}
                  <div>
                    <div className="flex items-start gap-1.5 text-gray-500 mb-2">
                      <span>$</span>
                      <span className="text-white font-bold">{typedText}</span>
                      {simState === 'typing' && <span className="w-1.5 h-3.5 bg-trilo-orange animate-pulse" />}
                    </div>

                    {/* Console Log */}
                    {(simState === 'running' || simState === 'done') && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-trilo-yellow whitespace-pre-line leading-relaxed border-l border-white/10 pl-3 my-3"
                      >
                        {SIM_COMMANDS[simIndex].terminalOutput}
                      </motion.div>
                    )}
                  </div>

                  {/* Discord Result Frame */}
                  <AnimatePresence>
                    {simState === 'done' && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 border-t border-white/5 pt-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-none border border-trilo-orange/30 bg-trilo-orange/10 flex items-center justify-center font-heading font-extrabold text-trilo-orange text-xs">
                            T
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span className="font-bold text-white text-xs font-sans">Trilo</span>
                              <span className="text-[9px] bg-[#5865F2] px-1 rounded text-white font-sans font-bold">APP</span>
                              <span className="text-[9px] text-gray-500 font-sans">Today</span>
                            </div>

                            {/* Embed Card */}
                            <div className={`bg-[#181a1c] border-2 ${SIM_COMMANDS[simIndex].discordOutput.borderColor} p-3 rounded-none`}>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-heading font-extrabold text-sm uppercase tracking-wider">{SIM_COMMANDS[simIndex].discordOutput.title}</h4>
                                <span className={`text-[8px] font-mono px-1 rounded ${SIM_COMMANDS[simIndex].discordOutput.tagColor}`}>
                                  {SIM_COMMANDS[simIndex].discordOutput.tag}
                                </span>
                              </div>
                              <p className="text-gray-400 text-[11px] mb-2 leading-relaxed font-sans">{SIM_COMMANDS[simIndex].discordOutput.description}</p>
                              
                              <div className="space-y-1 bg-black/30 p-2 border border-white/5 font-sans">
                                {SIM_COMMANDS[simIndex].discordOutput.details.map((detail, dIdx) => (
                                  <div key={dIdx} className="text-gray-300 text-[10px] flex items-center gap-1.5">
                                    <span className="text-trilo-orange">▪</span>
                                    <span>{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-24 container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto border-2 border-trilo-orange/40 bg-[#1a1d1f] p-12 text-center relative overflow-hidden shine-sweep">
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-trilo-orange opacity-60" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-trilo-orange opacity-60" />

          <span className="text-trilo-orange text-xs uppercase tracking-widest font-heading font-bold mb-4 block">READY FOR KICKOFF</span>
          <h2 className="text-4xl md:text-7xl font-heading font-extrabold text-white uppercase tracking-tight athletic-tracking">
            UNLEASH THE PLAYBOOK
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto mb-10 text-sm mt-3 uppercase tracking-wide">
            Automate matchups, pointProgression ledgers, and team sync assignments today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button size="lg" className="w-full sm:w-auto px-10" onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
              Add to Server
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-10" onClick={() => navigate('/pricing')}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
