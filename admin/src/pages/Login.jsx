// Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials
    const hardcodedEmail = "iosonokhan@gmail.com";
    const hardcodedPassword = "Frassinago16/b";

    if (email === hardcodedEmail && password === hardcodedPassword) {
      localStorage.setItem("isLoggedIn", true);
      navigate("/");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white rounded-lg shadow-xl w-96 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Welcome Azzi Pizza
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
        )}

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="your@email.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-md font-medium hover:from-blue-600 hover:to-blue-700 transition duration-200 shadow-md cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
