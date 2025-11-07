import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { connect } from "react-redux";
import { loginUserService } from "../services/userService";
import { userLoginSuccess, userLoginFail } from "../store/actions/userActions";

function LoginForm({
  onSwitch,
  onLoginSuccess,
  userLoginSuccess,
  userLoginFail,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await loginUserService({ email, password });

      if (res.data.errCode === 0) {
        const userInfo = res.data.user;
        userLoginSuccess(userInfo);
        console.log("User data:", userInfo);
        onLoginSuccess?.();
      } else {
        setError(res.data.errMessage || "Sai email hoặc mật khẩu");
        userLoginFail();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error hoặc kết nối thất bại!");
      userLoginFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center text-white">
        <span>
          Don't have an account?{" "}
          <button className="font-medium underline" onClick={onSwitch}>
            Sign Up
          </button>
        </span>
        <h2 className="text-3xl mt-3">Login</h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-full pl-12 bg-white/20 text-white placeholder-white outline-none"
          />
          <FiUser className="absolute left-4 top-3 text-white text-xl" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-full pl-12 bg-white/20 text-white placeholder-white outline-none"
          />
          <FiLock className="absolute left-4 top-3 text-white text-xl" />
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-12 rounded-full bg-white/70 hover:bg-white/50 text-black font-medium transition-all"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      <div className="flex justify-between text-sm text-white mt-4">
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="mr-2" /> Remember Me
        </label>
        <a href="#" className="hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-6 mb-4">
        <div className="flex-1 h-px bg-white/30"></div>
        <span className="text-white/70 text-sm">Or continue with</span>
        <div className="flex-1 h-px bg-white/30"></div>
      </div>

      {/* Social Login Buttons */}
      <div className="flex gap-3">
        <a
          href="http://localhost:8080/auth/google"
          className="flex-1 h-12 rounded-lg bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center gap-2 font-medium transition-all shadow-md hover:shadow-lg"
        >
          <FaGoogle className="text-xl text-red-500" />
          <span className="hidden sm:inline">Google</span>
        </a>

        <a
          href="http://localhost:8080/auth/facebook"
          className="flex-1 h-12 rounded-lg bg-[#1877F2] hover:bg-[#0d66d9] text-white flex items-center justify-center gap-2 font-medium transition-all shadow-md hover:shadow-lg"
        >
          <FaFacebookF className="text-xl" />
          <span className="hidden sm:inline">Facebook</span>
        </a>

        <a
          href="http://localhost:8080/auth/github"
          className="flex-1 h-12 rounded-lg bg-[#24292e] hover:bg-[#1a1e22] text-white flex items-center justify-center gap-2 font-medium transition-all shadow-md hover:shadow-lg"
        >
          <FaGithub className="text-xl" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn,
  userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  userLoginSuccess: (userInfo) => dispatch(userLoginSuccess(userInfo)),
  userLoginFail: () => dispatch(userLoginFail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
