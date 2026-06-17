import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface BeforeAfterSliderProps {
    aspectClass?: string;
    showLabel?: boolean;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
    aspectClass = "aspect-[16/9]",
    showLabel = true
}) => {
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
            className="w-full mx-auto"
        >
            {showLabel && (
                <div className="text-center mb-4">
                    <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">DRAG SLIDER FOR TRANSFORMATION</p>
                </div>
            )}

            <div
                ref={containerRef}
                className={`relative w-full ${aspectClass} rounded-none overflow-hidden cursor-ew-resize select-none border-2 border-white/15 shadow-2xl`}
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
                <div className="absolute bottom-4 right-4 bg-trilo-orange text-white text-[10px] font-heading font-extrabold uppercase tracking-widest px-2.5 py-1 z-20">
                    After: Channels Created
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
                    <div className="absolute bottom-4 left-4 bg-[#1a1d1f] border border-white/10 text-white text-[10px] font-heading font-extrabold uppercase tracking-widest px-2.5 py-1">
                        Before: Schedule Screenshot
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize z-10"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                    {/* Handle Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white text-black rounded-full shadow-lg flex items-center justify-center border-2 border-trilo-orange">
                        <div className="flex gap-0.5">
                            <div className="w-[1.5px] h-3 bg-trilo-orange" />
                            <div className="w-[1.5px] h-3 bg-trilo-orange" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Labels */}
            {showLabel && (
                <div className="flex justify-between mt-4 px-2 uppercase tracking-widest font-heading font-bold text-[10px]">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500" />
                        <span className="text-gray-500">UPLOAD SCREENSHOT</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-trilo-orange">CHANNELS BUILT</span>
                        <div className="w-2 h-2 bg-trilo-orange" />
                    </div>
                </div>
            )}
        </motion.div>
    );
};
