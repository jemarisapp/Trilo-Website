
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, Target, Check, ArrowRight, ChevronRight, Clock, Frown, MessageSquare, Calendar, Bell, BarChart3 } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { MatchupPreview } from '../components/MatchupPreview';
import { StaticPreview } from '../components/StaticPreview';
import { useNavigate } from 'react-router-dom';
import { BOT_INVITE_URL } from '../constants';

export const Features: React.FC = () => {
  const navigate = useNavigate();

  const detailedFeatures = [
    {
      id: "matchups",
      title: "Matchup Engine",
      icon: <Zap className="w-8 h-8 text-trilo-orange" />,
      tagline: "Total automation of league scheduling.",
      preview: <MatchupPreview />,
      bullets: [
        "AI Image Recognition: Upload a screenshot of your schedule, and Trilo does the rest.",
        "Bulk Creation: Add an entire week in seconds with smart text parsing.",
        "Category Logic: Automatically organizes games into Discord categories for better flow.",
        "Role Pings: Ensures both users are alerted when it's time to play."
      ]
    },
    {
      id: "teams",
      title: "Team Management",
      icon: <Users className="w-8 h-8 text-trilo-orange" />,
      tagline: "Track owners and teams with ease.",
      preview: <StaticPreview title="TEAM MANAGEMENT" imageSrc="/teams.jpg" imageAlt="Team Management Preview" />,
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
      preview: <StaticPreview title="ATTRIBUTE POINTS" imageSrc="/points.jpg" imageAlt="Attribute Points Preview" />,
      bullets: [
        "Point Banking: Give users currency for participation or winning milestones.",
        "Request System: Users can spend points to request specific player attribute upgrades.",
        "Commish Commands: View, approve, or deny all pending upgrades with simple commands.",
        "Audit Logs: Every upgrade and point transaction is logged for transparency."
      ]
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Pain Point Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6">UNMATCHED POWER.</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Trilo isn't just a bot; it's a full operating system for your Discord dynasty sports league.
          </p>
        </motion.div>

        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-24"
        >
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Frown className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-heading font-bold text-white">Sound familiar?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">Spending hours every week creating matchup channels manually</p>
              </div>
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">Chasing down owners in DMs to remind them about their games</p>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">Tracking attribute points and upgrades in messy spreadsheets</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-red-500/10 text-center">
              <p className="text-gray-300">Trilo eliminates all of this. <span className="text-trilo-orange font-semibold">Completely.</span></p>
            </div>
          </div>
        </motion.div>

        {/* Main Features */}
        <div className="space-y-32 mb-32">
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
                {f.preview ? (
                  <div className="h-full w-full aspect-square lg:aspect-square">{f.preview}</div>
                ) : (
                  <Card className="aspect-video bg-trilo-elevated/20 flex items-center justify-center border-white/10 group overflow-hidden">
                    <div className="text-center p-8 transition-transform group-hover:scale-105 duration-500">
                      <Zap size={64} className="text-white/10 mb-4 mx-auto" />
                      <p className="text-white/20 font-heading font-bold uppercase tracking-widest text-sm">Visual Preview Coming Soon</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* And More Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white text-center mb-12">And that's not all...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Bell className="w-6 h-6 text-trilo-orange" />, title: "Smart Notifications", desc: "Automatic pings when games are ready, results are due, or action is needed." },
              { icon: <BarChart3 className="w-6 h-6 text-trilo-orange" />, title: "Coming: Analytics Dashboard", desc: "Track league activity, game completion rates, and engagement over time." },
              { icon: <Calendar className="w-6 h-6 text-trilo-orange" />, title: "Season Management", desc: "Archive old seasons, reset for new ones, and keep historical data intact." },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-trilo-orange/10 border border-trilo-orange/20 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h4 className="text-lg font-heading font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Why Not Spreadsheets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-32"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white text-center mb-12">Why not just use spreadsheets?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-red-400 font-heading font-bold mb-4">Manual Management</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Create channels one by one</li>
                <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Copy/paste schedules from screenshots</li>
                <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Manually ping each owner</li>
                <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Track points in external spreadsheets</li>
                <li className="flex items-start gap-2"><span className="text-red-400">✗</span> 3+ hours per week of admin work</li>
              </ul>
            </div>
            <div className="bg-trilo-orange/5 rounded-xl p-6 border border-trilo-orange/20">
              <h4 className="text-trilo-orange font-heading font-bold mb-4">With Trilo</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2"><span className="text-trilo-orange">✓</span> Upload screenshot → channels created</li>
                <li className="flex items-start gap-2"><span className="text-trilo-orange">✓</span> AI reads your schedule automatically</li>
                <li className="flex items-start gap-2"><span className="text-trilo-orange">✓</span> Automatic role pings to both owners</li>
                <li className="flex items-start gap-2"><span className="text-trilo-orange">✓</span> Points tracked natively in Discord</li>
                <li className="flex items-start gap-2"><span className="text-trilo-orange">✓</span> Minutes per week, not hours</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-32"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white text-center mb-4">Trusted by commissioners</h2>
          <p className="text-gray-400 text-center mb-12">Running leagues just like yours.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-trilo-elevated/30">
              <p className="text-gray-300 mb-4 italic">"Trilo has saved me so much time. What used to take me an hour every week now takes 5 minutes."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-trilo-orange/20 flex items-center justify-center text-trilo-orange font-bold">C</div>
                <div>
                  <p className="text-white font-semibold text-sm">CFB Dynasty Commissioner</p>
                  <p className="text-gray-500 text-xs">32-team league</p>
                </div>
              </div>
            </Card>
            <Card className="bg-trilo-elevated/30">
              <p className="text-gray-300 mb-4 italic">"The AI matchup feature is insane. I just screenshot my schedule and it does everything."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-trilo-orange/20 flex items-center justify-center text-trilo-orange font-bold">M</div>
                <div>
                  <p className="text-white font-semibold text-sm">Madden League Admin</p>
                  <p className="text-gray-500 text-xs">2 leagues, 64 teams total</p>
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
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-trilo-orange/10 border border-trilo-orange/20 px-4 py-2 rounded-full mb-6">
            <span className="text-trilo-orange text-sm font-semibold">Starting at $5.83/month</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Same price as the game.</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">One annual license covers your entire year. Works on up to 3 servers.</p>
          <Button size="lg" onClick={() => navigate('/pricing')}>
            View Pricing <ChevronRight className="ml-1" size={20} />
          </Button>
        </motion.div>

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-trilo-orange to-trilo-yellow p-1 rounded-3xl">
          <div className="bg-trilo-dark rounded-[22px] py-20 px-6 text-center overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6">READY TO AUTOMATE?</h2>
              <p className="text-xl text-gray-400 max-w-xl mx-auto mb-10">Stop wasting time on league admin. Let Trilo handle it.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto px-12" onClick={() => window.open(BOT_INVITE_URL, '_blank')}>
                  Add to Server <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white" onClick={() => navigate('/pricing')}>
                  View Pricing <ChevronRight size={20} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
