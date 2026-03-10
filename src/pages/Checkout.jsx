import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations } from "./translations";
import {
    ShoppingBagIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    CreditCardIcon,
    LockClosedIcon,
    UserIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";

const COUNTRIES = [
    "España", "Andorra", "Francia", "Alemania", "Italia", "Portugal",
    "Reino Unido", "Países Bajos", "Bélgica", "Suiza", "Austria",
    "Estados Unidos", "Canadá", "México", "Argentina", "Brasil",
    "Australia", "Japón",
];

// SVG logos de tarjetas
const CardLogos = {
    visa: (
        <svg viewBox="0 0 48 32" className="h-8 w-12">
            <rect width="48" height="32" rx="4" fill="#1A1F71" />
            <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">VISA</text>
        </svg>
    ),
    mastercard: (
        <svg viewBox="0 0 48 32" className="h-8 w-12">
            <rect width="48" height="32" rx="4" fill="#2D2D2D" />
            <circle cx="19" cy="16" r="8" fill="#EB001B" opacity="0.9" />
            <circle cx="29" cy="16" r="8" fill="#F79E1B" opacity="0.9" />
            <circle cx="24" cy="16" r="5" fill="#FF5F00" opacity="0.8" />
        </svg>
    ),
    amex: (
        <svg viewBox="0 0 48 32" className="h-8 w-12">
            <rect width="48" height="32" rx="4" fill="#2E77BB" />
            <text x="24" y="20" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">AMEX</text>
        </svg>
    ),
};

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems = [], lang = "en" } = location.state || {};
    const t = translations[lang]?.checkout || translations.en.checkout;

    // Detectar usuario logueado
    const [user, setUser] = useState(null);
    useEffect(() => {
        const stored = localStorage.getItem("loggedUser");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                /* ignore */
            }
        }
    }, []);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [cardType, setCardType] = useState("visa");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardholder, setCardholder] = useState("");

    // Success state
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill when user detected
    useEffect(() => {
        if (user) {
            setFullName(user.nom || "");
            setEmail(user.email || "");
        }
    }, [user]);

    // Helpers
    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return parseFloat(String(priceStr).replace("€", "").replace(",", ".")) || 0;
    };

    const subtotal = cartItems.reduce((sum, item) => {
        return sum + parsePrice(item.price) * (item.quantity || 1);
    }, 0);

    const tax = subtotal * 0.21;
    const total = subtotal + tax;

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\D/g, "").substring(0, 16);
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(" ");
    };

    // Format expiry as MM/YY
    const formatExpiry = (value) => {
        const v = value.replace(/\D/g, "").substring(0, 4);
        if (v.length > 2) return v.substring(0, 2) + "/" + v.substring(2);
        return v;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setOrderPlaced(true);
        }, 1500);
    };

    // ========== EMPTY CART ==========
    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="text-center bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl max-w-md border border-white/40">
                    <ShoppingBagIcon className="h-20 w-20 text-indigo-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.empty_cart}</h2>
                    <p className="text-gray-500 mb-8">{t.empty_cart_msg}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        {t.go_shopping}
                    </button>
                </div>
            </div>
        );
    }

    // ========== ORDER SUCCESS ==========
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="text-center bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-2xl max-w-md border border-white/40 animate-[fadeInUp_0.6s_ease-out]">
                    <div className="relative mx-auto mb-6 w-24 h-24">
                        <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                        <CheckCircleIcon className="h-24 w-24 text-emerald-500 relative z-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.order_success}</h2>
                    <p className="text-gray-500 mb-8">{t.order_success_msg}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                        {t.continue_shopping}
                    </button>
                </div>
            </div>
        );
    }

    // ========== MAIN CHECKOUT ==========
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Inline animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .checkout-fade-in { animation: fadeInUp 0.5s ease-out both; }
                .checkout-fade-in-delay { animation: fadeInUp 0.5s ease-out 0.15s both; }
                .checkout-fade-in-delay-2 { animation: fadeInUp 0.5s ease-out 0.3s both; }
                .input-field {
                    width: 100%;
                    padding: 0.7rem 1rem;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 0.75rem;
                    font-size: 0.95rem;
                    transition: all 0.25s ease;
                    background: rgba(255,255,255,0.8);
                    backdrop-filter: blur(4px);
                    outline: none;
                }
                .input-field:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
                }
                .input-field:disabled {
                    background: #f1f5f9;
                    color: #64748b;
                    cursor: not-allowed;
                }
                .input-field::placeholder {
                    color: #94a3b8;
                }
                .section-card {
                    background: rgba(255,255,255,0.65);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.5);
                    border-radius: 1.25rem;
                    padding: 1.75rem;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    transition: box-shadow 0.3s ease;
                }
                .section-card:hover {
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                }
            `}</style>

            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">{t.back}</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit}>
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* ========== LEFT: FORM ========== */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* PERSONAL INFO */}
                            <div className="section-card checkout-fade-in">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="bg-indigo-100 p-2 rounded-xl">
                                        <UserIcon className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">{t.personal_info}</h2>
                                </div>

                                {user && (
                                    <div className="mb-4 flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 text-sm text-indigo-700">
                                        <CheckCircleIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                                        <span>{t.logged_in_note} <strong>{user.nom || user.email}</strong></span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.full_name}</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            disabled={!!user}
                                            required
                                            placeholder="John Doe"
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.email}</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={!!user}
                                            required
                                            placeholder="john@example.com"
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.phone}</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+34 612 345 678"
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SHIPPING ADDRESS */}
                            <div className="section-card checkout-fade-in-delay">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="bg-purple-100 p-2 rounded-xl">
                                        <TruckIcon className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">{t.shipping_address}</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.street}</label>
                                        <input
                                            type="text"
                                            value={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                            required
                                            placeholder="Calle Mayor 15, 2ºB"
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.city}</label>
                                            <input
                                                type="text"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required
                                                placeholder="Madrid"
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.postal_code}</label>
                                            <input
                                                type="text"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                required
                                                placeholder="28001"
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.country}</label>
                                            <select
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                required
                                                className="input-field"
                                            >
                                                <option value="">{t.select_country}</option>
                                                {COUNTRIES.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PAYMENT METHOD */}
                            <div className="section-card checkout-fade-in-delay-2">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="bg-amber-100 p-2 rounded-xl">
                                        <CreditCardIcon className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">{t.payment_method}</h2>
                                </div>

                                {/* Card type selector */}
                                <div className="mb-5">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t.card_type}</label>
                                    <div className="flex gap-3">
                                        {["visa", "mastercard", "amex"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setCardType(type)}
                                                className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${cardType === type
                                                    ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100 ring-2 ring-indigo-200"
                                                    : "border-gray-200 bg-white hover:border-gray-300"
                                                    }`}
                                            >
                                                {CardLogos[type]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.cardholder}</label>
                                        <input
                                            type="text"
                                            value={cardholder}
                                            onChange={(e) => setCardholder(e.target.value)}
                                            required
                                            placeholder="JOHN DOE"
                                            className="input-field uppercase"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.card_number}</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                required
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                className="input-field pr-14"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
                                                {CardLogos[cardType]}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.expiry}</label>
                                            <input
                                                type="text"
                                                value={expiry}
                                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                                required
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.cvv}</label>
                                            <input
                                                type="text"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                                                required
                                                placeholder="•••"
                                                maxLength={4}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT — MOBILE */}
                            <div className="lg:hidden">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            {t.processing}
                                        </>
                                    ) : (
                                        <>
                                            <LockClosedIcon className="h-5 w-5" />
                                            {t.confirm_order} — {total.toFixed(2)}€
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ========== RIGHT: ORDER SUMMARY ========== */}
                        <div className="lg:col-span-5 mt-8 lg:mt-0">
                            <div className="lg:sticky lg:top-24">
                                <div className="section-card checkout-fade-in">
                                    <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                        <ShoppingBagIcon className="h-5 w-5 text-indigo-500" />
                                        {t.order_summary}
                                    </h2>

                                    {/* Product list */}
                                    <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 mb-5" style={{ scrollbarWidth: "thin", scrollbarColor: "#c7c7c7 transparent" }}>
                                        {cartItems.map((item, idx) => (
                                            <div key={item._id || item.id || idx} className="flex gap-4 items-center">
                                                <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                                    <img
                                                        src={item.imageSrc}
                                                        alt={item.imageAlt || "Product"}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {typeof item.name === "object" ? item.name[lang] : item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {typeof item.color === "object" ? item.color[lang] : item.color}
                                                    </p>
                                                    <p className="text-xs text-gray-400">x{item.quantity || 1}</p>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 shrink-0">
                                                    {(parsePrice(item.price) * (item.quantity || 1)).toFixed(2)}€
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200 my-4" />

                                    {/* Totals */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>{t.subtotal}</span>
                                            <span>{subtotal.toFixed(2)}€</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>{t.shipping}</span>
                                            <span className="text-emerald-600 font-medium">{t.free}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>{t.tax}</span>
                                            <span>{tax.toFixed(2)}€</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                                <span>{t.total}</span>
                                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                    {total.toFixed(2)}€
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SUBMIT — DESKTOP */}
                                    <div className="hidden lg:block mt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    {t.processing}
                                                </>
                                            ) : (
                                                <>
                                                    <LockClosedIcon className="h-5 w-5" />
                                                    {t.confirm_order}
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Security badges */}
                                    <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <LockClosedIcon className="h-3.5 w-3.5" />
                                            {t.ssl_encrypted}
                                        </span>
                                        <span>•</span>
                                        <span>{t.pci_compliant}</span>
                                        <span>•</span>
                                        <span>{t.secure_payment}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
