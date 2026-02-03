'use client';

import { Row } from 'postgres';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function SalesChart({ data }:{data:Row[]}) {
  return (
    <ResponsiveContainer className='row-start-2 col-end-3 col-start-1' width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date"  />
        <YAxis />
        <Tooltip  />
        <Line dataKey="total" stroke="#22c55e" />
      </LineChart>
    </ResponsiveContainer>
  );
}
