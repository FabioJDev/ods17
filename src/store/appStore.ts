import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Fuente, Recurso, Toast, Usuario } from '../types';
import { fuentes as fuentesIniciales } from '../data/fuentes';
import { recursos as recursosIniciales } from '../data/recursos';

interface AppState {
  fuentes: Fuente[];
  recursos: Recurso[];
  usuario: Usuario | null;
  toasts: Toast[];
  agregarFuente: (f: Fuente) => void;
  editarFuente: (f: Fuente) => void;
  agregarRecurso: (r: Recurso) => void;
  setUsuario: (u: Usuario | null) => void;
  agregarToast: (t: Omit<Toast, 'id'>) => void;
  removerToast: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      fuentes: fuentesIniciales,
      recursos: recursosIniciales,
      usuario: null,
      toasts: [],
      agregarFuente: (f) => set((s) => ({ fuentes: [...s.fuentes, f] })),
      editarFuente: (f) => set((s) => ({ fuentes: s.fuentes.map((x) => (x.id === f.id ? f : x)) })),
      agregarRecurso: (r) => set((s) => ({ recursos: [...s.recursos, r] })),
      setUsuario: (u) => set({ usuario: u }),
      agregarToast: (t) => {
        const id = Math.random().toString(36).slice(2);
        set((s) => ({ toasts: [...s.toasts.slice(-2), { ...t, id }] }));
      },
      removerToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    { name: 'fintrack-store', partialize: (s) => ({ usuario: s.usuario }) }
  )
);
