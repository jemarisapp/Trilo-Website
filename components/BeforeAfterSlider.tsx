import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export const BeforeAfterSlider: React.FC = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
    };

    const handleMouseDown = () => {
        isDragging.current = true;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-4xl mx-auto"
        >
            <div className="text-center mb-6">
                <p className="text-gray-400 text-sm">Drag to see the transformation</p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
            >
                {/* After Image (Bottom Layer - Full Width) */}
                <img
                    src="/matchups-list.jpg"
                    alt="Created matchup channels"
                    className="absolute inset-0 w-full h-full object-cover object-left-top"
                />
                <div className="absolute bottom-4 right-4 bg-trilo-orange/90 backdrop-blur-sm px-3 py-1.5 rounded-lg z-20">
                    <span className="text-white text-sm font-semibold">After: Channels Created</span>
                </div>

                {/* Before Image (Top Layer - Clipped with clip-path) */}
                <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img
                        src="/schedule.JPG"
                        alt="Original schedule screenshot"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                        <span className="text-white text-sm font-semibold">Before: Schedule Screenshot</span>
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                    {/* Handle Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="flex gap-0.5">
                            <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
                            <div className="w-0.5 h-4 bg-gray-400 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-4 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span className="text-gray-400 text-sm">Upload Screenshot</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Trilo Creates Channels</span>
                    <div className="w-3 h-3 rounded-full bg-trilo-orange" />
                </div>
            </div>
        </motion.div>
    );
};
