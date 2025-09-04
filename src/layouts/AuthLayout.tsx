import Header from "../components/Header";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default AuthLayout;
