import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Globe, DollarSign, Map, BarChart3, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/fuentes', label: 'Fuentes', icon: Globe },
  { to: '/recursos', label: 'Recursos', icon: DollarSign },
  { to: '/paises', label: 'Países', icon: Map },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
];

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 260;

export default function Sidebar() {
  const setUsuario = useAppStore((s) => s.setUsuario);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isHovered;

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden text-white p-2.5 rounded-xl cursor-pointer"
        style={{ backgroundColor: '#19486A', boxShadow: '0 4px 15px rgba(25,72,106,0.4)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed top-0 left-0 h-full flex flex-col z-40
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:h-screen
        `}
        style={{
          width: mobileOpen ? EXPANDED_WIDTH : (isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH),
          transition: 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.15s ease',
          background: 'linear-gradient(180deg, #0f2a45 0%, #19486A 50%, #1a4a5e 100%)',
          boxShadow: isExpanded 
            ? '4px 0 30px rgba(0,0,0,0.25), 0 0 60px rgba(25,72,106,0.15)' 
            : '2px 0 15px rgba(0,0,0,0.15)',
        }}
      >
        {/* Decorative top gradient line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #56C02B 0%, #3d9920 50%, #2d7a18 100%)',
        }} />

        {/* Logo Section */}
        <div 
          className="flex items-center overflow-hidden"
          style={{ 
            padding: isExpanded ? '24px 20px' : '24px 0',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            minHeight: '80px',
          }}
        >
          <div 
            className="flex-shrink-0 flex items-center justify-center text-white font-black"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #56C02B 0%, #3d9920 100%)',
              boxShadow: '0 4px 15px rgba(86,192,43,0.3)',
              fontSize: '16px',
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            17
          </div>
          
          <div 
            className="overflow-hidden"
            style={{ 
              marginLeft: isExpanded ? '14px' : '0',
              width: isExpanded ? '150px' : '0',
              opacity: isExpanded ? 1 : 0,
              transition: 'all 0.12s ease',
            }}
          >
            <div style={{ 
              color: '#ffffff', 
              fontWeight: 800, 
              fontSize: '15px',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              FinTrack
            </div>
            <div style={{ 
              color: 'rgba(255,255,255,0.45)', 
              fontSize: '11px',
              whiteSpace: 'nowrap',
              marginTop: '2px',
            }}>
              ODS 17 · Meta 17.3
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ marginBottom: '8px' }}>
            {isExpanded && (
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                paddingLeft: '12px',
              }}>
                Navegación
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className="sidebar-link"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isExpanded ? '12px 14px' : '12px 0',
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'background-color 0.12s ease, color 0.12s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                })}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '3px',
                        height: '20px',
                        borderRadius: '0 3px 3px 0',
                        background: '#56C02B',
                      }} />
                    )}
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      flexShrink: 0,
                    }}>
                      <Icon size={19} />
                    </div>
                    
                    <span style={{
                      whiteSpace: 'nowrap',
                      opacity: isExpanded ? 1 : 0,
                      width: isExpanded ? 'auto' : 0,
                      transition: 'opacity 0.1s ease',
                      overflow: 'hidden',
                    }}>
                      {label}
                    </span>

                    {isExpanded && isActive && (
                      <ChevronRight 
                        size={14} 
                        style={{ 
                          marginLeft: 'auto', 
                          opacity: 0.5,
                        }} 
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div style={{ 
          padding: '16px 12px', 
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <button
            onClick={() => setUsuario(null)}
            className="sidebar-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: isExpanded ? '12px 14px' : '12px 0',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              borderRadius: '10px',
              width: '100%',
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.12s ease, color 0.12s ease',
            }}
            aria-label="Cerrar sesión"
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              flexShrink: 0,
            }}>
              <LogOut size={18} />
            </div>
            <span style={{
              whiteSpace: 'nowrap',
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? 'auto' : 0,
              transition: 'opacity 0.1s ease',
              overflow: 'hidden',
            }}>
              Cerrar sesión
            </span>
          </button>
        </div>

        {/* Expand indicator (visible when collapsed) */}
        {!isExpanded && (
          <div style={{
            position: 'absolute',
            right: '-6px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '40px',
            borderRadius: '0 6px 6px 0',
            backgroundColor: 'rgba(86,192,43,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.6,
            transition: 'opacity 0.2s ease',
          }}>
            <ChevronRight size={10} color="#fff" />
          </div>
        )}
      </aside>
    </>
  );
}
