import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:3000/api/usuari/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, contrasenya: password }),
            });
            const data = await res.json();
            if (data.status === "success") {
                // Guardar datos del usuario en localStorage
                localStorage.setItem("loggedUser", JSON.stringify(data.data.usuari));
                localStorage.setItem("token", data.data.token);
                navigate("/");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Connection error");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-[-30%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-600/15 blur-[120px] animate-pulse-glow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-600/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                {/* Back to home */}
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
                    <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to store
                </Link>

                {/* Card */}
                <div className="glass-dark rounded-3xl p-8 shadow-2xl shadow-black/30">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black gradient-text tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>EXPOMANIA</h1>
                        <p className="text-slate-400 text-sm mt-2">Welcome back</p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-shine w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold text-base shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-400 mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}