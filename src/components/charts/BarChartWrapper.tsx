import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import ChartTooltip from './ChartTooltip';

interface BarChartWrapperProps {
  data: Record<string, unknown>[];
  bars: { key: string; color: string; name: string }[];
  xKey: string;
  height?: number;
}

export default function BarChartWrapper({ data, bars, xKey, height = 280 }: BarChartWrapperProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
          tickFormatter={(v) =>
            v >= 1e6 ? `$${(v / 1e6).toFixed(0)}M` : `$${(v / 1e3).toFixed(0)}K`
          }
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: 'rgba(25, 72, 106, 0.05)' }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.name}
            fill={b.color}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
