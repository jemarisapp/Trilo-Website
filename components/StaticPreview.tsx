import React from 'react';
import { Card } from './UI/Card';

interface StaticPreviewProps {
    title: string;
    imageSrc: string;
    imageAlt: string;
    objectPosition?: string;
}

export const StaticPreview: React.FC<StaticPreviewProps> = ({
    title,
    imageSrc,
    imageAlt,
    objectPosition = '15% 0'
}) => {
    return (
        <Card hover={false} className="relative z-10 p-0 border-white/10 overflow-hidden shadow-2xl h-full flex flex-col bg-[#313338]">
            {/* Discord Header */}
            <div className="bg-trilo-elevated/50 p-3 border-b border-white/5 flex items-center justify-between z-20 relative">
                <div className="flex items-center gap-2">
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{title}</div>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden bg-[#313338] min-h-[300px]">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    style={{ objectPosition }}
                />
            </div>
        </Card>
    );
};
