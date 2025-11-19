import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreChartProps {
  score: number;
  size?: number;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ score, size = 200 }) => {
  const data = [{ name: 'Score', value: score, fill: score > 70 ? '#16a34a' : score > 40 ? '#ca8a04' : '#dc2626' }];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="80%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={30 / 2}
            fill="#0ea5e9"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`text-4xl font-bold ${score > 70 ? 'text-green-600' : score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
          {score}
        </span>
        <span className="text-xs text-slate-400 uppercase font-medium tracking-wider mt-1">Geral</span>
      </div>
    </div>
  );
};