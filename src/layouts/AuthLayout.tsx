// layouts/AuthLayout.tsx
import Header from "../components/Header";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
