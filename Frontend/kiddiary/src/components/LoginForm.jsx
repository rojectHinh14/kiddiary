import { FiUser, FiLock } from 'react-icons/fi'

export default function LoginForm({ onSwitch }) {
    return (
      <div className="w-full">
        <div className="text-center text-white">
          <span>
            Don't have an account?{" "}
            <button
              className="font-medium underline"
              onClick={onSwitch}
            >
              Sign Up
            </button>
          </span>
          <h2 className="text-3xl mt-3">Login</h2>
        </div>
  
        <div className="mt-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username or Email"
              className="w-full h-12 rounded-full pl-12 bg-white/20 text-white placeholder-white outline-none"
            />
            <FiUser className="absolute left-4 top-3 text-white text-xl" />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full h-12 rounded-full pl-12 bg-white/20 text-white placeholder-white outline-none"
            />
            <FiLock className="absolute left-4 top-3 text-white text-xl" />
          </div>
          <button className="w-full h-12 rounded-full bg-white/70 hover:bg-white/50 text-black font-medium">
            Sign In
          </button>
        </div>
  
        <div className="flex justify-between text-sm text-white mt-4">
          <label>
            <input type="checkbox" className="mr-2" /> Remember Me
          </label>
          <a href="#" className="hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    );
  }
  