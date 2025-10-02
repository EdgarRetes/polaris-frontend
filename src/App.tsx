// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BusinessRules from "./pages/BusinessRules";
import RuleExecutions from "./pages/RuleExecutions";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated } = useAuth(); // added loading

  // Show a simple loading state while checking authentication
  // if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <MainLayout>
                <Routes>
                  <Route path="/" element={<BusinessRules />} />
                  <Route path="/file-executions" element={<RuleExecutions />} />
                  <Route path="/business-rules" element={<BusinessRules />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
