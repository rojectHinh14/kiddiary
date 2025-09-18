import { useState } from "react";
import Navbar from "../components/Navbar";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState("login");

  return (
    <div className="min-h-screen bg-[url('/login/kidloggin.jpg')] bg-cover bg-center bg-fixed flex flex-col">
      <Navbar
        onLogin={() => setActiveForm("login")}
        onRegister={() => setActiveForm("register")}
        activeForm={activeForm}
      />

      {/* Wrapper */}
      <div className="flex flex-1 justify-center items-center bg-black/40">
        <div className="relative w-[500px] min-h-[450px] bg-transparent overflow-hidden">
          {/* Login Form with Animation */}
          <div 
            className={`absolute w-full transition-all duration-500 ease-in-out ${
              activeForm === "login" 
                ? "translate-x-0 opacity-100" 
                : "-translate-x-full opacity-0"
            }`}
          >
            <LoginForm onSwitch={() => setActiveForm("register")} />
          </div>
          
          {/* Register Form with Animation */}
          <div 
            className={`absolute w-full transition-all duration-500 ease-in-out ${
              activeForm === "register" 
                ? "translate-x-0 opacity-100" 
                : "translate-x-full opacity-0"
            }`}
          >
            <RegisterForm onSwitch={() => setActiveForm("login")} />
          </div>
        </div>
      </div>
    </div>
  );
}
