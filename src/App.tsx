import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AuthCard from "./components/AuthCard";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useState } from "react";

import BusinessRules from "./pages/BusinessRules";
import RuleExecutions from "./pages/RuleExecutions";
import UsersPage from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Router>
      <Routes>
        {/* Public auth route */}
        <Route
          path="/auth"
          element={
            <AuthLayout>
              <div className="flex items-center justify-center w-full h-full">
                <AuthCard>
                  {isLogin ? (
                    <LoginForm />
                  ) : (
                    <RegisterForm onSuccess={() => setIsLogin(true)} />
                  )}

                  <p className="mt-6 text-center text-gray-600">
                    {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                    <button
                      className="text-red-600 font-semibold hover:underline"
                      onClick={() => setIsLogin(!isLogin)}
                    >
                      {isLogin ? "Regístrate" : "Inicia sesión"}
                    </button>
                  </p>
                </AuthCard>
              </div>
            </AuthLayout>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BusinessRules />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-rules"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BusinessRules />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/file-executions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RuleExecutions />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AuditLogs />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;