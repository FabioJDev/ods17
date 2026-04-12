import { useState, useMemo, Fragment } from 'react';
import { Search, X, BarChart3, Users, MapPin, TrendingUp } from 'lucide-react';
import { paises } from '../../data/paises';
import { fuentes } from '../../data/fuentes';
import { useAppStore } from '../../store/appStore';
import Modal from '../../components/ui/Modal';
import DonutChartWrapper from '../../components/charts/DonutChartWrapper';
import LineChartWrapper from '../../components/charts/LineChartWrapper';
import { estadoBadge } from '../../components/ui/Badge';
import { formatUSD } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import type { Pais } from '../../types';

const INDICE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  bajo:  { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  medio: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  alto:  { bg: '#ecfdf5', color: '#16a34a', border: '#bbf7d0' },
};

export default function Paises() {
  const recursos = useAppStore((s) => s.recursos);
  const [selected, setSelected] = useState<Pais | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filtroRegion, setFiltroRegion] = useState('');

  const regiones = useMemo(() => [...new Set(paises.map((p) => p.region))].sort(), []);

  const getPaisStats = (paisId: string) => {
    const rec = recursos.filter((r) => r.paisDestinoId === paisId);
    const total = rec.reduce((s, r) => s + r.monto, 0);
    const byTipo = ['Donación', 'Préstamo', 'Inversión'].map((t) => ({
      name: t,
      value: rec.filter((r) => r.tipoAyuda === t).reduce((s, r) => s + r.monto, 0),
    })).filter((d) => d.value > 0);
    const bySector = ['Salud', 'Educación', 'Infraestructura', 'Tecnología', 'Agricultura'].map((s) => ({
      name: s,
      value: rec.filter((r) => r.sector === s).reduce((sum, r) => sum + r.monto, 0),
    })).filter((d) => d.value > 0);
    return { rec, total, byTipo, bySector };
  };

  const getEvolucion24m = (paisId: string) => {
    const rec = recursos.filter((r) => r.paisDestinoId === paisId);
    const months: Record<string, number> = {};
    rec.forEach((r) => {
      const m = r.fechaDesembolso.slice(0, 7);
      months[m] = (months[m] ?? 0) + r.monto;
    });
    return Object.entries(months).sort().map(([mes, monto]) => ({ mes, monto }));
  };

  const toggleCompare = (id: string) => {
    setCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const filtered = paises.filter((p) => {
    const q = search.toLowerCase();
    const matchQ = !q || p.nombre.toLowerCase().includes(q) || p.region.toLowerCase().includes(q);
    const matchR = !filtroRegion || p.region === filtroRegion;
    return matchQ && matchR;
  });

  const compareRows = useMemo(() => [
    { label: 'Región', fn: (p: Pais) => p.region },
    { label: 'Población', fn: (p: Pais) => p.poblacion.toLocaleString() },
    { label: 'Desarrollo', fn: (p: Pais) => p.indiceDesarrollo },
    { label: 'Total recibido', fn: (p: Pais) => formatUSD(getPaisStats(p.id).total, true) },
    { label: 'Recursos', fn: (p: Pais) => String(getPaisStats(p.id).rec.length) },
  ], [recursos]);

  const totalGlobal = recursos.reduce((s, r) => s + r.monto, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E' }}>Países Beneficiarios</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
            {paises.length} países registrados · {formatUSD(totalGlobal, true)} movilizados
          </p>
        </div>
        {compare.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '12px',
            backgroundColor: '#eef3f8', border: '1px solid #d0dbe8',
            fontSize: '12px', fontWeight: 600, color: '#19486A',
          }}>
            {compare.length === 2 ? 'Comparando 2 países' : '1/2 seleccionados'}
            <button onClick={() => setCompare([])} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
              color: '#19486A', display: 'flex',
            }}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar país o región..."
            className="input-field"
            style={{ paddingLeft: '42px' }}
          />
        </div>
        <select
          value={filtroRegion}
          onChange={(e) => setFiltroRegion(e.target.value)}
          className="input-field"
          style={{ width: 'auto', minWidth: '160px', cursor: 'pointer' }}
        >
          <option value="">Todas las regiones</option>
          {regiones.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Compare hint */}
      {compare.length === 1 && (
        <div style={{
          marginBottom: '20px', padding: '14px 18px', borderRadius: '14px',
          backgroundColor: '#eef3f8', border: '1px solid #d0dbe8',
          fontSize: '13px', color: '#19486A', fontWeight: 500,
        }}>
          Selecciona un segundo país para comparar.
        </div>
      )}

      {/* Comparison table */}
      {compare.length === 2 && (
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px',
          border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E' }}>Comparativa de países</h3>
            <button onClick={() => setCompare([])} style={{
              fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none',
              cursor: 'pointer', fontWeight: 600,
            }}>
              Limpiar
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '14px 18px', backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #e5e7eb' }}>
              Indicador
            </div>
            {compare.map((id) => {
              const p = paises.find((x) => x.id === id)!;
              return (
                <div key={id} style={{ padding: '14px 18px', backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '14px', color: '#1A1A2E', textAlign: 'center', borderBottom: '1px solid #e5e7eb', borderLeft: '1px solid #e5e7eb' }}>
                  {p.bandera} {p.nombre}
                </div>
              );
            })}
            {/* Rows */}
            {compareRows.map(({ label, fn }, idx) => (
              <Fragment key={label}>
                <div style={{ padding: '12px 18px', fontSize: '13px', fontWeight: 600, color: '#6b7280', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafbfc', borderBottom: idx < compareRows.length - 1 ? '1px solid #f0f0f0' : 'none', display: 'flex', alignItems: 'center' }}>
                  {label}
                </div>
                {compare.map((id) => {
                  const p = paises.find((x) => x.id === id)!;
                  return (
                    <div key={id} style={{ padding: '12px 18px', fontSize: '13px', fontWeight: 600, color: '#374151', textAlign: 'center', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafbfc', borderBottom: idx < compareRows.length - 1 ? '1px solid #f0f0f0' : 'none', borderLeft: '1px solid #f0f0f0' }}>
                      {fn(p)}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Country Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map((p) => {
          const { total, rec } = getPaisStats(p.id);
          const isCompared = compare.includes(p.id);
          const indice = INDICE_STYLE[p.indiceDesarrollo];
          return (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                padding: '24px',
                border: isCompared ? '2px solid #19486A' : '1px solid #f0f0f0',
                boxShadow: isCompared ? '0 0 0 3px rgba(25,72,106,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                if (!isCompared) {
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(25,72,106,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCompared) {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    backgroundColor: '#f8fafc', border: '1px solid #f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px',
                  }}>
                    {p.bandera}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A2E' }}>{p.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={11} /> {p.region}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px',
                  backgroundColor: indice.bg, color: indice.color, border: `1px solid ${indice.border}`,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {p.indiceDesarrollo}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
                padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc',
                marginBottom: '16px',
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Recibido</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#19486A' }}>{formatUSD(total, true)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Recursos</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#374151' }}>{rec.length}</div>
                </div>
              </div>

              {/* Compare button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleCompare(p.id); }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  border: isCompared ? 'none' : '1px solid #e5e7eb',
                  backgroundColor: isCompared ? '#19486A' : '#f8fafc',
                  color: isCompared ? '#ffffff' : '#6b7280',
                  marginTop: 'auto',
                }}
              >
                {isCompared ? '✓ Seleccionado' : 'Comparar'}
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <MapPin size={36} style={{ color: '#d1d5db', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '14px', fontWeight: 500 }}>No se encontraron países</p>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`${selected?.bandera} ${selected?.nombre}`} size="xl">
        {selected && (() => {
          const { rec, total, byTipo, bySector } = getPaisStats(selected.id);
          const evolucion = getEvolucion24m(selected.id);
          const sortedRec = [...rec].sort((a, b) => b.fechaDesembolso.localeCompare(a.fechaDesembolso));
          const indice = INDICE_STYLE[selected.indiceDesarrollo];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {/* Hero */}
              <div style={{
                padding: '24px', borderRadius: '16px', marginBottom: '24px',
                background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f0f8 100%)',
              }}>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.7, marginBottom: '16px' }}>{selected.descripcion}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '5px 12px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #e5e7eb' }}>
                    <MapPin size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />{selected.region}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '5px 12px', borderRadius: '8px', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #e5e7eb' }}>
                    <Users size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />{selected.poblacion.toLocaleString()} hab.
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '5px 12px', borderRadius: '8px', backgroundColor: indice.bg, color: indice.color, border: `1px solid ${indice.border}` }}>
                    Desarrollo: {selected.indiceDesarrollo}
                  </span>
                </div>
              </div>

              {/* KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Total recibido', value: formatUSD(total, true), icon: TrendingUp, color: '#19486A' },
                  { label: 'Disponible', value: formatUSD(selected.totalDisponible, true), icon: BarChart3, color: '#16a34a' },
                  { label: 'Asignado', value: formatUSD(selected.totalAsignado, true), icon: BarChart3, color: '#d97706' },
                ].map((kpi) => (
                  <div key={kpi.label} style={{
                    padding: '18px', borderRadius: '14px', border: '1px solid #e5e7eb', backgroundColor: '#fafbfc',
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{kpi.label}</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Sectors */}
              {bySector.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                    Distribución por sector
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bySector.map((s) => (
                      <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ width: '100px', fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{s.name}</span>
                        <div style={{ flex: 1, height: '10px', backgroundColor: '#f0f4f8', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', backgroundColor: '#19486A', borderRadius: '5px', width: `${(s.value / total) * 100}%`, transition: 'width 0.4s ease' }} />
                        </div>
                        <span style={{ width: '80px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#19486A', fontVariantNumeric: 'tabular-nums' }}>{formatUSD(s.value, true)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: byTipo.length > 0 && evolucion.length > 1 ? '1fr 1fr' : '1fr', gap: '16px', marginBottom: '24px' }}>
                {byTipo.length > 0 && (
                  <div style={{ padding: '20px', borderRadius: '14px', border: '1px solid #e5e7eb', backgroundColor: '#fafbfc' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Por tipo de ayuda</div>
                    <DonutChartWrapper data={byTipo} height={180} />
                  </div>
                )}
                {evolucion.length > 1 && (
                  <div style={{ padding: '20px', borderRadius: '14px', border: '1px solid #e5e7eb', backgroundColor: '#fafbfc' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Evolución temporal</div>
                    <LineChartWrapper data={evolucion} lines={[{ key: 'monto', color: '#19486A', name: 'USD' }]} xKey="mes" height={180} />
                  </div>
                )}
              </div>

              {/* Timeline */}
              {sortedRec.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#19486A' }} />
                    Timeline de recursos ({sortedRec.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto', paddingLeft: '16px', borderLeft: '2px solid #e5e7eb' }}>
                    {sortedRec.map((r, idx) => {
                      const src = fuentes.find((f) => f.id === r.fuenteId);
                      return (
                        <div key={r.id} style={{ position: 'relative' }}>
                          <div style={{
                            position: 'absolute', left: '-22px', top: '16px',
                            width: '10px', height: '10px', borderRadius: '50%',
                            backgroundColor: '#19486A', border: '2px solid #ffffff',
                            boxShadow: '0 0 0 2px #e5e7eb',
                          }} />
                          <div style={{
                            padding: '16px 18px', borderRadius: '12px', marginLeft: '8px',
                            backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                            border: '1px solid #f0f0f0',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#19486A' }}>{formatUSD(r.monto, true)}</span>
                              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{formatDate(r.fechaDesembolso)}</span>
                            </div>
                            <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5, marginBottom: '8px' }}>{r.descripcion}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {estadoBadge(r.estado)}
                              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{src?.nombre}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
