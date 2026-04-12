import { useState } from 'react';
import { Plus } from 'lucide-react';
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4">Registrar nuevo recurso</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Monto (USD)</label>
                <input
                  type="text"
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  placeholder="Ej: 5000000"
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fuente</label>
                <select
                  value={form.fuenteId}
                  onChange={(e) => setForm({ ...form, fuenteId: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/30 cursor-pointer"
                >
                  <option value="">Seleccionar fuente</option>
                  {fuentes.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">País destino</label>
                <select
                  value={form.paisDestinoId}
                  onChange={(e) => setForm({ ...form, paisDestinoId: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/30 cursor-pointer"
                >
                  <option value="">Seleccionar país</option>
                  {paises.map((p) => <option key={p.id} value={p.id}>{p.bandera} {p.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Fecha desembolso</label>
                <input
                  type="date"
                  value={form.fechaDesembolso}
                  onChange={(e) => setForm({ ...form, fechaDesembolso: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tipo de ayuda</label>
                <select
                  value={form.tipoAyuda}
                  onChange={(e) => setForm({ ...form, tipoAyuda: e.target.value as TipoAyuda })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/30 cursor-pointer"
                >
                  {['Donación', 'Préstamo', 'Inversión'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sector</label>
                <select
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value as Sector })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/30 cursor-pointer"
                >
                  {['Salud', 'Educación', 'Infraestructura', 'Tecnología', 'Agricultura'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={2}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/30 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Impacto estimado</label>
                <input
                  type="text"
                  value={form.impactoEstimado}
                  onChange={(e) => setForm({ ...form, impactoEstimado: e.target.value })}
                  placeholder="Ej: 50,000 personas beneficiadas"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19486A]/30"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button type="submit"
                  className="px-6 py-2.5 bg-[#19486A] text-white text-sm font-semibold rounded-xl hover:bg-[#0D2137] transition-colors cursor-pointer">
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
