import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAppStore } from './store/appStore';
import Layout from './components/layout/Layout';
import Acceso from './pages/Acceso';
import Dashboard from './pages/Dashboard';
import Fuentes from './pages/Fuentes';
import Recursos from './pages/Recursos';
import Paises from './pages/Paises';
import Reportes from './pages/Reportes';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const usuario = useAppStore((s) => s.usuario);
  return usuario ? <>{children}</> : <Navigate to="/acceso" replace />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const usuario = useAppStore((s) => s.usuario);
  return usuario ? <Navigate to="/" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/acceso" element={<GuestRoute><Acceso /></GuestRoute>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="fuentes" element={<Fuentes />} />
            <Route path="recursos" element={<Recursos />} />
            <Route path="paises" element={<Paises />} />
            <Route path="reportes" element={<Reportes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
