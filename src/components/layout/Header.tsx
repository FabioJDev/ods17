import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  RefreshCw, ChevronRight, Shield, BarChart3, Eye,
  Bell, LogOut,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const PAGE_META: Record<string, { name: string; desc: string }> = {
  '/':         { name: 'Dashboard', desc: 'Resumen general' },
  '/fuentes':  { name: 'Fuentes', desc: 'Gestión de fuentes' },
  '/recursos': { name: 'Recursos', desc: 'Gestión de recursos' },
  '/paises':   { name: 'Países', desc: 'Países beneficiarios' },
  '/reportes': { name: 'Reportes', desc: 'Análisis y reportes' },
};

const ROL_STYLE: Record<string, { color: string; bg: string; border: string; iconBg: string }> = {
  Administrador: { color: '#b91c1c', bg: '#fef2f2', border: '#fecaca', iconBg: '#fee2e2' },
  Analista:      { color: '#b45309', bg: '#fffbeb', border: '#fde68a', iconBg: '#fef3c7' },
  Observador:    { color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd', iconBg: '#e0f2fe' },
};

const ROL_AVATAR: Record<string, string> = {
  Administrador: 'linear-gradient(135deg, #ef4444, #dc2626)',
  Analista:      'linear-gradient(135deg, #f59e0b, #d97706)',
  Observador:    'linear-gradient(135deg, #38bdf8, #0ea5e9)',
};

const ROL_ICON: Record<string, typeof Shield> = {
  Administrador: Shield,
  Analista: BarChart3,
  Observador: Eye,
};

export default function Header() {
  const location = useLocation();
  const usuario = useAppStore((s) => s.usuario);
  const setUsuario = useAppStore((s) => s.setUsuario);
  const agregarToast = useAppStore((s) => s.agregarToast);
  const [syncing, setSyncing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const meta = PAGE_META[location.pathname] ?? { name: 'FinTrack', desc: '' };

  const handleSync = useCallback(() => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      agregarToast({ tipo: 'success', mensaje: 'Datos sincronizados correctamente' });
    }, 2000);
  }, [syncing, agregarToast]);

  const initial = usuario?.nombre?.[0]?.toUpperCase() ?? 'U';
  const rol = usuario?.rol ?? '';
  const rolStyle = ROL_STYLE[rol];
  const RolIcon = ROL_ICON[rol];

  return (
    <>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '64px', minHeight: '64px',
        backgroundColor: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        position: 'sticky', top: 0, zIndex: 30,
      }}>
        {/* Left: Breadcrumb + page info */}
        <div className="ml-10 lg:ml-0" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <nav aria-label="Breadcrumb">
              <ol style={{ display: 'flex', alignItems: 'center', gap: '6px', listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#19486A', letterSpacing: '-0.01em' }}>FinTrack</span>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={13} style={{ color: '#d1d5db' }} />
                </li>
                <li aria-current="page">
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>{meta.name}</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Right: Actions + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sync button */}
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '8px 14px', borderRadius: '10px',
              fontSize: '12px', fontWeight: 600,
              color: '#19486A',
              backgroundColor: syncing ? '#eef3f8' : 'transparent',
              border: '1px solid #e5e7eb',
              cursor: syncing ? 'default' : 'pointer',
              transition: 'all 0.15s ease',
              opacity: syncing ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (!syncing) e.currentTarget.style.backgroundColor = '#f0f4f8'; }}
            onMouseLeave={(e) => { if (!syncing) e.currentTarget.style.backgroundColor = 'transparent'; }}
            aria-label="Sincronizar datos"
          >
            <RefreshCw
              size={14}
              style={{
                animation: syncing ? 'spin 0.8s linear infinite' : 'none',
              }}
            />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>

          {/* Notification bell */}
          <button
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '10px',
              border: '1px solid #e5e7eb', backgroundColor: 'transparent',
              cursor: 'pointer', position: 'relative', transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f4f8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label="Notificaciones"
          >
            <Bell size={16} style={{ color: '#6b7280' }} />
            <div style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: '#56C02B', border: '1.5px solid #ffffff',
            }} />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '28px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />

          {/* Role badge */}
          {rolStyle && (
            <div style={{
              display: 'none', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '8px',
              fontSize: '11px', fontWeight: 700,
              color: rolStyle.color,
              backgroundColor: rolStyle.bg,
              border: `1px solid ${rolStyle.border}`,
            }}
            className="hidden md:!flex"
            >
              {RolIcon && <RolIcon size={12} />}
              {rol}
            </div>
          )}

          {/* Profile */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', position: 'relative' }}
            onClick={() => setShowProfile(!showProfile)}
          >
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: ROL_AVATAR[rol] ?? 'linear-gradient(135deg, #9ca3af, #6b7280)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', fontSize: '14px', fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              transition: 'transform 0.12s ease',
              flexShrink: 0,
            }}>
              {initial}
            </div>
            <div className="hidden lg:block" style={{ lineHeight: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A2E', marginBottom: '3px' }}>
                {usuario?.nombre}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                {usuario?.email}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile dropdown */}
      {showProfile && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setShowProfile(false)}
          />
          <div style={{
            position: 'fixed', top: '68px', right: '24px', zIndex: 50,
            width: '240px', backgroundColor: '#ffffff',
            borderRadius: '14px', border: '1px solid #e5e7eb',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}>
            {/* User info */}
            <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: ROL_AVATAR[rol] ?? 'linear-gradient(135deg, #9ca3af, #6b7280)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontSize: '15px', fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}>
                  {initial}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {usuario?.nombre}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {usuario?.email}
                  </div>
                </div>
              </div>
              {rolStyle && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  marginTop: '12px', padding: '5px 10px', borderRadius: '8px',
                  fontSize: '11px', fontWeight: 700,
                  color: rolStyle.color, backgroundColor: rolStyle.bg,
                  border: `1px solid ${rolStyle.border}`,
                }}>
                  {RolIcon && <RolIcon size={11} />}
                  {rol}
                </div>
              )}
            </div>
            {/* Logout */}
            <div style={{ padding: '8px' }}>
              <button
                onClick={() => { setUsuario(null); setShowProfile(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                  padding: '10px 12px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: 600, color: '#ef4444',
                  backgroundColor: 'transparent', border: 'none',
                  cursor: 'pointer', transition: 'background-color 0.12s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
