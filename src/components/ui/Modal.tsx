import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP: Record<string, string> = {
  sm: '480px',
  md: '560px',
  lg: '680px',
  xl: '860px',
};

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && overlayRef.current && panelRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(panelRef.current,
        { y: 24, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.3)' },
      );
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleClose = () => {
    if (!panelRef.current || !overlayRef.current) { onClose(); return; }
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { y: 16, opacity: 0, scale: 0.97, duration: 0.18, ease: 'power2.in' })
      .to(overlayRef.current, { opacity: 0, duration: 0.12 }, '-=0.08');
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '20px',
        background: 'rgba(10, 22, 40, 0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        ref={panelRef}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: SIZE_MAP[size],
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 65px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 30px',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#1A1A2E',
            lineHeight: 1.3,
            flex: 1,
            marginRight: '16px',
          }}>
            {title}
          </h2>
          <button
            onClick={handleClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              color: '#9ca3af',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
              flexShrink: 0,
            }}
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 30px 30px',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
