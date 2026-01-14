import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './UI/Card';

export const MatchupPreview: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const slides = [
        { id: 'command', title: 'COMMAND PREVIEW' },
        { id: 'list', title: 'CATEGORIES PREVIEW' },
        { id: 'channel', title: 'CHANNEL PREVIEW' },
    ];

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
    };

    const handleManualChange = (index: number) => {
        setCurrentSlide(index);
        startTimer();
    };

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <Card hover={false} className="relative z-10 p-0 border-white/10 shadow-2xl h-full flex flex-col scale-100 origin-center transition-transform duration-500 bg-[#313338]">
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
            <div className="flex-1 relative overflow-visible bg-[#313338] min-h-[300px]">
                <AnimatePresence mode="wait">
                    {currentSlide === 0 && (
                        <motion.div
                            key="slide-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-4"
                        >
                            {/* Slide 1: Command Preview (Original Content) */}
                            <div className="flex gap-3 mb-6 opacity-80 hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    D
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-bold text-white text-[15px] hover:underline cursor-pointer">(C) Ducks</span>
                                        <span className="text-gray-400 text-[11px]">Today at 11:55 AM</span>
                                    </div>
                                    <div className="text-gray-300 text-[14px] leading-relaxed">
                                        <span className="opacity-80">used</span> <span className="text-[#5865F2] hover:underline cursor-pointer font-medium bg-[#5865F2]/10 px-1 rounded">/matchups create-from-image</span>
                                        <div className="mt-2 flex flex-wrap gap-2 text-[12px] bg-[#2B2D31] p-2 rounded-md w-fit border-l-[3px] border-[#949BA4] text-gray-300">
                                            <span className="bg-[#1E1F22] px-1.5 py-0.5 rounded text-[#949BA4] font-mono">category_name:</span> Week 5
                                            <span className="bg-[#1E1F22] px-1.5 py-0.5 rounded text-[#949BA4] font-mono">image1:</span> <span className="text-[#00A8FC] cursor-pointer hover:underline">schedule.JPG</span>
                                            <span className="bg-[#1E1F22] px-1.5 py-0.5 rounded text-[#949BA4] font-mono">game_status:</span> True
                                            <span className="bg-[#1E1F22] px-1.5 py-0.5 rounded text-[#949BA4] font-mono">visible_to:</span> <span className="bg-[#484B77]/30 text-[#C9CDFB] px-1 rounded">@everyone</span>
                                            <span className="text-gray-500 text-[10px] self-center">+4 more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-trilo-orange to-trilo-yellow flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                                    T
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-white text-[15px]">Trilo</span>
                                            <span className="text-[10px] bg-[#5865F2] px-1.5 rounded-[3px] text-white font-medium py-0.5">APP</span>
                                        </div>
                                        <span className="text-gray-400 text-[11px]">Today at 11:55 AM</span>
                                    </div>
                                    <div className="text-gray-300">
                                        <div className="flex items-center gap-2 text-[14px]">
                                            <span className="animate-pulse">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, y: 0, rotate: 1 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                                className="absolute top-[130px] lg:top-[140px] left-[60px] lg:left-[60px] w-[280px] lg:w-[420px] h-[160px] lg:h-[240px] bg-[#2B2D31] rounded-lg border-l-4 border-trilo-orange shadow-2xl p-3 lg:p-4 z-20"
                            >
                                <div className="w-full h-28 lg:h-44 bg-gray-900 rounded mb-2 overflow-hidden relative group">
                                    <img
                                        src="/schedule.JPG"
                                        alt="Schedule"
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <motion.div
                                        initial={{ top: "-20%" }}
                                        animate={{ top: "120%" }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 w-full h-2 bg-trilo-orange/50 shadow-[0_0_15px_rgba(255,160,0,0.6)] blur-[1px]"
                                    />
                                    <div className="absolute inset-0 bg-trilo-orange/5 mix-blend-overlay" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[11px] lg:text-sm text-gray-300">
                                        <motion.div
                                            animate={{ opacity: [1, 0.4, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="h-2 w-2 lg:h-3 lg:w-3 rounded-full bg-trilo-orange shadow-[0_0_8px_rgba(255,160,0,0.8)]"
                                        />
                                        Scanning matchups...
                                    </div>
                                    <span className="text-[10px] lg:text-xs font-mono text-trilo-orange">TRILO ACTIVATED</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {currentSlide === 1 && (
                        <motion.div
                            key="slide-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <img
                                src="/matchups-list.jpg"
                                alt="Matchups List"
                                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                                style={{ objectPosition: '15% 0' }}
                            />

                        </motion.div>
                    )}

                    {currentSlide === 2 && (
                        <motion.div
                            key="slide-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <img
                                src="/game-channel.jpg"
                                alt="Game Channel"
                                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                                style={{ objectPosition: '15% 0' }}
                            />

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Carousel Indicators */}
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
