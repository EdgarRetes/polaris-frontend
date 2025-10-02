import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BusinessRules from "./pages/BusinessRules";
import RuleExecutions from "./pages/RuleExecutions";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

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
      </Routes>
    </Router>
  );
}

export default App;
