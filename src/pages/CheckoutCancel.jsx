import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations } from "./translations";
import {
    XCircleIcon,
    ShoppingBagIcon,
    ArrowLeftIcon,
    ShieldExclamationIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function CheckoutCancel() {
    const location = useLocation();
    const navigate = useNavigate();
    const { lang = "es" } = location.state || {};
    const t = translations[lang]?.cancel || translations.en.cancel;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes gentleShake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-3deg); }
                    75% { transform: rotate(3deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.3); }
                    50% { box-shadow: 0 0 0 12px rgba(251, 146, 60, 0); }
                }
                .cancel-icon { animation: gentleShake 0.6s ease-in-out 0.3s, fadeUp 0.5s ease-out both; }
                .fade-up-1 { animation: fadeUp 0.5s ease-out 0.2s both; }
                .fade-up-2 { animation: fadeUp 0.5s ease-out 0.4s both; }
                .fade-up-3 { animation: fadeUp 0.5s ease-out 0.6s both; }
                .fade-up-4 { animation: fadeUp 0.5s ease-out 0.8s both; }
                .glass-card {
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.5);
                }
                .pulse-ring { animation: pulseGlow 2s ease-in-out infinite; }
            `}</style>

            <div className="max-w-lg w-full">
                {/* Main Card */}
                <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
                    {/* Decorative bg */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

                    {/* Icon */}
                    <div className="relative mx-auto mb-6 w-24 h-24 cancel-icon">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-200 pulse-ring">
                            <XCircleIcon className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 fade-up-1">
                        {t.title}
                    </h1>
                    <p className="text-gray-500 mb-2 fade-up-1">{t.subtitle}</p>

                    {/* Description */}
                    <p className="text-sm text-gray-500 leading-relaxed mb-8 fade-up-2">
                        {t.msg}
                    </p>

                    {/* Buttons */}
                    <div className="space-y-3 fade-up-3">
                        <button
                            onClick={() => navigate("/cart")}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <ShoppingBagIcon className="h-5 w-5" />
                            {t.back_to_cart}
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-white/80 hover:bg-white text-gray-700 font-semibold py-3.5 px-6 rounded-2xl border border-gray-200 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            {t.back_to_store}
                        </button>
                    </div>

                    {/* Help section */}
                    <div className="mt-8 pt-6 border-t border-gray-200/50 fade-up-4">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            <span className="font-semibold">{t.need_help}</span>
                        </div>
                        <p className="text-xs text-gray-400">{t.help_msg}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 fade-up-4">
                    <p className="text-xs text-gray-400">
                        EXPOMANIA — Tu carrito te espera ⚽
                    </p>
                </div>
            </div>
        </div>
    );
}
