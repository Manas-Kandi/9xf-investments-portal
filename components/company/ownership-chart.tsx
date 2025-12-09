'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SHARE_CLASS_COLORS } from '@/lib/validations/cap-table';

interface ChartSegment {
  id: string;
  name: string;
  type: string;
  shares: number;
  percentage: number;
}

interface OwnershipChartProps {
  segments: ChartSegment[];
  totalShares: number;
}

export function OwnershipChart({ segments, totalShares }: OwnershipChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  if (segments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <motion.div 
          className="w-40 h-40 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center">
            <span className="text-white/30 text-sm">No data</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Sort segments by percentage for better visual hierarchy
  const sortedSegments = [...segments].sort((a, b) => b.percentage - a.percentage);
  
  const activeSegment = hoveredSegment || selectedSegment;
  const activeData = activeSegment 
    ? segments.find(s => s.id === activeSegment) 
    : null;

  return (
    <div className="relative">
      {/* Main visualization */}
      <div className="flex items-center gap-8">
        {/* Stacked bars visualization */}
        <div className="flex-1 space-y-3">
          {sortedSegments.map((segment, index) => {
            const isActive = segment.id === activeSegment;
            const color = SHARE_CLASS_COLORS[segment.type] || '#6b7280';
            
            return (
              <motion.div
                key={segment.id}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onMouseEnter={() => setHoveredSegment(segment.id)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => setSelectedSegment(
                  selectedSegment === segment.id ? null : segment.id
                )}
              >
                {/* Label row */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{ scale: isActive ? 1.3 : 1 }}
                    />
                    <span className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-white/70'
                    }`}>
                      {segment.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/40 font-mono">
                      {formatLargeNumber(segment.shares)}
                    </span>
                    <motion.span 
                      className="text-sm font-semibold font-mono min-w-[3.5rem] text-right"
                      style={{ color: isActive ? color : 'rgba(255,255,255,0.6)' }}
                      animate={{ scale: isActive ? 1.05 : 1 }}
                    >
                      {segment.percentage.toFixed(1)}%
                    </motion.span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden">
                  {/* Background glow on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{ 
                      background: `linear-gradient(90deg, ${color}10, transparent)` 
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                  />
                  
                  {/* Main bar */}
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-lg"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${segment.percentage}%`,
                      opacity: isActive ? 1 : 0.7,
                    }}
                    transition={{ 
                      width: { duration: 0.8, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.2 }
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ 
                        duration: 1.5, 
                        delay: 0.5 + index * 0.1,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.div>
                  
                  {/* Percentage marker line */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-px bg-white/30"
                    initial={{ left: 0, opacity: 0 }}
                    animate={{ 
                      left: `${segment.percentage}%`,
                      opacity: isActive ? 1 : 0 
                    }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Circular summary */}
        <div className="relative w-36 h-36 flex-shrink-0">
          {/* Outer ring segments */}
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <defs>
              {sortedSegments.map((segment) => (
                <linearGradient
                  key={`gradient-${segment.id}`}
                  id={`gradient-${segment.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop 
                    offset="0%" 
                    stopColor={SHARE_CLASS_COLORS[segment.type]} 
                    stopOpacity="1" 
                  />
                  <stop 
                    offset="100%" 
                    stopColor={SHARE_CLASS_COLORS[segment.type]} 
                    stopOpacity="0.5" 
                  />
                </linearGradient>
              ))}
            </defs>
            
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            
            {/* Segment arcs */}
            {(() => {
              let cumulativePercent = 0;
              return sortedSegments.map((segment, index) => {
                const startPercent = cumulativePercent;
                cumulativePercent += segment.percentage;
                const circumference = 2 * Math.PI * 42;
                const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -(startPercent / 100) * circumference;
                const isActive = segment.id === activeSegment;
                
                return (
                  <motion.circle
                    key={segment.id}
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={`url(#gradient-${segment.id})`}
                    strokeWidth={isActive ? 10 : 8}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      strokeWidth: isActive ? 10 : 8,
                    }}
                    transition={{ 
                      opacity: { duration: 0.5, delay: index * 0.1 },
                      strokeWidth: { duration: 0.2 }
                    }}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(segment.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{ filter: isActive ? `drop-shadow(0 0 8px ${SHARE_CLASS_COLORS[segment.type]})` : 'none' }}
                  />
                );
              });
            })()}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {activeData ? (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <motion.span 
                    className="text-2xl font-bold block"
                    style={{ color: SHARE_CLASS_COLORS[activeData.type] }}
                  >
                    {activeData.percentage.toFixed(1)}%
                  </motion.span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">
                    {activeData.name}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="total"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <span className="text-2xl font-bold text-white block">
                    {formatLargeNumber(totalShares)}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider">
                    Total Shares
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Decorative inner ring */}
          <div className="absolute inset-4 rounded-full border border-white/10" />
        </div>
      </div>

      {/* Bottom stats */}
      <motion.div 
        className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-center">
          <p className="text-lg font-bold text-white">{segments.length}</p>
          <p className="text-xs text-white/40">Share Classes</p>
        </div>
        <div className="text-center border-x border-white/10">
          <p className="text-lg font-bold text-white">{formatLargeNumber(totalShares)}</p>
          <p className="text-xs text-white/40">Issued</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-white">
            {sortedSegments[0]?.percentage.toFixed(0) || 0}%
          </p>
          <p className="text-xs text-white/40">Largest Class</p>
        </div>
      </motion.div>
    </div>
  );
}

function formatLargeNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toLocaleString();
}
