import React, { createContext, useContext } from 'react';
import type { Rol } from '../types';
import { useAppStore } from '../store/appStore';

interface AuthCtx {
  puedeCrear: boolean;
  puedeEditar: boolean;
  puedeExportar: boolean;
  puedeEliminar: boolean;
  puedeConfigurar: boolean;
}

const AuthContext = createContext<AuthCtx>({
  puedeCrear: false, puedeEditar: false, puedeExportar: false, puedeEliminar: false, puedeConfigurar: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const rol = useAppStore((s) => s.usuario?.rol) as Rol | undefined;
  const value: AuthCtx = {
    puedeCrear:     rol === 'Administrador' || rol === 'Analista',
    puedeEditar:    rol === 'Administrador' || rol === 'Analista',
    puedeExportar:  rol === 'Administrador' || rol === 'Analista',
    puedeEliminar:  rol === 'Administrador',
    puedeConfigurar: rol === 'Administrador',
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
