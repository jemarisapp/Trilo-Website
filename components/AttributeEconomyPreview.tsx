import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './UI/Card';
import { Check, X, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export const AttributeEconomyPreview: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isApproved, setIsApproved] = useState(false);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const slides = [
        { id: 'store', title: 'UPGRADE STORE' },
        { id: 'approval', title: 'COMMISH APPROVALS' },
        { id: 'ledger', title: 'LEDGER SYNC' },
    ];

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentSlide((prev) => {
                const next = (prev + 1) % slides.length;
                if (next === 0) {
                    setIsApproved(false); // Reset approval animation when looping
                }
                return next;
            });
        }, 8500);
    };

    const handleManualChange = (index: number) => {
        setCurrentSlide(index);
        if (index !== 1) {
            setIsApproved(false);
        }
        startTimer();
    };

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Auto trigger click approval in slide 1 after some time
    useEffect(() => {
        if (currentSlide === 1) {
            const clickTimer = setTimeout(() => {
                setIsApproved(true);
            }, 3000);
            return () => clearTimeout(clickTimer);
        }
    }, [currentSlide]);

    return (
        <Card hover={false} className="relative z-10 p-0 border-white/10 shadow-2xl h-full flex flex-col scale-100 origin-center transition-transform duration-500 bg-[#313338] overflow-hidden">
            {/* Discord Header */}
            <div className="bg-trilo-elevated/50 p-3 border-b border-white/5 flex items-center justify-between z-20 relative">
                <div className="flex items-center gap-2">
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{slides[currentSlide].title}</div>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
            </div>

            {/* Content Area with Carousel */}
            <div className="flex-1 relative overflow-hidden bg-[#313338] min-h-[300px]">
                <AnimatePresence mode="wait">
                    {currentSlide === 0 && (
                        <motion.div
                            key="slide-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-4 flex flex-col justify-between"
                        >
                            {/* Command Input Simulation */}
                            <div className="flex gap-3 mb-4 opacity-90">
                                <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 font-heading">
                                    O1
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-bold text-white text-[15px] hover:underline cursor-pointer">@BuckeyeCommish</span>
                                        <span className="text-gray-400 text-[11px]">Today at 2:14 PM</span>
                                    </div>
                                    <div className="text-gray-300 text-[14px] leading-relaxed">
                                        <span className="opacity-80">used</span> <span className="text-[#5865F2] hover:underline cursor-pointer font-medium bg-[#5865F2]/10 px-1 rounded">/upgrade purchase</span>
                                        <div className="mt-2 flex flex-wrap gap-2 text-[12px] bg-[#2B2D31] p-2 rounded-md w-fit border-l-[3px] border-[#949BA4] text-gray-300">
                                            <span className="bg-[#1E1F22] px-1.5 py-0.5 rounded text-[#949BA4] font-mono">upgrade:</span> Speed Boost
                                            <span className="bg-[#1E1F22] px-1.5 py-0.5 rounded text-[#949BA4] font-mono">player:</span> Devon Allen
                                            <span className="bg-[#1E1F22] px-1.5 py-0.5 rounded text-[#949BA4] font-mono">cost:</span> 150
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Store Catalog Embed */}
                            <div className="bg-[#2B2D31] rounded-r border-l-4 border-trilo-orange p-3 lg:p-4 text-[13px] text-gray-200 shadow-md">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-trilo-yellow" />
                                    <span className="font-bold text-white uppercase tracking-wider font-heading text-sm">🏛️ TRILO UPGRADE STORE</span>
                                </div>
                                <p className="text-gray-400 text-[11px] mb-3 uppercase tracking-wider">MADDEN FRANCHISE UPGRADES</p>
                                <div className="space-y-2.5 font-mono text-[11px] lg:text-[12px]">
                                    <div className="flex justify-between items-center bg-[#1E1F22] p-1.5 rounded">
                                        <span className="text-trilo-yellow font-bold">🏃‍♂️ SPEED BOOST (+1 SPD)</span>
                                        <span className="bg-trilo-orange/10 border border-trilo-orange/30 text-trilo-orange px-1.5 rounded font-bold">150 PTS</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#1E1F22] p-1.5 rounded">
                                        <span className="text-gray-300 font-bold">💪 THROW POWER (+1 THP)</span>
                                        <span className="bg-gray-700 text-gray-300 px-1.5 rounded">200 PTS</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#1E1F22] p-1.5 rounded opacity-60">
                                        <span className="text-gray-400">🧠 AWARENESS (+2 AWR)</span>
                                        <span className="bg-gray-700 text-gray-400 px-1.5 rounded">100 PTS</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentSlide === 1 && (
                        <motion.div
                            key="slide-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-4 flex flex-col justify-between"
                        >
                            {/* Commish Approval Log */}
                            <div className="flex gap-3 mb-2 opacity-90">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-trilo-orange to-trilo-yellow flex items-center justify-center font-bold text-white text-sm flex-shrink-0 font-heading">
                                    T
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-white text-[15px]">Trilo</span>
                                            <span className="text-[10px] bg-[#5865F2] px-1.5 rounded-[3px] text-white font-medium py-0.5">APP</span>
                                        </div>
                                        <span className="text-gray-400 text-[11px]">Today at 2:15 PM</span>
                                    </div>
                                    <p className="text-gray-300 text-[13px]">Forwarded progression request to commissioner queue.</p>
                                </div>
                            </div>

                            {/* Pending Card */}
                            <div className="bg-[#2B2D31] rounded-r border-l-4 border-trilo-yellow p-4 text-[13px] text-gray-200 shadow-md relative overflow-hidden flex-1 flex flex-col justify-between max-h-[200px] mb-2">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-white uppercase tracking-wider text-xs font-heading">📥 PENDING UPGRADE APPROVAL</span>
                                        <span className="text-[10px] font-mono text-gray-400">REQ #1827</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[11px] lg:text-xs font-mono mb-2">
                                        <div><span className="text-gray-400">APPLICANT:</span> @Buckeyes</div>
                                        <div><span className="text-gray-400">PLAYER:</span> Devon Allen</div>
                                        <div><span className="text-gray-400">BOOST:</span> +1 Speed (SPD)</div>
                                        <div><span className="text-gray-400">LEDGER:</span> 420 ➔ 270 PTS</div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-2 relative z-20">
                                    <button 
                                        className={`px-3 py-1.5 rounded text-xs font-bold font-heading flex items-center gap-1 transition-all duration-300 ${
                                            isApproved 
                                                ? 'bg-[#248046] text-white cursor-default' 
                                                : 'bg-[#248046]/20 border border-[#248046]/40 text-[#2dc770] hover:bg-[#248046] hover:text-white'
                                        }`}
                                    >
                                        <Check size={14} />
                                        {isApproved ? 'Approved ✅' : 'Approve'}
                                    </button>
                                    {!isApproved && (
                                        <button className="px-3 py-1.5 rounded bg-[#da373c]/20 border border-[#da373c]/40 text-[#f23f43] text-xs font-bold font-heading flex items-center gap-1 hover:bg-[#da373c] hover:text-white transition-all">
                                            <X size={14} />
                                            Deny
                                        </button>
                                    )}
                                </div>

                                {/* Animated Cursor Clicking Approve */}
                                {!isApproved && (
                                    <motion.div
                                        initial={{ x: 260, y: 150, opacity: 0 }}
                                        animate={{ x: 35, y: 110, opacity: 1 }}
                                        transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
                                        className="absolute w-4 h-4 pointer-events-none z-30"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-full h-full fill-white drop-shadow-md">
                                            <path d="M4 0l16 12.22-5.66.78 4.66 8.33-3.33 1.67-4.67-8.33-4 3.33z" />
                                        </svg>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {currentSlide === 2 && (
                        <motion.div
                            key="slide-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-4 flex flex-col justify-between"
                        >
                            {/* System Update announcement */}
                            <div className="flex gap-3 mb-2 opacity-90">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-trilo-orange to-trilo-yellow flex items-center justify-center font-bold text-white text-sm flex-shrink-0 font-heading">
                                    T
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-white text-[15px]">Trilo</span>
                                            <span className="text-[10px] bg-[#5865F2] px-1.5 rounded-[3px] text-white font-medium py-0.5">APP</span>
                                        </div>
                                        <span className="text-gray-400 text-[11px]">Today at 2:15 PM</span>
                                    </div>
                                    <p className="text-gray-300 text-[13px]">Success! Roster ledger sync finished.</p>
                                </div>
                            </div>

                            {/* Upgraded Player Card Embed */}
                            <div className="bg-[#2B2D31] rounded-r border-l-4 border-[#248046] p-3 lg:p-4 text-[13px] text-gray-200 shadow-md">
                                <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white font-heading text-sm uppercase">✅ LEDGER TRANSACTION LOGGED</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-[#2dc770] bg-[#248046]/10 px-1 rounded border border-[#248046]/30">TXN-827-SPD</span>
                                </div>
                                
                                <div className="flex items-center gap-4 bg-[#1E1F22] p-2.5 rounded">
                                    {/* Mini Player Badge */}
                                    <div className="w-12 h-14 bg-[#161819] border border-white/10 flex flex-col justify-between items-center py-1">
                                        <span className="text-[8px] font-mono text-trilo-orange font-bold">WR</span>
                                        <span className="text-[10px] font-heading font-extrabold text-white">#88</span>
                                        <div className="text-[8px] font-mono text-gray-500">DUCKS</div>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h5 className="font-heading font-extrabold text-white text-xs uppercase tracking-wider">Devon Allen</h5>
                                        <div className="flex gap-4 items-center mt-1 text-[11px] font-mono">
                                            <div>
                                                <span className="text-gray-500">SPD:</span>{' '}
                                                <span className="text-[#2dc770] font-bold">95 ➔ 96 ⚡</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">ACC:</span>{' '}
                                                <span className="text-gray-300">94</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">AWR:</span>{' '}
                                                <span className="text-gray-300">88</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-[9px] font-mono text-gray-500 mt-2 text-right">
                                    Approved by @BuckeyeCommish • Ledger balance saved
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Carousel Indicators - Footer */}
            <div className="bg-transparent p-4 flex justify-center gap-2 border-t border-white/5 relative z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleManualChange(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-trilo-orange w-6' : 'bg-gray-600 hover:bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </Card>
    );
};
