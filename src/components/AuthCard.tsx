import React from "react";

const AuthCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      {children}
    </div>
  );
};

export default AuthCard;
