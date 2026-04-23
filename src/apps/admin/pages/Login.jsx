import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      navigate("/admin/orders");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    const hardcodedEmail = "iosonokhan@gmail.com";
    const hardcodedPassword = "Frassinago16/b";

    if (email === hardcodedEmail && password === hardcodedPassword) {
      localStorage.setItem("isLoggedIn", true);
      navigate("/admin/orders");
    } else {
      setError("Invalid email or password.");
    }
  };

  const bgImage = "/admin_login_bg_1774794028116.png";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Decorative Brand Element */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0 flex items-center gap-3">
        <div className="bg-white p-2 rounded-2xl shadow-2xl rotate-3">
          <div className="bg-red-600 text-white h-10 w-10 rounded-xl flex items-center justify-center font-serif font-bold text-2xl">
            A
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold !text-white tracking-widest uppercase">
            Azzipizza
          </h1>
          <p className="text-amber-400 text-xs italic tracking-widest -mt-1">
            Official Kitchen Admin
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <form
          onSubmit={handleLogin}
          className="p-10 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold !text-white mb-2 underline decoration-amber-500/50 underline-offset-8">
              Welcome Back
            </h2>
            <p className="text-gray-300 text-sm">
              Enter your credentials to manage the oven
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-xl mb-6 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-amber-200 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">
                Kitchen Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/10 transition-all font-medium"
                  required
                  placeholder="chef@azzipizza.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-amber-200 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">
                Secret Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white/40 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white/10 transition-all font-medium"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-linear-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-8 flex items-center justify-center gap-2 group"
            >
              Sign Into Dashboard
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Footer Credit */}
        <p className="text-center text-white/40 text-[10px] uppercase tracking-widest mt-8 font-bold">
          © 2024 Azzipizza Kitchen Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
