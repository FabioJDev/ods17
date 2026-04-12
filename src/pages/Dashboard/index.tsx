import { DollarSign, Globe, Handshake, Clock, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { fuentes } from '../../data/fuentes';
import { paises } from '../../data/paises';
import StatCard from '../../components/ui/StatCard';
import BarChartWrapper from '../../components/charts/BarChartWrapper';
import DonutChartWrapper from '../../components/charts/DonutChartWrapper';
import { formatUSD } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { estadoBadge, tipoBadge } from '../../components/ui/Badge';

const BAR_COLORS = ['#19486A', '#56C02B', '#FD9D24', '#00B4D8', '#E5243B'];

export default function Dashboard() {
  const recursos = useAppStore((s) => s.recursos);

  const totalMovilizado = recursos.reduce((s, r) => s + r.monto, 0);
  const paisesBeneficiados = new Set(recursos.map((r) => r.paisDestinoId)).size;
  const fuentesActivas = fuentes.filter((f) => f.estado === 'Activo').length;
  const recursosPendientes = recursos.filter((r) => r.estado === 'Disponible').reduce((s, r) => s + r.monto, 0);

  const porTipo = ['Gobierno', 'ONG', 'Empresa', 'Organismo Internacional'].map((tipo) => {
    const monto = fuentes
      .filter((f) => f.tipo === tipo)
      .reduce((s, f) => {
        const total = recursos.filter((r) => r.fuenteId === f.id).reduce((a, r) => a + r.monto, 0);
        return s + total;
      }, 0);
    return { tipo, monto };
  }).filter((d) => d.monto > 0);

  const porTipoAyuda = ['Donación', 'Préstamo', 'Inversión'].map((t) => ({
    name: t,
    value: recursos.filter((r) => r.tipoAyuda === t).reduce((s, r) => s + r.monto, 0),
  })).filter((d) => d.value > 0);

  const top5Paises = paises
    .map((p) => ({ ...p, total: recursos.filter((r) => r.paisDestinoId === p.id).reduce((s, r) => s + r.monto, 0) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const recientes = [...recursos].sort((a, b) => b.fechaDesembolso.localeCompare(a.fechaDesembolso)).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <div style={{
        borderRadius: '22px',
        padding: '40px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f2a45 0%, #19486A 40%, #134a3a 80%, #19486A 100%)',
      }}>
        {/* Decorative shapes */}
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(86,192,43,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '30%', bottom: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: '20%', top: '20%', width: '60px', height: '60px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', transform: 'rotate(25deg)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '60%', bottom: '15%', width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.04)', transform: 'rotate(-15deg)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
          {/* Badge */}
          <a
            href="https://www.un.org/sustainabledevelopment/es/globalpartnerships/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '50px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: 'rgba(86,192,43,0.2)',
              border: '1px solid rgba(86,192,43,0.3)',
              textDecoration: 'none',
              marginBottom: '22px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🌐</span>
            ODS 17 · Meta 17.3
            <ArrowUpRight size={12} style={{ opacity: 0.6 }} />
          </a>

          {/* Title */}
          <h1 style={{
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: '14px',
            fontFamily: "'DM Serif Display', serif",
          }}>
            Movilización de Recursos <br />
            <span style={{ color: '#56C02B' }}>para el Desarrollo Sostenible</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px',
            lineHeight: 1.7,
            maxWidth: '520px',
            marginBottom: '32px',
          }}>
            Los países en desarrollo enfrentan niveles sin precedentes de deuda externa.
            La Meta 17.3 exige cooperación de gobiernos, ONG, empresas y organismos internacionales.
          </p>

          {/* Hero stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {[
              { label: 'Países beneficiados', value: paisesBeneficiados },
              { label: 'Fuentes activas', value: fuentesActivas },
              { label: 'Recursos 2024', value: recursos.filter((r) => r.fechaDesembolso.startsWith('2024')).length },
            ].map((s) => (
              <div key={s.label} style={{
                backgroundColor: 'rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '16px 22px',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(4px)',
              }}>
                <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontWeight: 500, marginTop: '6px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard title="Total movilizado" value={totalMovilizado} displayValue={formatUSD(totalMovilizado, true)}
          icon={DollarSign} iconBg="bg-blue-50" iconColor="text-[#19486A]" trend={12} trendLabel="vs año anterior" />
        <StatCard title="Países beneficiados" value={paisesBeneficiados}
          icon={Globe} iconBg="bg-green-50" iconColor="text-[#56C02B]" trend={3} />
        <StatCard title="Fuentes activas" value={fuentesActivas}
          icon={Handshake} iconBg="bg-orange-50" iconColor="text-[#FD9D24]" />
        <StatCard title="Recursos pendientes" value={recursosPendientes} displayValue={formatUSD(recursosPendientes, true)}
          icon={Clock} iconBg="bg-cyan-50" iconColor="text-[#00B4D8]" trend={-5} trendLabel="disponibles" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E' }}>Recursos por tipo de fuente</h3>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '6px' }}>USD</span>
          </div>
          <BarChartWrapper
            data={porTipo}
            bars={[{ key: 'monto', color: '#19486A', name: 'Total USD' }]}
            xKey="tipo"
          />
        </div>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E' }}>Distribución por tipo de ayuda</h3>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '6px' }}>%</span>
          </div>
          <DonutChartWrapper data={porTipoAyuda} />
        </div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Top 5 countries */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '24px' }}>
            Top 5 países por recursos recibidos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {top5Paises.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}>
                  {p.bandera}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{p.nombre}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#19486A', fontVariantNumeric: 'tabular-nums' }}>{formatUSD(p.total, true)}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f0f4f8', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      borderRadius: '4px',
                      width: `${(p.total / top5Paises[0].total) * 100}%`,
                      background: BAR_COLORS[i],
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ODS Info */}
        <div style={{
          borderRadius: '20px',
          padding: '28px',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #19486A 0%, #0D2137 100%)',
        }}>
          <div style={{ position: 'absolute', right: 0, bottom: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(86,192,43,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', marginBottom: '24px' }}>
              Indicadores ODS 17
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'AOD máximos históricos', desc: 'El aumento de 2022 se debe a refugiados y Ucrania, no a países en desarrollo.', color: '#56C02B' },
                { title: '$541M solo para datos', desc: 'Financiación para estadísticas cayó más de $100M entre 2019 y 2020.', color: '#FD9D24' },
                { title: '66% conectados en 2022', desc: 'vs 40% en 2015. Brecha digital aún crítica en países menos desarrollados.', color: '#00B4D8' },
              ].map((item, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${item.color}`, paddingLeft: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '4px', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <a
              href="https://www.un.org/sustainabledevelopment/es/globalpartnerships/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '24px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.15s',
              }}
            >
              Ver fuente ONU <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '20px' }}>
          Actividad reciente
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recientes.map((r, idx) => {
            const p = paises.find((p) => p.id === r.paisDestinoId);
            return (
              <div key={r.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '16px 0',
                borderBottom: idx < recientes.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px',
                  flexShrink: 0,
                }}>
                  {p?.bandera}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', color: '#374151', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.descripcion}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#19486A', fontVariantNumeric: 'tabular-nums' }}>{formatUSD(r.monto, true)}</span>
                    {tipoBadge(r.tipoAyuda)}
                    {estadoBadge(r.estado)}
                    <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: 'auto' }}>{formatDate(r.fechaDesembolso)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
