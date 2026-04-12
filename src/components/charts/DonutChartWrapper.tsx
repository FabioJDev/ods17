import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartTooltip from './ChartTooltip';

interface DonutChartWrapperProps {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
}

const DEFAULTS = ['#19486A', '#56C02B', '#FD9D24', '#00B4D8', '#E5243B', '#9B59B6'];

export default function DonutChartWrapper({ data, colors = DEFAULTS, height = 260 }: DonutChartWrapperProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  const formatDonut = (v: number) => {
    const pct = total > 0 ? ((v / total) * 100).toFixed(1) : '0';
    const formatted = v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K`;
    return `${formatted} (${pct}%)`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="75%"
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip formatValue={formatDonut} />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
