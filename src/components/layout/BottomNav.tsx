import { NavLink } from 'react-router-dom';
import { NAV } from './Sidebar';

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.04)',
      }}
      aria-label="Navegación rápida"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl min-w-[3.5rem] transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 shadow-sm' : ''}`}>
                  <Icon size={19} aria-hidden="true" />
                </div>
                <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-primary' : ''}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
