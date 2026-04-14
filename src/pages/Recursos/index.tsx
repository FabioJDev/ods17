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
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
              style={{ background: 'linear-gradient(135deg, #0f2a45 0%, #19486A 60%, #1a5c3a 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <Plus size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Registrar nuevo recurso</h3>
                  <p className="text-xs text-white/60">Completa todos los campos requeridos</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={15} className="text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Monto */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <DollarSign size={12} className="text-[#19486A]" /> Monto (USD) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
                    <input
                      type="text"
                      value={form.monto}
                      onChange={(e) => setForm({ ...form, monto: e.target.value })}
                      placeholder="5,000,000"
                      required
                      className="w-full pl-7 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/25 focus:border-[#19486A]/40 focus:bg-white transition-all text-gray-800 placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Fuente */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <Building2 size={12} className="text-[#19486A]" /> Fuente <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.fuenteId}
                    onChange={(e) => setForm({ ...form, fuenteId: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/25 focus:border-[#19486A]/40 focus:bg-white transition-all text-gray-800 cursor-pointer appearance-none"
                  >
                    <option value="">Seleccionar fuente</option>
                    {fuentes.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                  </select>
                </div>

                {/* País destino */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <MapPin size={12} className="text-[#19486A]" /> País destino <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.paisDestinoId}
                    onChange={(e) => setForm({ ...form, paisDestinoId: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/25 focus:border-[#19486A]/40 focus:bg-white transition-all text-gray-800 cursor-pointer appearance-none"
                  >
                    <option value="">Seleccionar país</option>
                    {paises.map((p) => <option key={p.id} value={p.id}>{p.bandera} {p.nombre}</option>)}
                  </select>
                </div>

                {/* Fecha desembolso */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <CalendarDays size={12} className="text-[#19486A]" /> Fecha desembolso <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.fechaDesembolso}
                    onChange={(e) => setForm({ ...form, fechaDesembolso: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/25 focus:border-[#19486A]/40 focus:bg-white transition-all text-gray-800"
                  />
                </div>

                {/* Tipo de ayuda */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <Tag size={12} className="text-[#19486A]" /> Tipo de ayuda
                  </label>
                  <select
                    value={form.tipoAyuda}
                    onChange={(e) => setForm({ ...form, tipoAyuda: e.target.value as TipoAyuda })}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/25 focus:border-[#19486A]/40 focus:bg-white transition-all text-gray-800 cursor-pointer appearance-none"
                  >
                    {['Donación', 'Préstamo', 'Inversión'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                {/* Sector */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <Layers size={12} className="text-[#19486A]" /> Sector
                  </label>
                  <select
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value as Sector })}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/25 focus:border-[#19486A]/40 focus:bg-white transition-all text-gray-800 cursor-pointer appearance-none"
                  >
                    {['Salud', 'Educación', 'Infraestructura', 'Tecnología', 'Agricultura'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <FileText size={12} className="text-[#19486A]" /> Descripción <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    rows={2}
                    required
                    placeholder="Describe brevemente el propósito del recurso..."
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/25 focus:border-[#19486A]/40 focus:bg-white transition-all text-gray-800 placeholder:text-gray-300 resize-none"
                  />
                </div>

                {/* Impacto estimado */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    <Target size={12} className="text-[#19486A]" /> Impacto estimado
                  </label>
                  <input
                    type="text"
                    value={form.impactoEstimado}
                    onChange={(e) => setForm({ ...form, impactoEstimado: e.target.value })}
                    placeholder="Ej: 50,000 personas beneficiadas"
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/25 focus:border-[#19486A]/40 focus:bg-white transition-all text-gray-800 placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all cursor-pointer hover:shadow-lg active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #19486A 0%, #1a5c3a 100%)', boxShadow: '0 4px 14px rgba(25,72,106,0.3)' }}
                >
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
