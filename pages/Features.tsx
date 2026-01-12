
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, Target, Megaphone, Settings, Trophy, ShieldCheck, Check } from 'lucide-react';
import { Card } from '../components/UI/Card';

export const Features: React.FC = () => {
  const detailedFeatures = [
    {
      id: "matchups",
      title: "Matchup Engine",
      icon: <Zap className="w-8 h-8 text-trilo-orange" />,
      tagline: "Total automation of league scheduling.",
      bullets: [
        "AI Image Recognition (Pro): Upload a screenshot of your schedule, and Trilo does the rest.",
        "Bulk Creation: Add an entire season in minutes with smart text parsing.",
        "Category Logic: Automatically organizes games into Discord categories for better flow.",
        "Role Pings: Ensures both users are alerted when their game channel is ready."
      ]
    },
    {
      id: "teams",
      title: "Team Management",
      icon: <Users className="w-8 h-8 text-trilo-orange" />,
      tagline: "Track owners and teams with ease.",
      bullets: [
        "Dynamic Assignments: Bind Discord users to specific team names (Oregon, Buckeyes, etc.).",
        "Who-Has Logic: Instantly see who owns which team with a simple slash command.",
        "One-Click Resets: Easily clear individual assignments or reset the whole league for a new season.",
        "Automatic Updates: Team lists refresh automatically when assignments change."
      ]
    },
    {
      id: "attributes",
      title: "Attribute Points",
      icon: <Target className="w-8 h-8 text-trilo-orange" />,
      tagline: "Gamify your league progression.",
      bullets: [
        "Point Banking: Give users currency for participation or winning milestones.",
        "Request System: Users can spend points to request specific player attribute upgrades.",
        "Commish Dashboard: View, approve, or deny all pending upgrades in one consolidated view.",
        "Audit Logs: Every upgrade and point transaction is logged for transparency."
      ]
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6">UNMATCHED POWER.</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Trilo isn't just a bot; it's a full operating system for your Discord dynasty sports league.
          </p>
        </motion.div>

        <div className="space-y-32">
          {detailedFeatures.map((f, i) => (
            <div key={f.id} className={`flex flex-col lg:flex-row gap-16 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="mb-6">{f.icon}</div>
                <h2 className="text-4xl font-heading font-bold text-white mb-2">{f.title}</h2>
                <p className="text-trilo-orange font-heading font-semibold text-lg mb-8">{f.tagline}</p>
                <ul className="space-y-4">
                  {f.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-4 items-start text-gray-400">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-trilo-orange/10 flex items-center justify-center text-trilo-orange">
                        <Check size={12} />
                      </div>
                      <span className="text-lg">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <Card className="aspect-video bg-trilo-elevated/20 flex items-center justify-center border-white/10 group overflow-hidden">
                   <div className="text-center p-8 transition-transform group-hover:scale-105 duration-500">
                      <Zap size={64} className="text-white/10 mb-4 mx-auto" />
                      <p className="text-white/20 font-heading font-bold uppercase tracking-widest text-sm">Visual Preview Coming Soon</p>
                   </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
