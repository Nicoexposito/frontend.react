import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { translations } from "./translations";
import {
    ShoppingBagIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    CreditCardIcon,
    LockClosedIcon,
    UserIcon,
    TruckIcon,
    CheckIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

// Inicializar Stripe con la clave pública del usuario (Placeholder)
const stripePromise = loadStripe("pk_test_aqui_la_teva_clau_publica");

const COUNTRIES = [
    "España", "Andorra", "Francia", "Alemania", "Italia", "Portugal",
    "Reino Unido", "Países Bajos", "Bélgica", "Suiza", "Austria",
    "Estados Unidos", "Canadá", "México", "Argentina", "Brasil",
    "Australia", "Japón",
];

// Stepper component
function CheckoutStepper({ currentStep, t }) {
    const steps = [
        { id: 1, name: t.step_cart, icon: ShoppingBagIcon },
        { id: 2, name: t.step_shipping, icon: TruckIcon },
        { id: 3, name: t.step_payment, icon: CreditCardIcon },
    ];

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div className="flex items-center justify-between relative">
                {/* Progress line behind */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-10"></div>
                <div
                    className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 mx-10 transition-all duration-700 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * (100 - 12)}%` }}
                ></div>

                {steps.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200"
                                    : isCurrent
                                        ? "bg-white border-2 border-indigo-600 shadow-lg shadow-indigo-100"
                                        : "bg-white border-2 border-gray-200"
                                    }`}
                            >
                                {isCompleted ? (
                                    <CheckIcon className="h-5 w-5 text-white" />
                                ) : (
                                    <Icon className={`h-5 w-5 ${isCurrent ? "text-indigo-600" : "text-gray-400"}`} />
                                )}
                            </div>
                            <span
                                className={`mt-2 text-xs font-semibold transition-colors duration-300 ${isCompleted || isCurrent ? "text-indigo-600" : "text-gray-400"
                                    }`}
                            >
                                {step.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

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

    // Form state (Solo datos personales y dirección, la tarjeta la gestiona Stripe)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Current step for stepper
    const [currentStep, setCurrentStep] = useState(2);

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

    // Track steps based on form interaction
    useEffect(() => {
        if (street || city || postalCode || country) {
            setCurrentStep(2);
        }
    }, [street, city, postalCode, country]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            if (token && user) {
                // 1. Crear el pedido (venta) en el backend con estado "pendent"
                const ventaItems = cartItems.map(item => ({
                    productId: item._id,
                    quantitat: item.quantity || 1,
                    talla: item.talla || "M",
                }));

                const resComanda = await fetch("http://localhost:3000/api/ventas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        items: ventaItems,
                        metodePagament: "targeta",
                        adreca: {
                            carrer: street,
                            ciutat: city,
                            codiPostal: postalCode,
                            pais: country,
                        },
                    }),
                });

                const dataComanda = await resComanda.json();

                if (!resComanda.ok) {
                    alert(dataComanda.message || "Error al crear la comanda");
                    setIsSubmitting(false);
                    return;
                }

                // 2. Crear sesión de Stripe en el servidor
                const resStripe = await fetch("http://localhost:3000/api/checkout/create-session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        comandaId: dataComanda.data._id,
                    }),
                });

                const dataStripe = await resStripe.json();

                if (!resStripe.ok) {
                    alert(dataStripe.message || "Error al crear la sesión de pago");
                    setIsSubmitting(false);
                    return;
                }

                // Limpiar carrito antes de redirigir (opcional, pero recomendado)
                const sessionId = localStorage.getItem("cartSessionId");
                if (sessionId) {
                    await fetch(`http://localhost:3000/api/cart/${sessionId}`, {
                        method: "DELETE",
                    }).catch(() => { });
                }

                // 3. Redirigir a la pasarela segura de Stripe (Método moderno)
                if (dataStripe.url) {
                    window.location.href = dataStripe.url;
                } else {
                    const stripe = await stripePromise;
                    const { error } = await stripe.redirectToCheckout({
                        sessionId: dataStripe.sessionId
                    });

                    if (error) {
                        console.error("Stripe redirect error:", error);
                        alert("Error al redirigir a Stripe. Por favor, inténtalo de nuevo.");
                    }
                }

            } else {
                // Sin login → simulación local
                await new Promise(resolve => setTimeout(resolve, 1500));
                navigate("/checkout/success", {
                    state: {
                        orderId: "GUEST-" + Date.now().toString(36).toUpperCase(),
                        total: total,
                        itemCount: cartItems.length,
                        lang,
                    }
                });
            }
        } catch (err) {
            console.error("Error en checkout:", err);
            alert(`Error: ${err.message || "Error de conexión"}. Por favor, revisa la consola para más detalles.`);
        }

        setIsSubmitting(false);
    };

    const handleCancel = () => {
        navigate("/checkout/cancel", { state: { lang } });
    };

    // ========== EMPTY CART ==========
    if (cartItems.length === 0) {
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/cart")}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">{t.back_to_cart}</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
                    <button
                        onClick={handleCancel}
                        className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors duration-200"
                    >
                        {t.cancel_order}
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stepper */}
                <CheckoutStepper currentStep={currentStep} t={t} />

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
                                            placeholder="Nico Exposito"
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
                                            placeholder="nicoexposito@example.com"
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

                            {/* PAYMENT METHOD BANNERS */}
                            <div className="section-card checkout-fade-in-delay-2 p-8 border-dashed border-2 border-indigo-200 bg-indigo-50/30">
                                <div className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                        <ShieldCheckIcon className="h-10 w-10 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Pago 100% Seguro</h3>
                                    <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                                        Al hacer clic en el botón, serás redirigido a la pasarela de pago segura de Stripe para completar tu compra.
                                    </p>
                                    <div className="flex justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6" alt="PayPal" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_logo%2C_revised_2016.svg" className="h-6" alt="Stripe" />
                                    </div>
                                </div>
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

                                    {/* SUBMIT BUTTON */}
                                    <div className="mt-6">
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
                                        <ShieldCheckIcon className="h-3.5 w-3.5 text-indigo-400" />
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
