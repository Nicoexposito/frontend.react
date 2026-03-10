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
  const sessionId = getSessionId();
  const navigate = useNavigate();

  // Cargar carrito desde el API al iniciar
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/${sessionId}`);
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

  // Controla la sección mostrada
  const [section, setSection] = useState("home");

  const changeSection = (href) => {
    setSection(href);
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative bg-blue-100 min-h-screen">
      {/* Header / Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">EXPOMANIA</span>
              <img
                className="h-10 w-auto"
                src="./img/logo.png"
                alt="EXPOMANIA Logo"
              />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-200"
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
                className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {t.navigation[item.name]}
              </button>
            ))}

            <div className="flex items-center gap-4 ml-6">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    <GlobeAltIcon
                      className="-mr-1 ml-1 h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-500"
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
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    <UserIcon
                      className="-mr-1 ml-1 h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-500"
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
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>

              <button
                onClick={() => setCartOpen(true)}
                className="text-gray-900 hover:text-indigo-600 transition-colors relative"
              >
                <span className="sr-only">Shopping Cart</span>
                <ShoppingBagIcon className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
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
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-white p-6 sm:max-w-sm shadow-lg">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">EXPOMANIA</span>
                <img
                  className="h-10 w-auto"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 p-2.5 rounded-md text-gray-700 hover:bg-gray-200"
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
                  className="block w-full rounded-md px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 text-left"
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
        {/* HERO – NO TOCADO */}
        {section === "home" && (
          <div className="relative isolate flex flex-col justify-center items-center text-center py-32 lg:py-48 min-h-screen">
            <h1 className="text-6xl font-extrabold text-gray-900 sm:text-7xl lg:text-8xl">
              {t.hero.title}
            </h1>

            <p className="mt-6 max-w-xl text-xl sm:text-2xl text-gray-700">
              {t.hero.subtitle}
            </p>

            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="#"
                className="rounded-md bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-indigo-500 transition"
              >
                {t.hero.shop_now}
              </a>
              <a
                href="#"
                className="rounded-md border-2 border-indigo-600 px-8 py-4 text-lg font-bold text-indigo-600 hover:bg-indigo-50 transition"
              >
                {t.hero.explore_retro}
              </a>
            </div>

            <div
              className="absolute inset-0 -z-10 overflow-hidden"
              aria-hidden="true"
            >
              <div className="absolute top-[-25%] left-1/2 w-[70rem] -translate-x-1/2 rotate-[25deg] bg-gradient-to-tr from-pink-400 to-indigo-600 opacity-25 blur-3xl"></div>
              <div className="absolute bottom-[-25%] left-1/2 w-[70rem] -translate-x-1/2 rotate-[-25deg] bg-gradient-to-tr from-indigo-400 to-pink-600 opacity-25 blur-3xl"></div>
            </div>
          </div>
        )}

        {/* PRODUCTS SECTION */}
        {/* PRODUCTS SECTION */}
        {section === "products" && <Products lang={lang} onAddToCart={addToCart} />}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className="text-lg font-medium text-gray-900">
                            {t.cart.title}
                          </DialogTitle>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
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
                                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={product.imageSrc}
                                      alt={product.imageAlt}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href={product.href}>{product.name[lang]}</a>
                                        </h3>
                                        <p className="ml-4">{product.price}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.color[lang]}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-500">{t.cart.qty} {product.quantity || 1}</p>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          onClick={() => removeFromCart(product)}
                                          className="font-medium text-indigo-600 hover:text-indigo-500"
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

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>{t.cart.subtotal}</p>
                          <p>{calculateSubtotal()}€</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {t.cart.shipping_note}
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => {
                              setCartOpen(false);
                              navigate("/checkout", { state: { cartItems, lang } });
                            }}
                            className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition"
                          >
                            {t.cart.checkout}
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            {t.cart.or}{" "}
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
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
