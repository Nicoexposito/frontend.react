import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowUpRightIcon, EnvelopeIcon, ShieldCheckIcon, ShoppingBagIcon, SparklesIcon, TruckIcon, UserIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { products } from "./Products";
import { translations } from "./translations";
import { Fragment } from "react";

const API_URL = "http://localhost:3000/api";

// Generar o recuperar sessionId único
const getSessionId = () => {
  let sessionId = localStorage.getItem("cartSessionId");
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("cartSessionId", sessionId);
  }
  return sessionId;
};


const navigation = [
  { href: "home", label: { en: "Home", es: "Inicio" } },
  { href: "products", label: { en: "Products", es: "Productos" } },
  { href: "retros", label: { en: "Retros", es: "Retros" } },
  { href: "about-contact", label: { en: "About us / Contact", es: "Sobre nosotros / Contacto" } },
];

import Products from "./Products";

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const lang = "es";
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);
  const sessionId = getSessionId();
  const navigate = useNavigate();

  // Detectar usuario logueado
  useEffect(() => {
    const stored = localStorage.getItem("loggedUser");
    if (stored) {
      try { setLoggedUser(JSON.parse(stored)); } catch (e) { /* ignore */ }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("token");
    setLoggedUser(null);
  };

  // Cargar carrito desde el API al iniciar
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/${sessionId}`);
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.includes("application/json")) {
        setCartItems([]);
        return;
      }
      const data = await response.json();
      if (data.status === "success" && data.data.items) {
        // Mapear items del carrito a formato del frontend
        const mappedItems = data.data.items.map(item => ({
          id: item.productId._id,
          _id: item.productId._id,
          name: item.productId.name,
          color: item.productId.color,
          price: item.productId.preu,
          imageSrc: item.productId.imageSrc,
          imageAlt: item.productId.imageAlt,
          quantity: item.quantity
        }));
        setCartItems(mappedItems);
      }
    } catch (error) {
      console.error("Error cargando carrito:", error);
    }
  };

  const addToCart = async (product) => {
    setIsLoading(true);
    try {
      // Si el producto tiene _id de MongoDB, usarlo; si no, buscar por índice
      const productId = product._id || products[product.id - 1]?._id;

      // Añadir localmente primero para feedback inmediato
      const existingItem = cartItems.find(item =>
        (item._id && product._id && item._id === product._id) || (item.id !== undefined && product.id !== undefined && item.id === product.id)
      );

      if (existingItem) {
        setCartItems(cartItems.map(item =>
          ((item._id && product._id && item._id === product._id) || (item.id !== undefined && product.id !== undefined && item.id === product.id))
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        ));
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }

      // Si tenemos productId de MongoDB, sincronizar con el servidor
      if (productId) {
        await fetch(`${API_URL}/cart/${sessionId}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: 1 })
        });
      }

      // Abrir el carrito automáticamente
      setCartOpen(true);
    } catch (error) {
      console.error("Error añadiendo al carrito:", error);
    }
    setIsLoading(false);
  };

  const removeFromCart = async (product) => {
    try {
      const productId = product._id || product.id;
      setCartItems(cartItems.filter(item => {
        const itemId = item._id || item.id;
        return itemId !== productId;
      }));

      if (product._id) {
        await fetch(`${API_URL}/cart/${sessionId}/item/${product._id}`, {
          method: "DELETE"
        });
      }
    } catch (error) {
      console.error("Error eliminando del carrito:", error);
    }
  };

  // Calcular subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price?.replace("€", "") || "0");
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const t = translations[lang];
  const homeCopy = {
    badge: lang === "es" ? "Nueva temporada 25/26" : "New season 25/26",
    headline: lang === "es" ? "La camiseta que se siente como dia de partido" : "Kits that feel like matchday",
    subtitle: lang === "es"
      ? "Camisetas oficiales, retros seleccionadas y drops modernos para hinchas que miran cada detalle."
      : "Official jerseys, curated retro picks, and modern drops for fans who notice every detail.",
    shop: lang === "es" ? "Ver camisetas" : "Shop kits",
    retro: lang === "es" ? "Coleccion retro" : "Retro collection",
    pitch: lang === "es" ? "Tienda de camisetas de futbol" : "Football jersey store",
  };
  const heroShowcase = [
    { image: "./img/bcn1.png", team: "Barcelona", label: "Home 24/25", price: "120€", position: "z-20 translate-y-8" },
    { image: "./img/Real.png", team: "Real Madrid", label: "Home 25/26", price: "120€", position: "z-30 -translate-y-4 scale-105" },
    { image: "./img/atm1.png", team: "Atleti", label: "Home kit", price: "120€", position: "z-20 translate-y-8" },
  ];

  // Controla la sección mostrada
  const [section, setSection] = useState("home");

  const changeSection = (href) => {
    setSection(href);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header / Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#06140d]/88 shadow-lg shadow-emerald-950/10 backdrop-blur-xl">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <button onClick={() => changeSection("home")} className="-m-1.5 flex items-center gap-3 p-1.5 text-left">
              <span className="sr-only">EXPOMANIA</span>
              <img
                className="h-10 w-auto drop-shadow-md"
                src="./img/logo.png"
                alt="EXPOMANIA Logo"
              />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white/80 hover:bg-white/10"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
            {navigation.map((item) => (
              <button
                key={item.href}
                onClick={() => changeSection(item.href)}
                className={`nav-link text-sm font-semibold uppercase transition-colors duration-300 ${section === item.href ? "text-[#f4c542]" : "text-white/75 hover:text-white"}`}
              >
                {item.label[lang]}
              </button>
            ))}

            <div className="flex items-center gap-4 ml-6">
              

              <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="group relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/6 text-white/75 shadow-sm shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f4c542]/55 hover:bg-white/12 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#f4c542]/45">
                     <UserIcon
                       className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-105"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className={`absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full ${loggedUser ? "bg-[#f4c542]" : "bg-white/38"}`} />
                  </MenuButton>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
<MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right focus:outline-none">
  <div style={{ background: '#0d1a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
    {loggedUser ? (
      <>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: 0 }}>
            {loggedUser.nom} {loggedUser.primerCognom || ''}
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(212,175,55,0.7)', margin: '2px 0 0' }}>
            {loggedUser.rol === 'admin' ? 'Administrador' : 'Cliente'}
          </p>
        </div>
        <div style={{ padding: '6px' }}>
          <MenuItem>
            {({ active }) => (
              <Link to="/profile" style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? 'white' : 'rgba(255,255,255,0.7)', background: active ? 'rgba(255,255,255,0.05)' : 'transparent', textDecoration: 'none' }}>Mi Perfil</Link>
            )}
          </MenuItem>
          {loggedUser.rol === 'admin' && (
            <MenuItem>
              {({ active }) => (
                <Link to="/admin" style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? '#d4af37' : 'rgba(212,175,55,0.7)', background: active ? 'rgba(212,175,55,0.05)' : 'transparent', textDecoration: 'none' }}>Panel Admin</Link>
              )}
            </MenuItem>
          )}
          <MenuItem>
            {({ active }) => (
              <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? '#f87171' : 'rgba(248,113,113,0.7)', background: active ? 'rgba(248,113,113,0.05)' : 'transparent', border: 'none', cursor: 'pointer' }}>Cerrar Sesión</button>
            )}
          </MenuItem>
        </div>
      </>
    ) : (
      <div style={{ padding: '6px' }}>
        <MenuItem>
          {({ active }) => (
            <Link to="/login" style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? 'white' : 'rgba(255,255,255,0.7)', background: active ? 'rgba(255,255,255,0.05)' : 'transparent', textDecoration: 'none' }}>Iniciar Sesión</Link>
          )}
        </MenuItem>
        <MenuItem>
          {({ active }) => (
            <Link to="/register" style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? 'white' : 'rgba(255,255,255,0.7)', background: active ? 'rgba(255,255,255,0.05)' : 'transparent', textDecoration: 'none' }}>Registrarse</Link>
          )}
        </MenuItem>
      </div>
    )}
  </div>
