import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BusinessRules from "./pages/BusinessRules";
import RuleExecutions from "./pages/RuleExecutions";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <>
            <Route
              path="/"
              element={<MainLayout><BusinessRules /></MainLayout>}
            />
            <Route
              path="/business-rules"
              element={<MainLayout><BusinessRules /></MainLayout>}
            />
            <Route
              path="/file-executions"
              element={<MainLayout><RuleExecutions /></MainLayout>}
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
