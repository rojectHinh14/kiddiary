import { useState } from "react";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { registerUserService } from "../services/userService";

export default function RegisterForm({ onSwitch }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await registerUserService(formData);
      if (res.data.errCode === 0) {
        setMessage("Register successful!");
        setFormData({ firstName: "", lastName: "", email: "", password: "" }); // Clear form
        onSwitch();
      } else {
        setMessage("Error: " + res.data.errMessage);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error or connection failed");
    }
  };

  return (
    <div className="w-full">
      <div className="text-center text-white">
        <span>
          Have an account?{" "}
          <button className="font-medium underline" onClick={onSwitch}>
            Login
          </button>
        </span>
        <h2 className="text-3xl mt-3">Sign Up</h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              name="firstName"
              placeholder="Firstname"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full h-12 rounded-full pl-12 bg-white/20 text-white placeholder-white outline-none"
            />
            <FiUser className="absolute left-4 top-3 text-white text-xl" />
          </div>
          <div className="relative flex-1">
            <input
              type="text"
              name="lastName"
              placeholder="Lastname"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full h-12 rounded-full pl-12 bg-white/20 text-white placeholder-white outline-none"
            />
            <FiUser className="absolute left-4 top-3 text-white text-xl" />
          </div>
        </div>
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 rounded-full pl-12 bg-white/20 text-white placeholder-white outline-none"
          />
          <FiMail className="absolute left-4 top-3 text-white text-xl" />
        </div>
        <div className="relative">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-12 rounded-full pl-12 bg-white/20 text-white placeholder-white outline-none"
          />
          <FiLock className="absolute left-4 top-3 text-white text-xl" />
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-full bg-white/70 hover:bg-white/50 text-black font-medium"
        >
          Register
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-white mt-3">{message}</p>
      )}

      <div className="flex justify-between text-sm text-white mt-4">
        <label>
          <input type="checkbox" className="mr-2" /> Remember Me
        </label>
        <a href="#" className="hover:underline">
          Terms & Conditions
        </a>
      </div>
    </div>
  );
}
