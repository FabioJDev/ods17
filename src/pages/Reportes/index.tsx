import { useState, useMemo } from 'react';
import {
  Download, Filter, TrendingUp, Globe, Landmark,
  FileText, ChevronDown, ChevronUp, BarChart3, Calendar,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { paises } from '../../data/paises';
import { fuentes } from '../../data/fuentes';
import LineChartWrapper from '../../components/charts/LineChartWrapper';
import BarChartWrapper from '../../components/charts/BarChartWrapper';
import { formatUSD } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import { estadoBadge, tipoBadge } from '../../components/ui/Badge';

const ROWS_PER_PAGE = 15;

export default function Reportes() {
  const recursos = useAppStore((s) => s.recursos);
  const agregarToast = useAppStore((s) => s.agregarToast);
  const { puedeExportar } = useAuth();

  const [desde, setDesde] = useState('2024-01-01');
  const [hasta, setHasta] = useState('2026-03-31');
  const [paisFiltro, setPaisFiltro] = useState('');
  const [fuenteFiltro, setFuenteFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [page, setPage] = useState(0);
  const [sortCol, setSortCol] = useState<'monto' | 'fecha'>('fecha');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => recursos.filter((r) => {
    const inRange = r.fechaDesembolso >= desde && r.fechaDesembolso <= hasta;
    const matchPais = !paisFiltro || r.paisDestinoId === paisFiltro;
    const matchFuente = !fuenteFiltro || r.fuenteId === fuenteFiltro;
    const matchTipo = !tipoFiltro || r.tipoAyuda === tipoFiltro;
    return inRange && matchPais && matchFuente && matchTipo;
  }), [recursos, desde, hasta, paisFiltro, fuenteFiltro, tipoFiltro]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const valA = sortCol === 'monto' ? a.monto : a.fechaDesembolso;
      const valB = sortCol === 'monto' ? b.monto : b.fechaDesembolso;
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortCol, sortDir]);

  const totalFiltrado = filtered.reduce((s, r) => s + r.monto, 0);
  const paisesCount = new Set(filtered.map((r) => r.paisDestinoId)).size;
  const fuentesCount = new Set(filtered.map((r) => r.fuenteId)).size;

  const trendData = useMemo(() => {
    const months: Record<string, number> = {};
    filtered.forEach((r) => {
      const m = r.fechaDesembolso.slice(0, 7);
      months[m] = (months[m] ?? 0) + r.monto;
    });
    return Object.entries(months).sort().map(([mes, monto]) => ({ mes, monto }));
  }, [filtered]);

  const byPaisData = useMemo(() => {
    return paises.map((p) => ({
      pais: p.nombre.length > 9 ? p.nombre.slice(0, 8) + '…' : p.nombre,
      monto: filtered.filter((r) => r.paisDestinoId === p.id).reduce((s, r) => s + r.monto, 0),
    })).filter((d) => d.monto > 0).sort((a, b) => b.monto - a.monto).slice(0, 10);
  }, [filtered]);

  const byTipoData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((r) => {
      map[r.tipoAyuda] = (map[r.tipoAyuda] ?? 0) + r.monto;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const avgPerRecurso = filtered.length > 0 ? totalFiltrado / filtered.length : 0;

  const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);
  const pageData = sorted.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const handleExport = () => {
    agregarToast({ tipo: 'success', mensaje: 'Reporte generado exitosamente' });
  };

  const toggleSort = (col: 'monto' | 'fecha') => {
    if (sortCol === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const clearFilters = () => {
    setDesde('2024-01-01');
    setHasta('2026-03-31');
    setPaisFiltro('');
    setFuenteFiltro('');
    setTipoFiltro('');
    setPage(0);
  };

  const hasActiveFilters = paisFiltro || fuenteFiltro || tipoFiltro;

  const SortIcon = ({ col }: { col: 'monto' | 'fecha' }) => {
    if (sortCol !== col) return <Minus size={10} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc'
      ? <ArrowUpRight size={12} style={{ color: '#19486A' }} />
      : <ArrowDownRight size={12} style={{ color: '#19486A' }} />;
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: '16px', marginBottom: '28px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #19486A, #1d5a8a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart3 size={18} style={{ color: '#ffffff' }} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E', fontFamily: "'DM Serif Display', serif" }}>
              Reportes y Análisis
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginLeft: '46px' }}>
            Visualizaciones dinámicas según filtros activos
          </p>
        </div>
        {puedeExportar && (
          <button
            onClick={handleExport}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #56C02B, #4aad24)',
              color: '#ffffff', fontSize: '13px', fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(86,192,43,0.3)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(86,192,43,0.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(86,192,43,0.3)'; }}
          >
            <Download size={15} /> Exportar PDF
          </button>
        )}
      </div>

      {/* Filters Card */}
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e5e7eb',
        marginBottom: '24px', overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        {/* Filter header - clickable */}
        <div
          onClick={() => setFiltersOpen(!filtersOpen)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px', cursor: 'pointer',
            borderBottom: filtersOpen ? '1px solid #f0f0f0' : 'none',
            transition: 'background-color 0.1s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafbfc'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              backgroundColor: '#eef3f8', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Filter size={14} style={{ color: '#19486A' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151' }}>Filtros de reporte</span>
            {hasActiveFilters && (
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                backgroundColor: '#19486A', color: '#ffffff',
              }}>
                Activos
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {hasActiveFilters && (
              <button
                onClick={(e) => { e.stopPropagation(); clearFilters(); }}
                style={{
                  fontSize: '11px', fontWeight: 600, color: '#9ca3af',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Limpiar filtros
              </button>
            )}
            {filtersOpen ? <ChevronUp size={16} style={{ color: '#9ca3af' }} /> : <ChevronDown size={16} style={{ color: '#9ca3af' }} />}
          </div>
        </div>

        {/* Filter body */}
        {filtersOpen && (
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Desde</label>
                <div style={{ position: 'relative' }}>
                  <input type="date" value={desde} onChange={(e) => { setDesde(e.target.value); setPage(0); }} className="input-field" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Hasta</label>
                <input type="date" value={hasta} onChange={(e) => { setHasta(e.target.value); setPage(0); }} className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>País</label>
                <select value={paisFiltro} onChange={(e) => { setPaisFiltro(e.target.value); setPage(0); }} className="input-field" style={{ cursor: 'pointer' }}>
                  <option value="">Todos</option>
                  {paises.map((p) => <option key={p.id} value={p.id}>{p.bandera} {p.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Fuente</label>
                <select value={fuenteFiltro} onChange={(e) => { setFuenteFiltro(e.target.value); setPage(0); }} className="input-field" style={{ cursor: 'pointer' }}>
                  <option value="">Todas</option>
                  {fuentes.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Tipo</label>
                <select value={tipoFiltro} onChange={(e) => { setTipoFiltro(e.target.value); setPage(0); }} className="input-field" style={{ cursor: 'pointer' }}>
                  <option value="">Todos</option>
                  {['Donación', 'Préstamo', 'Inversión'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total movilizado', value: formatUSD(totalFiltrado, true), icon: TrendingUp, color: '#19486A', bg: '#eef3f8' },
          { label: 'Registros', value: String(filtered.length), icon: FileText, color: '#d97706', bg: '#fffbeb' },
          { label: 'Países', value: String(paisesCount), icon: Globe, color: '#16a34a', bg: '#ecfdf5' },
          { label: 'Fuentes', value: String(fuentesCount), icon: Landmark, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Promedio / recurso', value: formatUSD(avgPerRecurso, true), icon: BarChart3, color: '#0891b2', bg: '#ecfeff' },
        ].map((kpi) => (
          <div key={kpi.label} style={{
            backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px',
            border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kpi.label}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={16} style={{ color: kpi.color }} />
              </div>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: kpi.color, fontVariantNumeric: 'tabular-nums' }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Line Chart */}
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '18px', padding: '24px',
          border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>Tendencia mensual</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Flujo de recursos en el tiempo</div>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#eef3f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={15} style={{ color: '#19486A' }} />
            </div>
          </div>
          {trendData.length > 0
            ? <LineChartWrapper data={trendData} lines={[{ key: 'monto', color: '#19486A', name: 'USD movilizados' }]} xKey="mes" height={260} />
            : <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '13px' }}>Sin datos para el período</div>
          }
        </div>

        {/* Bar Chart */}
        <div style={{
          backgroundColor: '#ffffff', borderRadius: '18px', padding: '24px',
          border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>Recursos por país</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>Top {byPaisData.length} países por monto</div>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={15} style={{ color: '#16a34a' }} />
            </div>
          </div>
          {byPaisData.length > 0
            ? <BarChartWrapper data={byPaisData} bars={[{ key: 'monto', color: '#56C02B', name: 'USD' }]} xKey="pais" height={260} />
            : <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '13px' }}>Sin datos para el período</div>
          }
        </div>
      </div>

      {/* Distribution by Type - Mini cards */}
      {byTipoData.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {byTipoData.map((t) => {
            const pct = totalFiltrado > 0 ? ((t.value / totalFiltrado) * 100).toFixed(1) : '0';
            const colorMap: Record<string, string> = { 'Donación': '#16a34a', 'Préstamo': '#d97706', 'Inversión': '#19486A' };
            const bgMap: Record<string, string> = { 'Donación': '#ecfdf5', 'Préstamo': '#fffbeb', 'Inversión': '#eef3f8' };
            return (
              <div key={t.name} style={{
                flex: 1, minWidth: '160px', backgroundColor: '#ffffff',
                borderRadius: '14px', padding: '18px 20px',
                border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colorMap[t.name] ?? '#6b7280' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>{t.name}</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: colorMap[t.name] ?? '#374151', fontVariantNumeric: 'tabular-nums', marginBottom: '6px' }}>
                  {formatUSD(t.value, true)}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <div style={{ flex: 1, height: '5px', borderRadius: '3px', backgroundColor: bgMap[t.name] ?? '#f3f4f6', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '3px', backgroundColor: colorMap[t.name] ?? '#6b7280', width: `${pct}%`, transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Table */}
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '18px',
        border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginBottom: '24px', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f0f0f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#eef3f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={14} style={{ color: '#19486A' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>Detalle de recursos</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', padding: '3px 8px', borderRadius: '6px', backgroundColor: '#f3f4f6' }}>
              {filtered.length}
            </span>
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                style={{
                  padding: '6px 12px', borderRadius: '8px', border: '1px solid #e5e7eb',
                  backgroundColor: page === 0 ? '#f9fafb' : '#ffffff', cursor: page === 0 ? 'default' : 'pointer',
                  fontWeight: 600, fontSize: '11px', color: page === 0 ? '#d1d5db' : '#374151',
                }}
              >
                Anterior
              </button>
              <span style={{ fontWeight: 700, padding: '0 8px', fontVariantNumeric: 'tabular-nums' }}>
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                style={{
                  padding: '6px 12px', borderRadius: '8px', border: '1px solid #e5e7eb',
                  backgroundColor: page >= totalPages - 1 ? '#f9fafb' : '#ffffff', cursor: page >= totalPages - 1 ? 'default' : 'pointer',
                  fontWeight: 600, fontSize: '11px', color: page >= totalPages - 1 ? '#d1d5db' : '#374151',
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {[
                  { label: 'País', key: null },
                  { label: 'Fuente', key: null },
                  { label: 'Monto', key: 'monto' as const },
                  { label: 'Tipo', key: null },
                  { label: 'Sector', key: null },
                  { label: 'Estado', key: null },
                  { label: 'Fecha', key: 'fecha' as const },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={col.key ? () => toggleSort(col.key!) : undefined}
                    style={{
                      padding: '14px 18px', textAlign: 'left',
                      fontSize: '10px', fontWeight: 700, color: '#9ca3af',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      whiteSpace: 'nowrap', borderBottom: '1px solid #e5e7eb',
                      cursor: col.key ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {col.label}
                      {col.key && <SortIcon col={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((r, idx) => {
                const p = paises.find((x) => x.id === r.paisDestinoId);
                const f = fuentes.find((x) => x.id === r.fuenteId);
                return (
                  <tr
                    key={r.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f4f8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafbfc'}
                  >
                    <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', fontWeight: 600, color: '#374151' }}>
                      {p?.bandera} {p?.nombre}
                    </td>
                    <td style={{ padding: '14px 18px', whiteSpace: 'nowrap', color: '#6b7280', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {f?.nombre}
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#19486A', fontVariantNumeric: 'tabular-nums' }}>
                      {formatUSD(r.monto, true)}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {tipoBadge(r.tipoAyuda)}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#6b7280', fontSize: '12px' }}>
                      {r.sector}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      {estadoBadge(r.estado)}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#9ca3af', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} />
                        {formatDate(r.fechaDesembolso)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#9ca3af' }}>
            <FileText size={32} style={{ margin: '0 auto 12px', color: '#d1d5db' }} />
            <p style={{ fontSize: '14px', fontWeight: 500 }}>No hay recursos para los filtros seleccionados</p>
          </div>
        )}
      </div>

      {/* ODS Indicators */}
      <div style={{
        borderRadius: '18px', padding: '28px',
        background: 'linear-gradient(160deg, #19486A 0%, #0D2137 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{
              padding: '5px 12px', borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              ODS 17
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>
              Indicadores Globales
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {[
              { v: '$541M', l: 'Financiación para datos estadísticos (2020)', c: '#56C02B', border: 'rgba(86,192,43,0.15)' },
              { v: '66%', l: 'Población mundial con internet (2022 vs 40% en 2015)', c: '#FD9D24', border: 'rgba(253,157,36,0.15)' },
              { v: 'AOD', l: 'Máximos históricos, focalizado en refugiados/Ucrania', c: '#00B4D8', border: 'rgba(0,180,216,0.15)' },
            ].map((i) => (
              <div key={i.l} style={{
                backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '14px',
                padding: '22px', border: `1px solid ${i.border}`,
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
              >
                <div style={{ fontSize: '28px', fontWeight: 800, color: i.c, marginBottom: '8px', fontFamily: "'DM Serif Display', serif" }}>{i.v}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{i.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          position: 'absolute', right: '-40px', bottom: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(86,192,43,0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: '-30px', top: '-30px',
          width: '150px', height: '150px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.06), transparent 70%)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  );
}
