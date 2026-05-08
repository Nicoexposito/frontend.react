import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserIcon, ShoppingBagIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
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
  { name: "home", href: "home" },
  { name: "about", href: "about" },
  { name: "products", href: "products" },
  { name: "retros", href: "retros" },
  { name: "contact", href: "contact" },
];

import Products from "./Products";

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [lang, setLang] = useState("en");
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
  const featuredProducts = products.slice(0, 4);
  const heroProducts = featuredProducts.slice(0, 3);
  const retroProducts = [products[2], products[7], products[14], products[10]].filter(Boolean);
  const homeCopy = {
    badge: lang === "es" ? "Nueva temporada 25/26" : "New season 25/26",
    headline: lang === "es" ? "La camiseta que se siente como dia de partido" : "Kits that feel like matchday",
    subtitle: lang === "es"
      ? "Camisetas oficiales, retros seleccionadas y drops modernos para hinchas que miran cada detalle."
      : "Official jerseys, curated retro picks, and modern drops for fans who notice every detail.",
    shop: lang === "es" ? "Ver camisetas" : "Shop kits",
    retro: lang === "es" ? "Coleccion retro" : "Retro collection",
    pitch: lang === "es" ? "Tienda de camisetas de futbol" : "Football jersey store",
    stats: [
      { value: "+15", label: lang === "es" ? "kits activos" : "active kits" },
      { value: "24h", label: lang === "es" ? "preparacion" : "dispatch prep" },
      { value: "100%", label: lang === "es" ? "look estadio" : "stadium look" },
    ],
  };

  // Controla la sección mostrada
  const [section, setSection] = useState("home");

  const changeSection = (href) => {
    setSection(href);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header / Navigation */}
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${section === 'home' ? 'border-white/10 bg-[#06140d]/70 backdrop-blur-xl' : 'border-emerald-900/10 bg-white/90 shadow-lg shadow-emerald-950/5 backdrop-blur-xl'}`}>
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
              <span className={`hidden text-sm font-black uppercase sm:block ${section === 'home' ? 'text-white' : 'text-emerald-950'}`}>EXPOMANIA</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${section === 'home' ? 'text-white/80 hover:bg-white/10' : 'text-emerald-950 hover:bg-emerald-50'}`}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => changeSection(item.href)}
                className={`nav-link text-sm font-semibold uppercase transition-colors duration-300 ${section === 'home' ? 'text-white/75 hover:text-white' : 'text-emerald-950/75 hover:text-emerald-700'}`}
              >
                {t.navigation[item.name]}
              </button>
            ))}

            <div className="flex items-center gap-4 ml-6">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className={`group inline-flex justify-center text-sm font-medium transition-colors ${section === 'home' ? 'text-white/70 hover:text-white' : 'text-emerald-950/75 hover:text-emerald-700'}`}>
                     <GlobeAltIcon
                       className={`-mr-1 ml-1 h-6 w-6 shrink-0 transition-colors ${section === 'home' ? 'text-white/60 group-hover:text-white' : 'text-emerald-900/60 group-hover:text-emerald-700'}`}
                      aria-hidden="true"
                    />
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
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() => setLang("en")}
                            className={`${active ? "bg-gray-100" : ""
                              } block px-4 py-2 text-sm font-medium text-gray-900 text-left w-full`}
                          >
                            English
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() => setLang("es")}
                            className={`${active ? "bg-gray-100" : ""
                              } block px-4 py-2 text-sm font-medium text-gray-900 text-left w-full`}
                          >
                            Español
                          </button>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>

              <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className={`group inline-flex justify-center text-sm font-medium transition-colors ${section === 'home' ? 'text-white/70 hover:text-white' : 'text-emerald-950/75 hover:text-emerald-700'}`}>
                     <UserIcon
                       className={`-mr-1 ml-1 h-6 w-6 shrink-0 transition-colors ${section === 'home' ? 'text-white/60 group-hover:text-white' : 'text-emerald-900/60 group-hover:text-emerald-700'}`}
                      aria-hidden="true"
                    />
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
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {loggedUser ? (
                        <>
                          <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b border-gray-100">
                            {loggedUser.nom} {loggedUser.primerCognom || ""}
                          </div>
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={`${active ? "bg-gray-100" : ""
                                  } block px-4 py-2 text-sm font-medium text-gray-900 text-left w-full`}
                              >
                                {lang === "es" ? "Mi Perfil" : "My Profile"}
                              </Link>
                            )}
                          </MenuItem>
                          {loggedUser.rol === 'admin' && (
                            <MenuItem>
                              {({ active }) => (
                                <Link
                                  to="/admin"
                                  className={`${active ? "bg-gray-100" : ""
                                    } block px-4 py-2 text-sm font-medium text-emerald-700 text-left w-full`}
                                >
                                  {lang === "es" ? "Panel Admin" : "Admin Panel"}
                                </Link>
                              )}
                            </MenuItem>
                          )}
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${active ? "bg-gray-100" : ""
                                  } block px-4 py-2 text-sm font-medium text-red-600 text-left w-full`}
                              >
                                {lang === "es" ? "Cerrar Sesión" : "Logout"}
                              </button>
                            )}
                          </MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                to="/login"
                                className={`${active ? "bg-gray-100" : ""
                                  } block px-4 py-2 text-sm font-medium text-gray-900 text-left w-full`}
                              >
                                {lang === "es" ? "Iniciar Sesión" : "Login"}
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <Link
                                to="/register"
                                className={`${active ? "bg-gray-100" : ""
                                  } block px-4 py-2 text-sm font-medium text-gray-900 text-left w-full`}
                              >
                                {lang === "es" ? "Registrarse" : "Register"}
                              </Link>
                            )}
                          </MenuItem>
                        </>
                      )}
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>

              <button
                onClick={() => setCartOpen(true)}
                className={`transition-all duration-300 relative group ${section === 'home' ? 'text-white/80 hover:text-white' : 'text-emerald-950/75 hover:text-emerald-700'}`}
              >
                <span className="sr-only">Shopping Cart</span>
                <ShoppingBagIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#d8a31a] text-[10px] font-bold text-emerald-950 shadow-lg">
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
                  key={item.name}
                  onClick={() => changeSection(item.href)}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-semibold text-emerald-950 hover:bg-emerald-100"
                >
                  {t.navigation[item.name]}
                </button>
              ))}
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* RENDERIZAR SECCIONES */}
      <main className="">
        {section === "home" && (
          <section className="relative isolate overflow-hidden bg-[#06140d] pt-24 text-white">
            <div className="absolute inset-0 stadium-surface pitch-lines opacity-95" aria-hidden="true" />
            <div className="absolute inset-0 stadium-lights" aria-hidden="true" />

            <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl items-center gap-10 px-6 pb-10 pt-10 lg:grid-cols-[1fr_0.95fr] lg:px-8">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase text-lime-100 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-[#f4c542]" />
                  {homeCopy.badge}
                </div>

                <p className="mb-3 text-sm font-bold uppercase text-[#f4c542]">{homeCopy.pitch}</p>
                <h1 className="max-w-4xl text-5xl font-black leading-[0.95] sm:text-6xl lg:text-8xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {t.hero.title}
                </h1>
                <p className="mt-5 max-w-2xl text-2xl font-black leading-tight text-white">
                  {homeCopy.headline}
                </p>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                  {homeCopy.subtitle}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

                <div className="mt-10 grid max-w-xl grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-black/20 backdrop-blur">
                  {homeCopy.stats.map((item) => (
                    <div key={item.label} className="border-r border-white/10 px-4 py-3 last:border-r-0">
                      <p className="text-2xl font-black text-white">{item.value}</p>
                      <p className="text-xs font-semibold uppercase text-white/58">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[30rem]">
                <div className="absolute left-1/2 top-1/2 h-[78%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" aria-hidden="true" />
                <div className="grid h-full grid-cols-2 gap-4">
                  {heroProducts.map((product, index) => (
                    <button
                      key={product.id}
                      onClick={() => changeSection('products')}
                      className={`group kit-card-surface overflow-hidden rounded-lg border border-white/18 p-4 text-left shadow-2xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-[#f4c542]/60 ${index === 0 ? 'col-span-2 mx-auto w-[72%]' : ''}`}
                    >
                      <div className="kit-image-stage flex aspect-[4/5] items-center justify-center rounded-md p-4">
                        <img src={product.imageSrc} alt={product.imageAlt} className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-emerald-950">{product.equip}</p>
                          <p className="truncate text-xs font-semibold text-emerald-900/60">{product.color?.[lang]}</p>
                        </div>
                        <span className="rounded-md bg-emerald-950 px-2.5 py-1 text-xs font-black text-[#f4c542]">{product.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative border-y border-white/10 bg-black/25">
              <div className="mx-auto grid max-w-7xl gap-3 px-6 py-4 text-xs font-bold uppercase text-white/70 sm:grid-cols-3 lg:px-8">
                <span>Matchday drops</span>
                <span className="text-[#f4c542]">Real Madrid / Barcelona / Atletico / Andorra</span>
                <span className="sm:text-right">Authentic look, modern checkout</span>
              </div>
            </div>
          </section>
        )}

        {section === "products" && <Products lang={lang} onAddToCart={addToCart} />}

        {section === "about" && (
          <section className="min-h-screen bg-[#f5f7f2] pt-28 text-emerald-950">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-black uppercase text-[#9a1c20]">EXPOMANIA CLUBHOUSE</p>
                  <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
                    {lang === "es" ? "Una tienda pensada para fans de camiseta, no solo para comprar rapido." : "A store built for shirt fans, not just quick shopping."}
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-emerald-950/70">
                    {lang === "es"
                      ? "La experiencia mezcla catalogo claro, imagen grande, filtros utiles y una estetica de estadio moderno para que cada camiseta luzca como protagonista."
                      : "The experience blends clear catalog browsing, large kit imagery, useful filters, and a modern stadium mood so every jersey feels like the main event."}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="kit-card-surface overflow-hidden rounded-lg border border-emerald-900/10 p-4 shadow-lg shadow-emerald-950/8">
                      <div className="kit-image-stage flex aspect-square items-center justify-center rounded-md p-4">
                        <img src={product.imageSrc} alt={product.imageAlt} className="h-full w-full object-contain drop-shadow-xl" />
                      </div>
                      <p className="mt-3 text-sm font-black">{product.equip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {section === "retros" && (
          <section className="min-h-screen bg-[#08150e] pt-28 text-white">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
              <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-black uppercase text-[#f4c542]">Retro room</p>
                  <h2 className="mt-2 text-4xl font-black sm:text-5xl">
                    {lang === "es" ? "Camisetas con alma de clasico." : "Kits with classic soul."}
                  </h2>
                </div>
                <button onClick={() => changeSection('products')} className="rounded-lg bg-[#f4c542] px-5 py-3 text-sm font-black text-emerald-950">
                  {lang === "es" ? "Ver catalogo completo" : "View full catalog"}
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {retroProducts.map((product) => (
                  <button key={product.id} onClick={() => changeSection('products')} className="group kit-card-surface rounded-lg border border-white/10 p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-[#f4c542]">
                    <div className="kit-image-stage flex aspect-[4/5] items-center justify-center rounded-md p-4">
                      <img src={product.imageSrc} alt={product.imageAlt} className="h-full w-full object-contain drop-shadow-xl transition duration-500 group-hover:scale-105" />
                    </div>
                    <p className="mt-4 text-base font-black text-emerald-950">{product.equip}</p>
                    <p className="text-sm font-semibold text-emerald-900/65">{product.color?.[lang]}</p>
                    <p className="mt-3 text-lg font-black text-[#9a1c20]">{product.price}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {section === "contact" && (
          <section className="min-h-screen bg-[#f5f7f2] pt-28 text-emerald-950">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-sm font-black uppercase text-[#9a1c20]">Support desk</p>
                  <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                    {lang === "es" ? "Dudas sobre talla, envio o disponibilidad?" : "Questions about size, shipping, or availability?"}
                  </h2>
                  <p className="mt-5 text-lg leading-8 text-emerald-950/70">
                    {lang === "es" ? "Te ayudamos a elegir la camiseta correcta antes de pasar por caja." : "We help you pick the right shirt before checkout."}
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-emerald-50 p-5">
                      <p className="text-sm font-black uppercase text-emerald-800">Email</p>
                      <p className="mt-2 font-semibold">support@expomania.com</p>
                    </div>
                    <div className="rounded-lg bg-[#fff7df] p-5">
                      <p className="text-sm font-black uppercase text-[#8a6200]">Horario</p>
                      <p className="mt-2 font-semibold">Lun - Vie / 9:00 - 18:00</p>
                    </div>
                  </div>
                  <button onClick={() => changeSection('products')} className="mt-6 w-full rounded-lg bg-emerald-950 px-5 py-4 font-black text-white">
                    {lang === "es" ? "Volver a camisetas" : "Back to kits"}
                  </button>
                </div>
              </div>
            </div>
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
