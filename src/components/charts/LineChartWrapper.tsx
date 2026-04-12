import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ChartTooltip from './ChartTooltip';

interface LineChartWrapperProps {
  data: Record<string, unknown>[];
  lines: { key: string; color: string; name: string }[];
  xKey: string;
  height?: number;
}

export default function LineChartWrapper({ data, lines, xKey, height = 280 }: LineChartWrapperProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: '#6B7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6B7280' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: 'rgba(25, 72, 106, 0.2)', strokeDasharray: '4 4' }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: l.color, stroke: '#fff', strokeWidth: 2 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
