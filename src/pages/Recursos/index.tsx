import { useState } from 'react';
import { Plus, DollarSign, Building2, MapPin, CalendarDays, Tag, Layers, FileText, Target, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { paises } from '../../data/paises';
import DataTable from '../../components/ui/DataTable';
import FilterBar from '../../components/ui/FilterBar';
import { estadoBadge, tipoBadge } from '../../components/ui/Badge';
import { formatUSD } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import type { Recurso, TipoAyuda, EstadoRecurso, Sector } from '../../types';

export default function Recursos() {
  const recursos = useAppStore((s) => s.recursos);
  const fuentes = useAppStore((s) => s.fuentes);
  const agregarRecurso = useAppStore((s) => s.agregarRecurso);
  const agregarToast = useAppStore((s) => s.agregarToast);
  const { puedeCrear } = useAuth();

  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    monto: '', fuenteId: '', paisDestinoId: '',
    tipoAyuda: 'Donación' as TipoAyuda, sector: 'Salud' as Sector,
    estado: 'Disponible' as EstadoRecurso, fechaDesembolso: '', descripcion: '', impactoEstimado: '',
  });

  const filtered = recursos.filter((r) => {
    const f = fuentes.find((f) => f.id === r.fuenteId);
    const p = paises.find((p) => p.id === r.paisDestinoId);
    const q = search.toLowerCase();
    const matchQ = !q || r.descripcion.toLowerCase().includes(q) || (f?.nombre ?? '').toLowerCase().includes(q) || (p?.nombre ?? '').toLowerCase().includes(q);
    const matchE = !filtroEstado || r.estado === filtroEstado;
    const matchT = !filtroTipo || r.tipoAyuda === filtroTipo;
    return matchQ && matchE && matchT;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Recurso = {
      id: `r${Date.now()}`,
      monto: parseFloat(form.monto.replace(/[^0-9.]/g, '')),
      fuenteId: form.fuenteId,
      paisDestinoId: form.paisDestinoId,
      tipoAyuda: form.tipoAyuda,
      sector: form.sector,
      estado: form.estado,
      fechaDesembolso: form.fechaDesembolso,
      descripcion: form.descripcion,
      impactoEstimado: form.impactoEstimado,
    };
    agregarRecurso(nuevo);
    agregarToast({ tipo: 'success', mensaje: `Recurso de ${formatUSD(nuevo.monto, true)} registrado exitosamente` });
    setShowForm(false);
    setForm({ monto: '', fuenteId: '', paisDestinoId: '', tipoAyuda: 'Donación', sector: 'Salud', estado: 'Disponible', fechaDesembolso: '', descripcion: '', impactoEstimado: '' });
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '11px', fontWeight: 700, color: '#6b7280',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    marginBottom: '8px',
  };

  return (
    <div>
      <div className="page-header flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-black text-[#1A1A2E]">Recursos Financieros</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {recursos.length} recursos · {formatUSD(recursos.reduce((s, r) => s + r.monto, 0), true)} total
          </p>
        </div>
        {puedeCrear && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#19486A] text-white text-sm font-semibold rounded-xl hover:bg-[#0D2137] transition-colors cursor-pointer"
          >
            <Plus size={16} /> Nuevo recurso
          </button>
        )}
      </div>

      <div className="page-content space-y-4">
        {/* Form panel */}
        {showForm && puedeCrear && (
          <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px', background: 'linear-gradient(135deg, #0f2a45 0%, #19486A 60%, #1a5c3a 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={18} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>Registrar nuevo recurso</h3>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: 0, marginTop: '2px' }}>Completa todos los campos requeridos</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowForm(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} color="#fff" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>

                {/* Monto */}
                <div>
                  <label style={labelStyle}><DollarSign size={12} style={{ color: '#19486A' }} /> Monto (USD) <span style={{ color: '#f87171' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 600, color: '#9ca3af' }}>$</span>
                    <input
                      type="text"
                      value={form.monto}
                      onChange={(e) => setForm({ ...form, monto: e.target.value })}
                      placeholder="5,000,000"
                      required
                      className="input-field"
                      style={{ paddingLeft: '30px' }}
                    />
                  </div>
                </div>

                {/* Fuente */}
                <div>
                  <label style={labelStyle}><Building2 size={12} style={{ color: '#19486A' }} /> Fuente <span style={{ color: '#f87171' }}>*</span></label>
                  <select value={form.fuenteId} onChange={(e) => setForm({ ...form, fuenteId: e.target.value })} required className="input-field" style={{ cursor: 'pointer' }}>
                    <option value="">Seleccionar fuente</option>
                    {fuentes.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                  </select>
                </div>

                {/* País destino */}
                <div>
                  <label style={labelStyle}><MapPin size={12} style={{ color: '#19486A' }} /> País destino <span style={{ color: '#f87171' }}>*</span></label>
                  <select value={form.paisDestinoId} onChange={(e) => setForm({ ...form, paisDestinoId: e.target.value })} required className="input-field" style={{ cursor: 'pointer' }}>
                    <option value="">Seleccionar país</option>
                    {paises.map((p) => <option key={p.id} value={p.id}>{p.bandera} {p.nombre}</option>)}
                  </select>
                </div>

                {/* Fecha desembolso */}
                <div>
                  <label style={labelStyle}><CalendarDays size={12} style={{ color: '#19486A' }} /> Fecha desembolso <span style={{ color: '#f87171' }}>*</span></label>
                  <input type="date" value={form.fechaDesembolso} onChange={(e) => setForm({ ...form, fechaDesembolso: e.target.value })} required className="input-field" />
                </div>

                {/* Tipo de ayuda */}
                <div>
                  <label style={labelStyle}><Tag size={12} style={{ color: '#19486A' }} /> Tipo de ayuda</label>
                  <select value={form.tipoAyuda} onChange={(e) => setForm({ ...form, tipoAyuda: e.target.value as TipoAyuda })} className="input-field" style={{ cursor: 'pointer' }}>
                    {['Donación', 'Préstamo', 'Inversión'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Sector */}
                <div>
                  <label style={labelStyle}><Layers size={12} style={{ color: '#19486A' }} /> Sector</label>
                  <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value as Sector })} className="input-field" style={{ cursor: 'pointer' }}>
                    {['Salud', 'Educación', 'Infraestructura', 'Tecnología', 'Agricultura'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Descripción */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}><FileText size={12} style={{ color: '#19486A' }} /> Descripción <span style={{ color: '#f87171' }}>*</span></label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    rows={3}
                    required
                    placeholder="Describe brevemente el propósito del recurso..."
                    className="input-field"
                    style={{ resize: 'none', lineHeight: '1.6' }}
                  />
                </div>

                {/* Impacto estimado */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}><Target size={12} style={{ color: '#19486A' }} /> Impacto estimado</label>
                  <input
                    type="text"
                    value={form.impactoEstimado}
                    onChange={(e) => setForm({ ...form, impactoEstimado: e.target.value })}
                    placeholder="Ej: 50,000 personas beneficiadas"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: '10px 22px', fontSize: '14px', fontWeight: 600, color: '#4b5563', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #19486A 0%, #1a5c3a 100%)', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(25,72,106,0.3)' }}>
                  <Plus size={15} />
                  Registrar recurso
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="mb-4">
            <FilterBar
              search={search}
              onSearch={setSearch}
              placeholder="Buscar por descripción, fuente o país..."
              filters={[
                {
                  label: 'Estado', value: filtroEstado, onChange: setFiltroEstado,
                  options: ['Disponible', 'Asignado', 'En proceso'].map((v) => ({ value: v, label: v })),
                },
                {
                  label: 'Tipo', value: filtroTipo, onChange: setFiltroTipo,
                  options: ['Donación', 'Préstamo', 'Inversión'].map((v) => ({ value: v, label: v })),
                },
              ]}
            />
          </div>
          <DataTable
            data={filtered}
            columns={[
              {
                key: 'paisDestinoId', label: 'País',
                render: (r) => {
                  const p = paises.find((p) => p.id === r.paisDestinoId);
                  return <span>{p?.bandera} {p?.nombre}</span>;
                },
              },
              {
                key: 'fuenteId', label: 'Fuente',
                render: (r) => {
                  const f = fuentes.find((f) => f.id === r.fuenteId);
                  return <span className="text-xs text-gray-600">{f?.nombre ?? r.fuenteId}</span>;
                },
              },
              { key: 'monto', label: 'Monto', sortable: true,
                render: (r) => <span className="font-bold text-[#19486A]">{formatUSD(r.monto, true)}</span> },
              { key: 'tipoAyuda', label: 'Tipo', render: (r) => tipoBadge(r.tipoAyuda) },
              { key: 'sector', label: 'Sector' },
              { key: 'estado', label: 'Estado', render: (r) => estadoBadge(r.estado) },
              { key: 'fechaDesembolso', label: 'Fecha', render: (r) => formatDate(r.fechaDesembolso) },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
