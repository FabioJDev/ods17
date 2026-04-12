import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  displayValue?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: number;
  trendLabel?: string;
  prefix?: string;
  suffix?: string;
}

export default function StatCard({
  title, value, displayValue, icon: Icon,
  iconColor, iconBg, trend, trendLabel,
  prefix = '', suffix = '',
}: StatCardProps) {
  const trendPositive = (trend ?? 0) >= 0;
  const finalDisplay = displayValue ?? `${prefix}${value.toLocaleString()}${suffix}`;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '18px',
      padding: '24px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      cursor: 'default',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(25,72,106,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div className={`${iconBg}`} style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={22} className={iconColor} />
        </div>
        {trend !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: '8px',
            backgroundColor: trendPositive ? '#ecfdf5' : '#fef2f2',
            color: trendPositive ? '#15803d' : '#dc2626',
            border: `1px solid ${trendPositive ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {trendPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: '#1A1A2E', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {finalDisplay}
      </div>
      <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px', fontWeight: 500 }}>{title}</div>
      {trendLabel && (
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '3px' }}>{trendLabel}</div>
      )}
    </div>
  );
}
