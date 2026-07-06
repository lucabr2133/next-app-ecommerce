'use client';

import { Row } from 'postgres';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

// Custom Tooltip for premium look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-content1/80 backdrop-blur-md border border-default-200 p-3 rounded-xl shadow-lg">
        <p className="text-default-500 text-xs mb-1 font-medium">{new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        <p className="text-success-500 font-bold text-lg">
          ${Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function SalesChart({ data }:{data:Row[]}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#17c964" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#17c964" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--nextui-default-200) / 0.5)" />
        
        <XAxis 
          dataKey="date" 
          tickFormatter={(tick) => new Date(tick).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--nextui-default-500))', fontSize: 12 }}
          dy={10}
        />
        
        <YAxis 
          tickFormatter={(tick) => `$${tick}`}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'hsl(var(--nextui-default-500))', fontSize: 12 }}
          dx={-10}
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="#17c964" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorTotal)" 
          activeDot={{ r: 6, fill: "#17c964", stroke: "hsl(var(--nextui-background))", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
