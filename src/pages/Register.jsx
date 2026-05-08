import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [nom, setNom] = useState("");
    const [primerCognom, setPrimerCognom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState("client");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/usuari/registre", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom,
                    primerCognom,
                    email,
                    contrasenya: password,
                    rol,
                }),
            });
            const data = await res.json();

            if (data.status === "success") {
                setSuccess("Registro exitoso. Redirigiendo al login...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(data.message || "Error en el registro");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-[-30%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-purple-600/15 blur-[120px] animate-pulse-glow"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
            </div>

            {/* Left: Decorative panel (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
                <div className="text-center max-w-md">
                    <h2 className="text-5xl font-black gradient-text tracking-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                        EXPOMANIA
                    </h2>
                    <p className="text-xl text-slate-400 leading-relaxed">
                        Join thousands of fans. Get exclusive access to the latest football jerseys.
                    </p>
                    <div className="mt-10 flex justify-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">15K+</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Customers</div>
                        </div>
                        <div className="w-px bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">200+</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Jerseys</div>
                        </div>
                        <div className="w-px bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">50+</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Teams</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Register form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-md">
                    {/* Back to home */}
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
                        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Back to store
                    </Link>

                    <div className="glass-dark rounded-3xl p-8 shadow-2xl shadow-black/30">
                        <div className="text-center mb-6 lg:hidden">
                            <h1 className="text-2xl font-black gradient-text" style={{ fontFamily: 'var(--font-display)' }}>EXPOMANIA</h1>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
                        <p className="text-slate-400 text-sm mb-6">Start your jersey collection today</p>

                        {error && (
                            <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Nombre</label>
                                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="Nico"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Apellido</label>
                                    <input type="text" value={primerCognom} onChange={(e) => setPrimerCognom(e.target.value)} required placeholder="Exposito"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button type="submit" disabled={loading}
                                className="btn-shine w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold text-base shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? "Registrando..." : "Create Account"}
                            </button>
                        </form>
                        <p className="text-center text-sm text-slate-400 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}