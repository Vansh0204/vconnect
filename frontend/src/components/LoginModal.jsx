import React, { useState } from "react";
import api from "../services/api";

export default function LoginModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      onSuccess && onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="w-[380px] max-w-[90vw] bg-white border border-[#111] shadow-[8px_8px_0_#111] rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="m-0 text-xl font-bold">Login</h3>
          <button onClick={onClose} className="border border-[#111] bg-white px-2.5 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors">Close</button>
        </div>
        {error && <div className="text-[#d22] mb-2.5 font-medium">{error}</div>}
        <form onSubmit={submit}>
          <div className="grid gap-2.5">
            <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-[#111] p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2362ef]" />
            <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-2 border-[#111] p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2362ef]" />
            <button type="submit" disabled={loading} className="border-[3px] border-[#111] shadow-[6px_6px_0_#111] px-4 py-3 rounded-lg cursor-pointer bg-[#2362ef] text-white font-bold hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_#111] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
