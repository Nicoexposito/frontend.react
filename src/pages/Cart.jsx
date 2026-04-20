import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { translations } from "./translations";
import {
    ShoppingBagIcon,
    ArrowLeftIcon,
    TrashIcon,
    PlusIcon,
    MinusIcon,
    TruckIcon,
    LockClosedIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems: initialItems = [], lang = "en" } = location.state || {};
    const [cartItems, setCartItems] = useState(initialItems);
    const [removingId, setRemovingId] = useState(null);

    const t = translations[lang]?.cartPage || translations.en.cartPage;

    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return parseFloat(String(priceStr).replace("€", "").replace(",", ".")) || 0;
    };

    const updateQuantity = (product, newQty) => {
        if (newQty < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                ((item._id && item._id === product._id) || (item.id !== undefined && item.id === product.id))
                    ? { ...item, quantity: newQty }
                    : item
            )
        );
    };

    const removeFromCart = (product) => {
        const productId = product._id || product.id;
        setRemovingId(productId);
        setTimeout(() => {
            setCartItems(prev => prev.filter(item => {
                const itemId = item._id || item.id;
                return itemId !== productId;
            }));
            setRemovingId(null);
        }, 300);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * (item.quantity || 1), 0);
    const tax = subtotal * 0.21;
    const total = subtotal + tax;
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    // ========== EMPTY CART ==========
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <style>{`
                    @keyframes floatUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes gentleBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                `}</style>

                {/* Header */}
                <div className="bg-white/70 backdrop-blur-xl border-b border-white/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">{t.back_to_store}</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center min-h-[calc(100vh-72px)] p-4">
                    <div className="text-center max-w-md" style={{ animation: "floatUp 0.6s ease-out" }}>
                        <div className="relative mx-auto mb-8 w-32 h-32">
                            <div className="absolute inset-0 bg-indigo-200/30 rounded-full blur-xl"></div>
                            <ShoppingBagIcon
                                className="h-32 w-32 text-indigo-300 relative z-10"
                                style={{ animation: "gentleBounce 3s ease-in-out infinite" }}
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.empty_title}</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">{t.empty_msg}</p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-[0.98] text-lg"
                        >
                            {t.go_shopping}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========== CART WITH ITEMS ==========
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideOut { to { opacity: 0; transform: translateX(40px) scale(0.95); } }
                .cart-item { animation: fadeInUp 0.4s ease-out both; }
                .cart-item-removing { animation: slideOut 0.3s ease-in forwards; }
                .cart-summary { animation: fadeInUp 0.5s ease-out 0.15s both; }
                .glass-card {
                    background: rgba(255,255,255,0.65);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255,255,255,0.5);
                    border-radius: 1.25rem;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
                    transition: box-shadow 0.3s ease;
                }
                .glass-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
                .qty-btn {
                    display: flex; align-items: center; justify-content: center;
                    width: 2rem; height: 2rem; border-radius: 0.5rem;
                    border: 1.5px solid #e2e8f0; background: white;
                    color: #475569; cursor: pointer;
                    transition: all 0.2s ease;
                }
                .qty-btn:hover { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
                .qty-btn:active { transform: scale(0.92); }
            `}</style>

            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">{t.back_to_store}</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBagIcon className="h-6 w-6 text-indigo-500" />
                        {t.title}
                        <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-2.5 py-0.5 rounded-full ml-1">
                            {itemCount}
                        </span>
                    </h1>
                    <div className="w-24"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* ========== LEFT: CART ITEMS ========== */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                        {cartItems.map((item, idx) => {
                            const productId = item._id || item.id;
                            return (
                                <div
                                    key={productId || idx}
                                    className={`glass-card p-5 cart-item ${removingId === productId ? 'cart-item-removing' : ''}`}
                                    style={{ animationDelay: `${idx * 0.08}s` }}
                                >
                                    <div className="flex gap-4 sm:gap-6">
                                        {/* Image */}
                                        <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 group">
                                            <img
                                                src={item.imageSrc}
                                                alt={item.imageAlt || "Product"}
                                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                                    {typeof item.name === "object" ? item.name[lang] : item.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {typeof item.color === "object" ? item.color[lang] : item.color}
                                                </p>
                                                {item.talla && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {t.size}: <span className="font-semibold text-gray-600">{item.talla}</span>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                {/* Quantity controls */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                                                        disabled={(item.quantity || 1) <= 1}
                                                        style={{ opacity: (item.quantity || 1) <= 1 ? 0.4 : 1 }}
                                                    >
                                                        <MinusIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-gray-900 text-sm">
                                                        {item.quantity || 1}
                                                    </span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}
                                                    >
                                                        <PlusIcon className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                {/* Price */}
                                                <p className="text-lg font-bold text-gray-900">
                                                    {(parsePrice(item.price) * (item.quantity || 1)).toFixed(2)}€
                                                </p>
                                            </div>
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeFromCart(item)}
                                            className="self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            title={t.remove}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Continue Shopping Link */}
                        <div className="text-center pt-4">
                            <button
                                onClick={() => navigate("/")}
                                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors inline-flex items-center gap-2"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                {t.continue_shopping}
                            </button>
                        </div>
                    </div>

                    {/* ========== RIGHT: ORDER SUMMARY ========== */}
                    <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
                        <div className="lg:sticky lg:top-24">
                            <div className="glass-card p-6 cart-summary">
                                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <ShoppingBagIcon className="h-5 w-5 text-indigo-500" />
                                    {t.order_summary}
                                </h2>

                                {/* Items count */}
                                <div className="flex justify-between text-sm text-gray-600 mb-4">
                                    <span>{itemCount} {t.items_count}</span>
                                    <span>{subtotal.toFixed(2)}€</span>
                                </div>

                                <div className="border-t border-gray-200 my-4"></div>

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

                                {/* Free shipping badge */}
                                <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-sm text-emerald-700">
                                    <TruckIcon className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <span className="font-medium">{t.free_shipping_note}</span>
                                </div>

                                {/* Checkout button */}
                                <button
                                    onClick={() => navigate("/checkout", { state: { cartItems, lang } })}
                                    className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <LockClosedIcon className="h-5 w-5" />
                                    {t.continue_checkout}
                                </button>

                                {/* Security badges */}
                                <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <LockClosedIcon className="h-3.5 w-3.5" />
                                        SSL
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <ShieldCheckIcon className="h-3.5 w-3.5" />
                                        {t.secure_checkout}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
