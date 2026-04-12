import { useState } from 'react';
import { Plus, Eye, Globe, Building2, Landmark, Briefcase, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import DataTable from '../../components/ui/DataTable';
import FilterBar from '../../components/ui/FilterBar';
import Modal from '../../components/ui/Modal';
import { estadoBadge, tipoBadge } from '../../components/ui/Badge';
import { formatUSD } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import type { Fuente, TipoFuente, EstadoFuente } from '../../types';

const TIPO_ICONS: Record<string, typeof Globe> = {
  'Gobierno': Landmark,
  'ONG': Globe,
  'Empresa': Briefcase,
  'Organismo Internacional': Building2,
};

export default function Fuentes() {
  const fuentes = useAppStore((s) => s.fuentes);
  const agregarFuente = useAppStore((s) => s.agregarFuente);
  const agregarToast = useAppStore((s) => s.agregarToast);
  const recursos = useAppStore((s) => s.recursos);
  const { puedeCrear } = useAuth();

  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modalNueva, setModalNueva] = useState(false);
  const [fuenteDetalle, setFuenteDetalle] = useState<Fuente | null>(null);

  const [form, setForm] = useState({
    nombre: '', tipo: 'Gobierno' as TipoFuente, paisOrigen: '',
    contacto: '', descripcion: '', estado: 'Activo' as EstadoFuente,
  });

  const activas = fuentes.filter((f) => f.estado === 'Activo').length;
  const totalAportado = fuentes.reduce((s, f) => s + f.totalAportado, 0);
  const tiposUnicos = new Set(fuentes.map((f) => f.tipo)).size;

  const filtered = fuentes.filter((f) => {
    const q = search.toLowerCase();
    const matchQ = !q || f.nombre.toLowerCase().includes(q) || f.paisOrigen.toLowerCase().includes(q);
    const matchT = !filtroTipo || f.tipo === filtroTipo;
    const matchE = !filtroEstado || f.estado === filtroEstado;
    return matchQ && matchT && matchE;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nueva: Fuente = {
      id: `f${Date.now()}`,
      ...form,
      totalAportado: 0,
      fechaRegistro: new Date().toISOString().slice(0, 10),
    };
    agregarFuente(nueva);
    setModalNueva(false);
    setForm({ nombre: '', tipo: 'Gobierno', paisOrigen: '', contacto: '', descripcion: '', estado: 'Activo' });
    agregarToast({ tipo: 'success', mensaje: `Fuente "${nueva.nombre}" registrada exitosamente` });
  };

  const fuenteRecursos = fuenteDetalle
    ? recursos.filter((r) => r.fuenteId === fuenteDetalle.id)
    : [];

  const stats = [
    { label: 'Total fuentes', value: fuentes.length.toString(), icon: Building2, color: '#19486A', bg: '#eef3f8' },
    { label: 'Activas', value: activas.toString(), icon: Globe, color: '#16a34a', bg: '#ecfdf5' },
    { label: 'Total movilizado', value: formatUSD(totalAportado, true), icon: TrendingUp, color: '#0891b2', bg: '#ecfeff' },
    { label: 'Tipos', value: tiposUnicos.toString(), icon: Briefcase, color: '#d97706', bg: '#fffbeb' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1.2 }}>
            Fuentes de Financiamiento
          </h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
            Gestiona las fuentes de financiamiento del ODS 17
          </p>
        </div>
        {puedeCrear && (
          <button
            onClick={() => setModalNueva(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              backgroundColor: '#19486A',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 12px rgba(25,72,106,0.25)',
            }}
          >
            <Plus size={16} /> Nueva fuente
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px 22px',
              border: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, marginTop: '2px' }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters + Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <FilterBar
            search={search}
            onSearch={setSearch}
            placeholder="Buscar por nombre o país..."
            filters={[
              {
                label: 'Tipo', value: filtroTipo, onChange: setFiltroTipo,
                options: ['Gobierno', 'ONG', 'Empresa', 'Organismo Internacional'].map((v) => ({ value: v, label: v })),
              },
              {
                label: 'Estado', value: filtroEstado, onChange: setFiltroEstado,
                options: [{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }],
              },
            ]}
          />
        </div>
        <DataTable
          data={filtered}
          columns={[
            {
              key: 'nombre', label: 'Nombre', sortable: true,
              render: (r) => {
                const Icon = TIPO_ICONS[r.tipo] || Globe;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '9px',
                      backgroundColor: '#f0f4f8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={15} style={{ color: '#19486A' }} />
                    </div>
                    <span style={{ fontWeight: 600, color: '#1f2937' }}>{r.nombre}</span>
                  </div>
                );
              },
            },
            { key: 'tipo', label: 'Tipo', render: (r) => tipoBadge(r.tipo) },
            { key: 'paisOrigen', label: 'País origen', sortable: true },
            {
              key: 'totalAportado', label: 'Total aportado', sortable: true,
              render: (r) => (
                <span style={{ fontWeight: 700, color: '#19486A' }}>{formatUSD(r.totalAportado, true)}</span>
              ),
            },
            { key: 'estado', label: 'Estado', render: (r) => estadoBadge(r.estado) },
            { key: 'fechaRegistro', label: 'Registro', render: (r) => formatDate(r.fechaRegistro) },
            {
              key: 'acciones', label: '',
              render: (r) => (
                <button
                  onClick={() => setFuenteDetalle(r)}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s',
                  }}
                  aria-label="Ver detalle"
                >
                  <Eye size={15} style={{ color: '#6b7280' }} />
                </button>
              ),
            },
          ]}
        />
      </div>

      {/* Modal Nueva Fuente */}
      <Modal open={modalNueva} onClose={() => setModalNueva(false)} title="Registrar nueva fuente" size="md">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Nombre de la fuente', key: 'nombre', type: 'text', placeholder: 'Ej: Banco Mundial' },
              { label: 'País de origen', key: 'paisOrigen', type: 'text', placeholder: 'Ej: Internacional' },
              { label: 'Contacto (email)', key: 'contacto', type: 'email', placeholder: 'info@org.org' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>{label}</label>
                <input
                  type={type}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required
                  className="input-field"
                />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoFuente })}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  {['Gobierno', 'ONG', 'Empresa', 'Organismo Internacional'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoFuente })}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
                placeholder="Descripción de la organización..."
                className="input-field"
                style={{ resize: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={() => setModalNueva(false)}
                style={{
                  flex: 1, padding: '12px 16px', border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff', fontSize: '14px', color: '#6b7280',
                  borderRadius: '12px', cursor: 'pointer', fontWeight: 600,
                  transition: 'background-color 0.1s',
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  flex: 1, padding: '12px 16px', border: 'none',
                  backgroundColor: '#19486A', fontSize: '14px', color: '#ffffff',
                  borderRadius: '12px', cursor: 'pointer', fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(25,72,106,0.25)',
                  transition: 'background-color 0.1s',
                }}
              >
                Registrar fuente
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal Detalle Fuente */}
      <Modal open={!!fuenteDetalle} onClose={() => setFuenteDetalle(null)} title="Detalle de fuente" size="lg">
        {fuenteDetalle && (() => {
          const Icon = TIPO_ICONS[fuenteDetalle.tipo] || Globe;
          const totalRecursos = fuenteRecursos.reduce((s, r) => s + r.monto, 0);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

              {/* Top hero section */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f0f8 100%)',
                marginBottom: '28px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #19486A 0%, #0f3351 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 6px 20px rgba(25,72,106,0.25)',
                }}>
                  <Icon size={24} style={{ color: '#ffffff' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#1A1A2E', lineHeight: 1.2 }}>
                    {fuenteDetalle.nombre}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    {tipoBadge(fuenteDetalle.tipo)}
                    {estadoBadge(fuenteDetalle.estado)}
                  </div>
                </div>
              </div>

              {/* Key metric card */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '28px',
              }}>
                <div style={{
                  padding: '20px',
                  borderRadius: '14px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Total aportado
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#19486A', letterSpacing: '-0.02em' }}>
                    {formatUSD(fuenteDetalle.totalAportado, true)}
                  </div>
                </div>
                <div style={{
                  padding: '20px',
                  borderRadius: '14px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#ffffff',
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    Recursos asignados
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#0891b2', letterSpacing: '-0.02em' }}>
                    {fuenteRecursos.length}
                    {fuenteRecursos.length > 0 && (
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#9ca3af', marginLeft: '8px' }}>
                        ({formatUSD(totalRecursos, true)})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0',
                borderRadius: '14px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                marginBottom: '28px',
              }}>
                {[
                  { label: 'País de origen', value: fuenteDetalle.paisOrigen, icon: '🌍' },
                  { label: 'Contacto', value: fuenteDetalle.contacto, icon: '📧', isLink: true },
                  { label: 'Fecha de registro', value: formatDate(fuenteDetalle.fechaRegistro), icon: '📅' },
                  { label: 'ID interno', value: fuenteDetalle.id.toUpperCase(), icon: '🔖' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '18px 20px',
                    borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none',
                    borderRight: i % 2 === 0 ? '1px solid #f0f0f0' : 'none',
                    backgroundColor: '#fafbfc',
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: item.isLink ? '#19486A' : '#374151',
                      wordBreak: 'break-all',
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{
                padding: '20px',
                borderRadius: '14px',
                backgroundColor: '#fafbfc',
                border: '1px solid #e5e7eb',
                marginBottom: fuenteRecursos.length > 0 ? '28px' : '0',
              }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Descripción
                </div>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                  {fuenteDetalle.descripcion}
                </p>
              </div>

              {/* Associated resources */}
              {fuenteRecursos.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#19486A',
                    }} />
                    Recursos asociados ({fuenteRecursos.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                    {fuenteRecursos.map((r, idx) => (
                      <div key={r.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px 18px',
                        backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#eef3f8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '13px',
                          fontWeight: 800,
                          color: '#19486A',
                        }}>
                          {idx + 1}
                        </div>
                        <span style={{ fontSize: '13px', color: '#4b5563', flex: 1, lineHeight: 1.4 }}>
                          {r.descripcion}
                        </span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#19486A',
                          whiteSpace: 'nowrap',
                          padding: '6px 12px',
                          backgroundColor: '#eef3f8',
                          borderRadius: '8px',
                        }}>
                          {formatUSD(r.monto, true)}
                        </span>
                      </div>
                    ))}
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