</MenuItems>
                </Transition>
              </Menu>

              <button
                onClick={() => setCartOpen(true)}
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/12 bg-white/6 text-white/75 shadow-sm shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f4c542]/55 hover:bg-white/12 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#f4c542]/45"
              >
                <span className="sr-only">Shopping Cart</span>
                <ShoppingBagIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" strokeWidth={2} />
                {cartItems.length > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#06140d] bg-[#f4c542] px-1 text-[10px] font-black text-emerald-950 shadow-lg">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

        </nav>

        {/* Mobile Menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-[#f7f8f2] p-6 shadow-2xl sm:max-w-sm">
            <div className="flex items-center justify-between">
              <button onClick={() => changeSection("home")} className="-m-1.5 flex items-center gap-3 p-1.5">
                <span className="sr-only">EXPOMANIA</span>
                <img
                  className="h-10 w-auto"
                  src="./img/logo.png"
                  alt="EXPOMANIA Logo"
                />
                <span className="text-sm font-black uppercase text-emerald-950">EXPOMANIA</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-emerald-950 hover:bg-emerald-100"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {navigation.map((item) => (
                <button
                  key={item.href}
                  onClick={() => changeSection(item.href)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-base font-semibold ${section === item.href ? "bg-emerald-100 text-emerald-950" : "text-emerald-950 hover:bg-emerald-100"}`}
                >
                  {item.label[lang]}
                </button>
              ))}
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* RENDERIZAR SECCIONES */}
      <main className="">
        {section === "home" && (
          <section className="relative isolate h-screen overflow-hidden bg-[#06140d] pt-20 text-white">
            <div className="absolute inset-0 stadium-surface pitch-lines opacity-95" aria-hidden="true" />
            <div className="absolute inset-0 stadium-lights" aria-hidden="true" />

            <div className="relative mx-auto grid h-full max-w-7xl items-center gap-8 px-6 pb-7 pt-5 lg:grid-cols-[1fr_1fr] lg:px-8">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase text-lime-100 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#f4c542]" />
                  {homeCopy.badge}
                </div>

                <p className="mb-3 text-sm font-bold uppercase text-[#f4c542]">{homeCopy.pitch}</p>
                <h1 className="max-w-4xl text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl xl:text-8xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {t.hero.title}
                </h1>
                <p className="mt-4 max-w-2xl text-2xl font-black leading-tight text-white">
                  {homeCopy.headline}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                  {homeCopy.subtitle}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => changeSection('products')}
                    className="btn-shine inline-flex items-center justify-center rounded-lg bg-[#f4c542] px-8 py-4 text-base font-black text-emerald-950 shadow-xl shadow-black/20 transition-all duration-300 hover:bg-[#ffdb63] hover:scale-[1.02]"
                  >
                    {homeCopy.shop}
                  </button>
                  <button
                    onClick={() => changeSection('retros')}
                    className="inline-flex items-center justify-center rounded-lg border border-white/25 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/18"
                  >
                    {homeCopy.retro}
                  </button>
                </div>
              </div>

              <div className="relative hidden h-full min-h-[31rem] items-center lg:flex">
                <div className="absolute left-1/2 top-1/2 h-[25rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-white/8 shadow-2xl shadow-black/30" aria-hidden="true" />
                <div className="absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f4c542]/30" aria-hidden="true" />

                <div className="relative grid w-full grid-cols-3 items-center gap-4">
                  {heroShowcase.map((item) => (
                    <button
                      key={item.team}
                      onClick={() => changeSection("products")}
                      className={`group relative overflow-hidden rounded-lg border border-white/12 bg-white/90 p-3 text-left text-emerald-950 shadow-2xl shadow-black/25 transition duration-300 hover:-translate-y-1 hover:border-[#f4c542] ${item.position}`}
                    >
                      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-700 via-[#f4c542] to-[#9a1c20]" />
                      <div className="flex min-h-[10.5rem] items-center justify-center rounded-md bg-[#eef2ea] p-3 xl:min-h-[13rem]">
                        <img src={item.image} alt={item.team} className="h-40 w-full object-contain drop-shadow-2xl transition duration-500 group-hover:scale-105 xl:h-52" />
                      </div>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase text-[#9a1c20]">{item.team}</p>
                          <p className="mt-1 text-sm font-black">{item.label}</p>
                        </div>
                        <span className="rounded-md bg-[#fff4cf] px-2.5 py-1 text-sm font-black text-[#8a6200]">{item.price}</span>
                      </div>
                    </button>
                  ))}

                  <div className="absolute -bottom-16 left-1/2 z-40 w-[16rem] -translate-x-1/2 rounded-lg border border-white/16 bg-[#06140d]/86 p-4 shadow-2xl shadow-black/35 backdrop-blur xl:-bottom-12">
                    <p className="text-[11px] font-black uppercase text-[#f4c542]">Drop destacado</p>
                    <p className="mt-1 text-xl font-black text-white">Kits oficiales listos para partido</p>
                    <div className="mt-3 flex items-center gap-3 text-xs font-bold text-white/68">
                      <span>15 camisetas</span>
                      <span className="h-1 w-1 rounded-full bg-[#f4c542]" />
                      <span>Envio 24h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {section === "products" && <Products lang={lang} onAddToCart={addToCart} />}

        {section === "retros" && (
          <section className="min-h-screen bg-[#08150e] pt-28 text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase text-[#f4c542]">Retros</p>
                <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                  Camisetas con historia, sin depender de una lista fija de equipos.
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/70">
                  Esta seccion queda preparada para crecer con nuevas colecciones, temporadas especiales y piezas clasicas sin bloquear la web a clubes concretos.
                </p>
                <button onClick={() => changeSection('products')} className="mt-8 rounded-lg bg-[#f4c542] px-6 py-3 text-sm font-black text-emerald-950">
                  Ver productos retro
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {["Clasicas", "Ediciones especiales", "Temporadas historicas"].map((item, index) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-white/8 p-5 shadow-xl shadow-black/20">
                    <p className="text-sm font-black text-[#f4c542]">0{index + 1}</p>
                    <h3 className="mt-4 text-xl font-black">{item}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/62">Colecciones pensadas para aficionados que buscan algo mas que la camiseta actual.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </section>
        )}

        {section === "about-contact" && (
          <section className="min-h-screen bg-[#0d1a12] pt-28 text-white">
            <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-sm font-black uppercase tracking-widest text-[#d4af37] mb-4">EXPOMANIA CLUBHOUSE</p>
                <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white">
                  Más que una tienda, <br/>
                  <span className="text-[#9a1c20]">nuestra pasión.</span>
                </h2>
                <p className="mt-6 text-lg leading-8 text-white/70 max-w-2xl mx-auto">
                  Fundada por y para verdaderos amantes del fútbol. Nos dedicamos a conseguir, clasificar y entregar las mejores camisetas con la máxima calidad y una experiencia de compra impecable. 
                </p>
              </div>

              <div className="grid gap-12 lg:grid-cols-2 items-start mt-12">
                <div className="bg-[#15291d] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/50">
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="text-[#d4af37]">01.</span> Nuestra Misión
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    Creemos que cada camiseta cuenta una historia. Nuestro objetivo es llevar esa historia a tus manos con el mejor servicio, transparencia total y envíos rápidos en 24h.
                  </p>
                  <ul className="space-y-4 text-white/80 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="text-[#9a1c20]">✓</span> Calidad 100% garantizada
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#9a1c20]">✓</span> Proceso de compra seguro
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#9a1c20]">✓</span> Catálogo cuidadosamente seleccionado
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#9a1c20] to-[#6a1015] border border-red-900/50 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-red-900/20">
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="text-[#d4af37]">02.</span> Contacto y Soporte
                  </h3>
                  <p className="text-white/90 leading-relaxed mb-8">
                    ¿Dudas sobre tallas, envíos o pedidos especiales? Nuestro equipo está listo para ayudarte antes, durante y después de tu compra.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl">
                      <div className="bg-[#d4af37]/20 p-3 rounded-lg text-[#d4af37]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-white/60 tracking-wider">Email</p>
                        <p className="font-semibold text-white">support@expomania.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl">
                      <div className="bg-[#d4af37]/20 p-3 rounded-lg text-[#d4af37]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-white/60 tracking-wider">Horario de Atención</p>
                        <p className="font-semibold text-white">Lunes a Viernes / 9:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <footer className="relative mt-16 overflow-hidden border-t border-white/10 bg-[#06140d]">
              <div className="absolute inset-0 pitch-lines opacity-25" aria-hidden="true" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f4c542] to-transparent" aria-hidden="true" />

              <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                  <div>
                    <div className="flex items-center gap-3">
                      <img src="./img/logo.png" alt="EXPOMANIA Logo" className="h-12 w-auto drop-shadow-lg" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#f4c542]">EXPOMANIA</p>
                        <p className="text-sm font-semibold text-white/62">Football shirts, matchday mood</p>
                      </div>
                    </div>

                    <h3 className="mt-7 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
                      Final de partido. Tu proxima camiseta empieza aqui.
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/64">
                      Catalogo vivo, drops retro y una experiencia de compra clara para fans que miran cada detalle.
                    </p>

                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => changeSection("products")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#f4c542] px-5 py-3 text-sm font-black text-emerald-950 shadow-lg shadow-black/20 transition hover:bg-[#ffdb63]"
                      >
                        Ver camisetas
                        <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <a
                        href="mailto:support@expomania.com"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/14"
                      >
                        Contactar
                        <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { title: "Catalogo vivo", text: "Nuevas camisetas sin limitar la tienda a clubes fijos.", Icon: SparklesIcon },
                      { title: "Compra segura", text: "Proceso claro desde el carrito hasta el pago.", Icon: ShieldCheckIcon },
                      { title: "Preparacion 24h", text: "Pedidos listos con ritmo de dia de partido.", Icon: TruckIcon },
                    ].map(({ title, text, Icon }) => (
                      <div key={title} className="rounded-lg border border-white/10 bg-white/8 p-4">
                        <Icon className="h-6 w-6 text-[#f4c542]" aria-hidden="true" />
                        <h4 className="mt-4 text-sm font-black uppercase text-white">{title}</h4>
                        <p className="mt-2 text-xs leading-5 text-white/58">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-wide text-white/50 sm:flex-row sm:items-center sm:justify-between">
                  <p>2026 EXPOMANIA. Camisetas de futbol con estilo propio.</p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => changeSection("home")} className="transition hover:text-white">Inicio</button>
                    <button onClick={() => changeSection("products")} className="transition hover:text-white">Productos</button>
                    <button onClick={() => changeSection("retros")} className="transition hover:text-white">Retros</button>
                  </div>
                </div>
              </div>
            </footer>
          </section>
        )}

      </main>

      {/* CART SLIDE-OVER */}
      <Transition show={cartOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setCartOpen}>
          <TransitionChild
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-emerald-950/70 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-[#f7f8f2] shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className="text-lg font-black text-emerald-950">
                            {t.cart.title}
                          </DialogTitle>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-emerald-950/45 hover:text-emerald-950"
                              onClick={() => setCartOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((product, idx) => (
                                <li key={product._id || `cart-${product.id}-${idx}`} className="flex py-6">
                                  <div className="kit-image-stage h-24 w-24 shrink-0 overflow-hidden rounded-md border border-emerald-900/10 p-2">
                                    <img
                                      src={product.imageSrc}
                                      alt={product.imageAlt}
                                      className="h-full w-full object-contain object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-black text-emerald-950">
                                        <h3>
                                          <a href={product.href}>{product.name[lang]}</a>
                                        </h3>
                                        <p className="ml-4">{product.price}</p>
                                      </div>
                                      <p className="mt-1 text-sm font-semibold text-emerald-950/55">
                                        {product.color[lang]}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-emerald-950/55">{t.cart.qty} {product.quantity || 1}</p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => removeFromCart(product)}
                                          className="font-black text-[#9a1c20] hover:text-red-700"
                                        >
                                          {t.cart.remove}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-emerald-900/10 bg-white px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-black text-emerald-950">
                          <p>{t.cart.subtotal}</p>
                          <p>{calculateSubtotal()}€</p>
                        </div>
                        <p className="mt-0.5 text-sm text-emerald-950/55">
                          {t.cart.shipping_note}
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => {
                              setCartOpen(false);
                              navigate("/cart", { state: { cartItems, lang } });
                            }}
                            className="flex w-full items-center justify-center rounded-lg border border-transparent bg-emerald-950 px-6 py-3 text-base font-black text-white shadow-sm transition hover:bg-emerald-800"
                          >
                            {t.cart.checkout}
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-emerald-950/55">
                          <p>
                            {t.cart.or}{" "}
                            <button
                              type="button"
                              className="font-black text-[#9a1c20] hover:text-red-700"
                              onClick={() => setCartOpen(false)}
                            >
                              {t.cart.continue_shopping}
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
