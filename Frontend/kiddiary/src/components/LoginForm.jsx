import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
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
        const token = res.data.token;

        if (token) {
          localStorage.setItem("token", token);
        }

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
          className="w-full h-12 rounded-full bg-white/70 hover:bg-white/50 text-black font-medium"
        >
          {loading ? "Signing in..." : "Sign In"}
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

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn,
  userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  userLoginSuccess: (userInfo) => dispatch(userLoginSuccess(userInfo)),
  userLoginFail: () => dispatch(userLoginFail()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
