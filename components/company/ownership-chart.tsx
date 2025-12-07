'use client';

import { motion } from 'framer-motion';
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
  // Calculate cumulative percentages for the donut chart
  let cumulativePercentage = 0;
  const segmentsWithAngles = segments.map(segment => {
    const startAngle = cumulativePercentage * 3.6; // 360 / 100
    cumulativePercentage += segment.percentage;
    const endAngle = cumulativePercentage * 3.6;
    return { ...segment, startAngle, endAngle };
  });

  // SVG arc path generator
  const createArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = 50 + outerRadius * Math.cos(startAngleRad);
    const y1 = 50 + outerRadius * Math.sin(startAngleRad);
    const x2 = 50 + outerRadius * Math.cos(endAngleRad);
    const y2 = 50 + outerRadius * Math.sin(endAngleRad);
    const x3 = 50 + innerRadius * Math.cos(endAngleRad);
    const y3 = 50 + innerRadius * Math.sin(endAngleRad);
    const x4 = 50 + innerRadius * Math.cos(startAngleRad);
    const y4 = 50 + innerRadius * Math.sin(startAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };

  if (segments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center">
          <span className="text-white/30 text-sm">No data</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Donut Chart */}
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segmentsWithAngles.map((segment, index) => (
            <motion.path
              key={segment.id}
              d={createArcPath(segment.startAngle, segment.endAngle, 25, 40)}
              fill={SHARE_CLASS_COLORS[segment.type] || '#6b7280'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {formatLargeNumber(totalShares)}
          </motion.span>
          <span className="text-xs text-white/40">Total Shares</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-xs">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.id}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <div 
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: SHARE_CLASS_COLORS[segment.type] || '#6b7280' }}
            />
            <div className="min-w-0">
              <p className="text-xs text-white truncate">{segment.name}</p>
              <p className="text-xs text-white/40">{segment.percentage.toFixed(1)}%</p>
            </div>
          </motion.div>
        ))}
      </div>
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
