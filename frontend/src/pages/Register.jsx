import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join MyTube today"
    >
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-5">
        {["name", "email"].map((field) => (
          <input
            key={field}
            type={field === "email" ? "email" : "text"}
            placeholder={field.toUpperCase()}
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
            required
          />
        ))}

        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="PASSWORD"
            className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400"
          >
            {show ? "HIDE" : "SHOW"}
          </button>
        </div>

        <input
          type={show ? "text" : "password"}
          placeholder="CONFIRM PASSWORD"
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none"
          value={form.confirm}
          onChange={(e) =>
            setForm({ ...form, confirm: e.target.value })
          }
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-red-500 hover:underline cursor-pointer"
        >
          Sign in
        </span>
      </p>
    </AuthLayout>
  );
};

export default Register;
