import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { Toast } from '../../types';

const CONFIG = {
  success: { icon: CheckCircle, bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon_c: 'text-green-500' },
  error:   { icon: XCircle,     bg: 'bg-red-50 border-red-200',     text: 'text-red-800',   icon_c: 'text-red-500' },
  warning: { icon: AlertTriangle,bg:'bg-orange-50 border-orange-200',text:'text-orange-800', icon_c:'text-orange-500'},
  info:    { icon: Info,         bg: 'bg-blue-50 border-blue-100',   text: 'text-blue-800',  icon_c: 'text-blue-500' },
};

function ToastItem({ toast }: { toast: Toast }) {
  const removerToast = useAppStore((s) => s.removerToast);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = CONFIG[toast.tipo];
  const Icon = cfg.icon;

  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current, { x: 60, opacity: 0, duration: 0.35, ease: 'back.out(1.4)' });
    const t = gsap.to(ref.current, {
      x: 60, opacity: 0, duration: 0.25, ease: 'power2.in', delay: 3.5,
      onComplete: () => removerToast(toast.id),
    });
    return () => { t.kill(); };
  }, []);

  const dismiss = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 60, opacity: 0, duration: 0.2, onComplete: () => removerToast(toast.id) });
  };

  return (
    <div ref={ref} className={`toast flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-xs ${cfg.bg}`}>
      <Icon size={16} className={cfg.icon_c} />
      <span className={`text-sm font-medium flex-1 ${cfg.text}`}>{toast.mensaje}</span>
      <button onClick={dismiss} className="cursor-pointer opacity-60 hover:opacity-100" aria-label="Cerrar">
        <X size={14} className={cfg.text} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}
