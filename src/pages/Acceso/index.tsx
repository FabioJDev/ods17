import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { LogIn, Eye, EyeOff, Shield, BarChart3, Globe, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const USERS = [
  { email: 'admin@fintrack.un', pass: 'admin123', nombre: 'Admin ODS', rol: 'Administrador' as const, icon: Shield, desc: 'Control total' },
  { email: 'analista@fintrack.un', pass: 'ana123', nombre: 'Ana Martínez', rol: 'Analista' as const, icon: BarChart3, desc: 'Reportes' },
  { email: 'obs@fintrack.un', pass: 'obs123', nombre: 'Observer UN', rol: 'Observador' as const, icon: Globe, desc: 'Solo lectura' },
];

export default function Acceso() {
  const navigate = useNavigate();
  const setUsuario = useAppStore((s) => s.setUsuario);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.brand-section', { x: -30, opacity: 0, duration: 0.6 })
      .from('.login-card', { y: 30, opacity: 0, duration: 0.5 }, '-=0.3')
      .from('.form-field', { y: 15, opacity: 0, duration: 0.3, stagger: 0.08 }, '-=0.2');
  }, { scope: containerRef, dependencies: [] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 600));
    const user = USERS.find((u) => u.email === email && u.pass === pass);
    if (user) {
      setUsuario({ nombre: user.nombre, email: user.email, rol: user.rol });
      navigate('/');
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      gsap.fromTo('.login-card', { x: -6 }, {
        x: 6, duration: 0.07, repeat: 5, yoyo: true, ease: 'none',
        onComplete: () => { gsap.set('.login-card', { x: 0 }); },
      });
    }
    setLoading(false);
  };

  const selectUser = (u: typeof USERS[0]) => {
    setEmail(u.email);
    setPass(u.pass);
    setError('');
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* LEFT PANEL - Branding */}
      <div className="brand-section relative lg:w-[50%] min-h-[200px] lg:min-h-screen flex flex-col justify-center items-center px-8 py-12 lg:px-16 lg:py-20"
        style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0f2a45 35%, #19486A 70%, #1a5c3a 100%)' }}>
        
        {/* Decorative shapes */}
        <div className="absolute top-[15%] left-[10%] w-20 h-20 rounded-2xl bg-white/[0.03] rotate-12" />
        <div className="absolute top-[60%] right-[15%] w-28 h-28 rounded-2xl bg-white/[0.02] -rotate-12" />
        <div className="absolute bottom-[20%] left-[20%] w-16 h-16 rounded-xl bg-white/[0.04] rotate-45" />
        
        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(86,192,43,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-md w-full text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex mb-8">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #56C02B 0%, #3d9920 100%)', boxShadow: '0 0 50px rgba(86,192,43,0.3), 0 15px 30px rgba(0,0,0,0.3)' }}>
              <span className="text-white font-black text-3xl lg:text-4xl" style={{ fontFamily: "'DM Serif Display', serif" }}>17</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-white text-3xl lg:text-5xl font-black leading-tight mb-4">
            <span style={{ fontFamily: "'DM Serif Display', serif" }}>FinTrack</span>{' '}
            <span className="text-emerald-400" style={{ fontFamily: "'DM Serif Display', serif" }}>ODS17</span>
          </h1>

          <p className="text-white/50 text-sm lg:text-base leading-relaxed max-w-sm mx-auto lg:mx-0">
            Plataforma de monitoreo para la movilización de recursos financieros — Meta 17.3
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto px-6 py-12 lg:px-16 lg:py-20" style={{ background: '#f5f7f9' }}>
        <div className="w-full max-w-[460px]">

          {/* Login Card */}
          <div className="login-card bg-white rounded-3xl shadow-xl" style={{ padding: '48px' }}>

            {/* Header */}
            <div className="form-field" style={{ marginBottom: '40px' }}>
              <div className="flex items-center gap-4" style={{ marginBottom: '12px' }}>
                <div className="w-12 h-12 rounded-xl bg-[#19486A]/10 flex items-center justify-center">
                  <Lock size={20} className="text-[#19486A]" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#1A1A2E]">Iniciar sesión</h2>
              </div>
              <p className="text-gray-400 text-sm" style={{ marginLeft: '64px' }}>Accede con tus credenciales institucionales</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-field" style={{ marginBottom: '28px' }}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest" style={{ marginBottom: '12px' }}>
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '20px' }}>
                    <Mail size={18} className="text-gray-300" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="usuario@fintrack.un"
                    required
                    className="w-full border border-gray-200 rounded-2xl focus:outline-none focus:border-[#19486A]/40 focus:ring-4 focus:ring-[#19486A]/10 text-[#1A1A2E] placeholder:text-gray-300 transition-all"
                    style={{ padding: '18px 20px 18px 56px', fontSize: '15px' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-field" style={{ marginBottom: '28px' }}>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest" style={{ marginBottom: '12px' }}>
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2" style={{ left: '20px' }}>
                    <Lock size={18} className="text-gray-300" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={pass}
                    onChange={(e) => { setPass(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-200 rounded-2xl focus:outline-none focus:border-[#19486A]/40 focus:ring-4 focus:ring-[#19486A]/10 text-[#1A1A2E] placeholder:text-gray-300 transition-all"
                    style={{ padding: '18px 60px 18px 56px', fontSize: '15px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#19486A] transition-colors cursor-pointer rounded-lg hover:bg-gray-50"
                    style={{ right: '16px', padding: '8px' }}
                    aria-label="Mostrar contraseña"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="form-field flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl" style={{ padding: '16px 20px', marginBottom: '28px' }}>
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-xs font-black">!</span>
                  </div>
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="form-field" style={{ marginBottom: '0' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 text-white font-bold rounded-2xl transition-all disabled:opacity-50 cursor-pointer hover:shadow-lg active:scale-[0.98] group"
                  style={{
                    padding: '20px 24px',
                    fontSize: '16px',
                    background: 'linear-gradient(135deg, #19486A 0%, #0f3351 50%, #1a5c3a 100%)',
                    boxShadow: '0 4px 20px rgba(25,72,106,0.35)',
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Ingresar al sistema</span>
                      <ArrowRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* DEMO CREDENTIALS */}
            <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '2px solid #e5e7eb' }}>
              <p style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                Usuarios de prueba
              </p>

              {USERS.map((u) => {
                const Icon = u.icon;
                const isSelected = email === u.email;
                return (
                  <div
                    key={u.email}
                    onClick={() => selectUser(u)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && selectUser(u)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      width: '100%',
                      padding: '14px 18px',
                      marginBottom: '10px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #19486A' : '2px solid #d1d5db',
                      backgroundColor: isSelected ? '#eef4f8' : '#f3f4f6',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? '#19486A' : '#d1d5db',
                      color: isSelected ? '#ffffff' : '#4b5563',
                      flexShrink: 0,
                    }}>
                      <Icon size={18} />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isSelected ? '#19486A' : '#1f2937',
                        marginBottom: '2px',
                      }}>
                        {u.email}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#6b7280',
                      }}>
                        {u.desc}
                      </div>
                    </div>

                    {/* Badge */}
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: isSelected ? '#19486A' : '#9ca3af',
                      color: '#ffffff',
                    }}>
                      {u.rol}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
