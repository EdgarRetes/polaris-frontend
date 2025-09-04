// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// import Home from "./pages/Home";
import BusinessRules from "./pages/BusinessRules";
// import Companies from "./pages/Companies";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<BusinessRules />} />
          <Route path="/business-rules" element={<BusinessRules />} />
          {/* <Route path="/companies" element={<Companies />} /> */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
