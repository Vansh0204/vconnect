import React, { useState } from "react";
import api from "../services/api";

export default function SignupModal({ role, open, onClose, onSuccess, onSwitchToLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organisationName: "",
    description: "",
  });

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res;
      if (role === "volunteer") {
        res = await api.post("/auth/register-volunteer", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
      } else {
        res = await api.post("/auth/register-organisation", {
          organiserName: form.name,
          email: form.email,
          password: form.password,
          organisationName: form.organisationName,
          description: form.description,
        });
      }
      onSuccess && onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="w-[420px] max-w-[90vw] bg-white border border-[#111] shadow-[8px_8px_0_#111] rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="m-0 text-xl font-bold">{role === "volunteer" ? "Register as Volunteer" : "Register as Organisation"}</h3>
          <button onClick={onClose} className="border border-[#111] bg-white px-2.5 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors">Close</button>
        </div>
        {error && <div className="text-[#d22] mb-2.5 font-medium">{error}</div>}
        <form onSubmit={submit}>
          <div className="grid gap-2.5">
            <input placeholder={role === "volunteer" ? "Your name" : "Organiser name"} value={form.name} onChange={set("name")} className="border-2 border-[#111] p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2362ef]" />
            <input placeholder="Email" type="email" value={form.email} onChange={set("email")} className="border-2 border-[#111] p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2362ef]" />
            <input placeholder="Password" type="password" value={form.password} onChange={set("password")} className="border-2 border-[#111] p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2362ef]" />
            {role !== "volunteer" && (
              <>
                <input placeholder="Organisation name" value={form.organisationName} onChange={set("organisationName")} className="border-2 border-[#111] p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2362ef]" />
                <input placeholder="Description" value={form.description} onChange={set("description")} className="border-2 border-[#111] p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2362ef]" />
              </>
            )}
            <button type="submit" disabled={loading} className="border-[3px] border-[#111] shadow-[6px_6px_0_#111] px-4 py-3 rounded-lg cursor-pointer bg-[#2362ef] text-white font-bold hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_#111] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={() => { onClose(); onSwitchToLogin && onSwitchToLogin(); }} className="border-[3px] border-[#111] shadow-[6px_6px_0_#111] px-4 py-3 rounded-lg cursor-pointer bg-white text-[#111] font-bold hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_#111] transition-all">
              Already registered? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
