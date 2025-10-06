import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { JSX } from "react/jsx-runtime";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se carga el estado desde localStorage, mostramos algo neutro
  if (loading) {
    return <div>Cargando...</div>; // o un spinner, skeleton, etc.
  }

  // Si ya cargó y no está autenticado, redirige
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Si está autenticado, renderiza los hijos
  return children;
}
