import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations } from "./translations";
import {
    CheckCircleIcon,
    ShoppingBagIcon,
    TruckIcon,
    EnvelopeIcon,
    CubeIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

// Mini confetti particles
function Confetti() {
    const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c084fc", "#e879f9", "#f472b6", "#fb923c", "#facc15", "#34d399"];
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        size: 4 + Math.random() * 8,
        rotation: Math.random() * 360,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(-20vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: "absolute",
                        left: `${p.left}%`,
                        top: "-5%",
                        width: `${p.size}px`,
                        height: `${p.size * 0.6}px`,
                        backgroundColor: p.color,
                        borderRadius: "2px",
                        animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
}

export default function CheckoutSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const urlOrderId = queryParams.get("orderId");
    
    // Prioridad: 1. State de navegación, 2. Params de la URL
    const [orderId, setOrderId] = useState(location.state?.orderId || urlOrderId);
    const [total, setTotal] = useState(location.state?.total || 0);
    const [lang, setLang] = useState(location.state?.lang || "es");
    
    const t = translations[lang]?.success || translations.en.success;

    const [showConfetti, setShowConfetti] = useState(true);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        // Si venimos de Stripe (sin total en state), podríamos recuperar la comanda del backend
        if (!total && orderId) {
            fetch(`http://localhost:3000/api/ventas/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(res => res.json())
            .then(resData => {
                if (resData.status === 'success') {
                    setTotal(resData.data.total);
                    // Si el pedido es del usuario, podemos confiar en su idioma guardado o preferido
                }
            })
            .catch(err => console.error("Error recuperando pedido:", err));
        }

        // Trigger entrance animation
        requestAnimationFrame(() => setAnimateIn(true));
        // Stop confetti after some time
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, [orderId, total]);

    const orderNumber = orderId || ("ORD-" + Date.now().toString(36).toUpperCase());

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
            {showConfetti && <Confetti />}

            <style>{`
                @keyframes checkScale {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes ripple {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                .check-enter { animation: checkScale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both; }
                .fade-up-1 { animation: fadeUp 0.5s ease-out 0.6s both; }
                .fade-up-2 { animation: fadeUp 0.5s ease-out 0.8s both; }
                .fade-up-3 { animation: fadeUp 0.5s ease-out 1s both; }
                .fade-up-4 { animation: fadeUp 0.5s ease-out 1.2s both; }
                .fade-up-5 { animation: fadeUp 0.5s ease-out 1.4s both; }
                .ripple-ring {
                    animation: ripple 2s ease-out infinite;
                }
                .glass-card {
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.5);
                }
            `}</style>

            <div className="max-w-lg w-full">
                {/* Main Card */}
                <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
                    {/* Decorative background circles */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

                    {/* Check icon with ripple */}
                    <div className="relative mx-auto mb-6 w-28 h-28">
                        <div className="absolute inset-0 bg-emerald-400/20 rounded-full ripple-ring"></div>
                        <div className="absolute inset-2 bg-emerald-400/10 rounded-full ripple-ring" style={{ animationDelay: "0.5s" }}></div>
                        <div className="check-enter relative z-10 w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200">
                            <CheckCircleIcon className="h-14 w-14 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 fade-up-1">
                        {t.title}
                    </h1>
                    <p className="text-gray-500 mb-6 fade-up-1">{t.subtitle}</p>

                    {/* Order info cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6 fade-up-2">
                        <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                            <p className="text-xs text-gray-500 mb-1">{t.order_number}</p>
                            <p className="text-sm font-bold text-indigo-600 truncate">{orderNumber.slice(-10)}</p>
                        </div>
                        <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                            <p className="text-xs text-gray-500 mb-1">{t.estimated_delivery}</p>
                            <p className="text-sm font-bold text-gray-900">{t.delivery_time}</p>
                        </div>
                    </div>

                    {/* Total */}
                    {total && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6 border border-indigo-100 fade-up-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total</span>
                                <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {total.toFixed(2)}€
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 fade-up-3">
                        {t.msg}
                    </p>

                    {/* What happens next */}
                    <div className="text-left mb-8 fade-up-3">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">{t.what_next}</h3>
                        <div className="space-y-3">
                            {[
                                { icon: EnvelopeIcon, text: t.step1, color: "text-indigo-500", bg: "bg-indigo-50" },
                                { icon: CubeIcon, text: t.step2, color: "text-purple-500", bg: "bg-purple-50" },
                                { icon: MapPinIcon, text: t.step3, color: "text-emerald-500", bg: "bg-emerald-50" },
                            ].map((step, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className={`${step.bg} p-2 rounded-lg shrink-0`}>
                                        <step.icon className={`h-4 w-4 ${step.color}`} />
                                    </div>
                                    <span className="text-sm text-gray-600">{step.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 fade-up-4">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <ShoppingBagIcon className="h-5 w-5" />
                            {t.continue_shopping}
                        </button>
                    </div>
                </div>

                {/* Footer badge */}
                <div className="text-center mt-6 fade-up-5">
                    <p className="text-xs text-gray-400">
                        EXPOMANIA — Gracias por confiar en nosotros ⚽
                    </p>
                </div>
            </div>
        </div>
    );
}
