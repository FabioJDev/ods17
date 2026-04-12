interface TooltipPayload {
  name: string;
  value: number;
  fill?: string;
  stroke?: string;
  color?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  formatValue?: (value: number) => string;
}

const defaultFormat = (v: number) =>
  v >= 1e6
    ? `$${(v / 1e6).toFixed(1)}M`
    : v >= 1e3
      ? `$${(v / 1e3).toFixed(0)}K`
      : v.toLocaleString();

export default function ChartTooltip({
  active, payload, label,
  formatValue = defaultFormat,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#0D2137] border border-white/10 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm min-w-[140px]">
      {label && (
        <p className="text-[11px] font-medium text-white/50 uppercase tracking-wide mb-1.5 border-b border-white/10 pb-1.5">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry) => {
          const dotColor = entry.fill || entry.stroke || entry.color || '#56C02B';
          return (
            <div key={entry.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dotColor }}
                  aria-hidden="true"
                />
                <span className="text-xs text-white/70">{entry.name}</span>
              </div>
              <span className="text-xs font-bold text-white font-tabular">
                {formatValue(entry.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
