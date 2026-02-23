import React, { useState, useEffect } from "react";
import { translations } from "./translations";
import { ShoppingCartIcon, FunnelIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const API_URL = "http://localhost:3000/api";

// Productos de respaldo (fallback) si el API no responde
export const fallbackProducts = [
    // ========== REAL MADRID ==========
    {
        id: 1,
        name: { en: "Official Real Madrid 25/26 shirt", es: "Camiseta oficial Real Madrid 25/26" },
        href: "#", imageSrc: "./img/Real.png", imageAlt: "1 Real Madrid.",
        price: "120€",
        color: { en: "Home Kit", es: "Primera Equipación" },
        equip: "Real Madrid", liga: "La Liga", marca: "Adidas", colorPrincipal: "Blanco", talla: "M",
        descripcio: { en: "Official Real Madrid 25/26 season shirt – Home kit. Premium Adidas quality with breathable fabric.", es: "Camiseta oficial del Real Madrid temporada 25/26 – Primera equipación. Calidad premium Adidas con tejido transpirable." }
    },
    {
        id: 2,
        name: { en: "Official Real Madrid 25/26 shirt", es: "Camiseta oficial Real Madrid 25/26" },
        href: "#", imageSrc: "./img/Real2.png", imageAlt: "2 Real Madrid.",
        price: "120€",
        color: { en: "Away Kit", es: "Segunda Equipación" },
        equip: "Real Madrid", liga: "La Liga", marca: "Adidas", colorPrincipal: "Azul Marino", talla: "M",
        descripcio: { en: "Official Real Madrid 25/26 season shirt – Away kit. Dark navy design with dynamic wave pattern.", es: "Camiseta oficial del Real Madrid temporada 25/26 – Segunda equipación. Diseño azul marino con patrón de olas." }
    },
    {
        id: 3,
        name: { en: "Official Real Madrid 25/26 shirt", es: "Camiseta oficial Real Madrid 25/26" },
        href: "#", imageSrc: "./img/Real3.png", imageAlt: "3 Real Madrid.",
        price: "120€",
        color: { en: "Third Kit", es: "Tercera Equipación" },
        equip: "Real Madrid", liga: "La Liga", marca: "Adidas", colorPrincipal: "Negro", talla: "M",
        descripcio: { en: "Official Real Madrid 25/26 season shirt – Third kit. Sleek black retro Adidas Originals design.", es: "Camiseta oficial del Real Madrid temporada 25/26 – Tercera equipación. Diseño retro negro Adidas Originals." }
    },
    {
        id: 4,
        name: { en: "Official Real Madrid 25/26 shirt", es: "Camiseta oficial Real Madrid 25/26" },
        href: "#", imageSrc: "./img/Real4.png", imageAlt: "4 Real Madrid.",
        price: "120€",
        color: { en: "Fourth Kit", es: "Cuarta Equipación" },
        equip: "Real Madrid", liga: "La Liga", marca: "Adidas", colorPrincipal: "Naranja", talla: "M",
        descripcio: { en: "Official Real Madrid 25/26 season shirt – Fourth kit. Vibrant orange with diagonal stripe pattern.", es: "Camiseta oficial del Real Madrid temporada 25/26 – Cuarta equipación. Naranja vibrante con patrón diagonal." }
    },
    // ========== FC BARCELONA ==========
    {
        id: 5,
        name: { en: "FC Barcelona Home Kit 24/25", es: "Camiseta 1ª Equipación FC Barcelona 24/25" },
        href: "#", imageSrc: "./img/bcn1.png", imageAlt: "1 FC Barcelona.",
        price: "120€",
        color: { en: "Home Kit", es: "Primera Equipación" },
        equip: "FC Barcelona", liga: "La Liga", marca: "Nike", colorPrincipal: "Azulkrana", talla: "M",
        descripcio: { en: "Official FC Barcelona 24/25 Home Kit. Classic blaugrana stripes with Nike Dri-FIT technology.", es: "Camiseta oficial del FC Barcelona 24/25 – Primera equipación. Rayas blaukrana con tecnología Nike Dri-FIT." }
    },
    {
        id: 6,
        name: { en: "FC Barcelona Away Kit 24/25", es: "Camiseta 2ª Equipación FC Barcelona 24/25" },
        href: "#", imageSrc: "./img/bcn2.png", imageAlt: "2 FC Barcelona.",
        price: "120€",
        color: { en: "Away Kit", es: "Segunda Equipación" },
        equip: "FC Barcelona", liga: "La Liga", marca: "Nike", colorPrincipal: "Amarillo", talla: "M",
        descripcio: { en: "Official FC Barcelona 24/25 Away Kit. Bold away design for matches on the road.", es: "Camiseta oficial del FC Barcelona 24/25 – Segunda equipación. Diseño exterior para los partidos fuera de casa." }
    },
    {
        id: 7,
        name: { en: "FC Barcelona Third Kit 24/25", es: "Camiseta 3ª Equipación FC Barcelona 24/25" },
        href: "#", imageSrc: "./img/bcn3.png", imageAlt: "3 FC Barcelona.",
        price: "120€",
        color: { en: "Third Kit", es: "Tercera Equipación" },
        equip: "FC Barcelona", liga: "La Liga", marca: "Nike", colorPrincipal: "Verde", talla: "M",
        descripcio: { en: "Official FC Barcelona 24/25 Third Kit. Unique third option with innovative design.", es: "Camiseta oficial del FC Barcelona 24/25 – Tercera equipación. Opción alternativa con diseño innovador." }
    },
    {
        id: 8,
        name: { en: "FC Barcelona Fourth Kit 24/25", es: "Camiseta 4ª Equipación FC Barcelona 24/25" },
        href: "#", imageSrc: "./img/bcn4.png", imageAlt: "4 FC Barcelona.",
        price: "120€",
        color: { en: "Fourth Kit", es: "Cuarta Equipación" },
        equip: "FC Barcelona", liga: "La Liga", marca: "Nike", colorPrincipal: "Rosa", talla: "M",
        descripcio: { en: "Official FC Barcelona 24/25 Fourth Kit. Special edition with a fresh look.", es: "Camiseta oficial del FC Barcelona 24/25 – Cuarta equipación. Edición especial con un look fresco." }
    },
    // ========== FC ANDORRA ==========
    {
        id: 9,
        name: { en: "FC Andorra Home Kit", es: "Camiseta 1ª Equipación FC Andorra" },
        href: "#", imageSrc: "./img/and1.png", imageAlt: "1 FC Andorra.",
        price: "80€",
        color: { en: "Home Kit", es: "Primera Equipación" },
        equip: "FC Andorra", liga: "Segunda División", marca: "Kappa", colorPrincipal: "Azul", talla: "M",
        descripcio: { en: "Official FC Andorra Home Kit. The Tricolors' home jersey with blue and yellow design.", es: "Camiseta oficial del FC Andorra – Primera equipación. Diseño azul y amarillo de los Tricolors." }
    },
    {
        id: 10,
        name: { en: "FC Andorra Away Kit", es: "Camiseta 2ª Equipación FC Andorra" },
        href: "#", imageSrc: "./img/and2.png", imageAlt: "2 FC Andorra.",
        price: "80€",
        color: { en: "Away Kit", es: "Segunda Equipación" },
        equip: "FC Andorra", liga: "Segunda División", marca: "Kappa", colorPrincipal: "Blanco", talla: "M",
        descripcio: { en: "Official FC Andorra Away Kit. Stylish away design for traveling supporters.", es: "Camiseta oficial del FC Andorra – Segunda equipación. Diseño elegante para los seguidores visitantes." }
    },
    {
        id: 11,
        name: { en: "FC Andorra Third Kit", es: "Camiseta 3ª Equipación FC Andorra" },
        href: "#", imageSrc: "./img/and3.png", imageAlt: "3 FC Andorra.",
        price: "80€",
        color: { en: "Third Kit", es: "Tercera Equipación" },
        equip: "FC Andorra", liga: "Segunda División", marca: "Kappa", colorPrincipal: "Rojo", talla: "M",
        descripcio: { en: "Official FC Andorra Third Kit. Bold third option for the Principality's club.", es: "Camiseta oficial del FC Andorra – Tercera equipación. Opción alternativa del club del Principado." }
    },
    // ========== ATLÉTICO DE MADRID ==========
    {
        id: 12,
        name: { en: "Atlético de Madrid Home Kit", es: "Camiseta 1ª Equipación Atlético de Madrid" },
        href: "#", imageSrc: "./img/atm1.png", imageAlt: "1 Atlético de Madrid.",
        price: "120€",
        color: { en: "Home Kit", es: "Primera Equipación" },
        equip: "Atlético de Madrid", liga: "La Liga", marca: "Nike", colorPrincipal: "Rojo", talla: "M",
        descripcio: { en: "Official Atlético de Madrid Home Kit. Classic rojiblanco stripes with Nike technology.", es: "Camiseta oficial del Atlético de Madrid – Primera equipación. Rayas rojiblancas clásicas con tecnología Nike." }
    },
    {
        id: 13,
        name: { en: "Atlético de Madrid Away Kit", es: "Camiseta 2ª Equipación Atlético de Madrid" },
        href: "#", imageSrc: "./img/atm2.png", imageAlt: "2 Atlético de Madrid.",
        price: "120€",
        color: { en: "Away Kit", es: "Segunda Equipación" },
        equip: "Atlético de Madrid", liga: "La Liga", marca: "Nike", colorPrincipal: "Azul", talla: "M",
        descripcio: { en: "Official Atlético de Madrid Away Kit. Sleek design for away matches at the highest level.", es: "Camiseta oficial del Atlético de Madrid – Segunda equipación. Diseño elegante para los partidos de visitante." }
    },
    {
        id: 14,
        name: { en: "Atlético de Madrid Third Kit", es: "Camiseta 3ª Equipación Atlético de Madrid" },
        href: "#", imageSrc: "./img/atm3.png", imageAlt: "3 Atlético de Madrid.",
        price: "120€",
        color: { en: "Third Kit", es: "Tercera Equipación" },
        equip: "Atlético de Madrid", liga: "La Liga", marca: "Nike", colorPrincipal: "Verde", talla: "M",
        descripcio: { en: "Official Atlético de Madrid Third Kit. Modern alternative design for the Colchoneros.", es: "Camiseta oficial del Atlético de Madrid – Tercera equipación. Diseño alternativo moderno para los Colchoneros." }
    },
    // ========== CE SABADELL ==========
    {
        id: 15,
        name: { en: "CE Sabadell Home Kit", es: "Camiseta 1ª Equipación CE Sabadell" },
        href: "#", imageSrc: "./img/sbd1.png", imageAlt: "1 CE Sabadell.",
        price: "70€",
        color: { en: "Home Kit", es: "Primera Equipación" },
        equip: "CE Sabadell", liga: "Primera Federación", marca: "Joma", colorPrincipal: "Azul", talla: "M",
        descripcio: { en: "Official CE Sabadell Home Kit. The Arlequinats' iconic blue and white striped jersey.", es: "Camiseta oficial del CE Sabadell – Primera equipación. La icónica camiseta a rayas azules y blancas de los Arlequinats." }
    },
];

// Exportar para compatibilidad con Home.jsx
export const products = fallbackProducts;

// Constantes de filtros
const LIGAS = ["La Liga", "Segunda División", "Primera Federación"];
const KIT_TYPES = [
    { value: "Home", en: "Home Kit", es: "Primera Equipación" },
    { value: "Away", en: "Away Kit", es: "Segunda Equipación" },
    { value: "Third", en: "Third Kit", es: "Tercera Equipación" },
    { value: "Fourth", en: "Fourth Kit", es: "Cuarta Equipación" },
    { value: "Goalkeeper", en: "Goalkeeper Kit", es: "Portero" },
];
const SIZES = ["XS", "S", "M", "L", "XL"];
const MARCAS = ["Adidas", "Nike", "Kappa", "Joma"];

// Colores con su código hex para mostrar punto de color
const COLORES = [
    { name: "Blanco", hex: "#FFFFFF", border: true },
    { name: "Negro", hex: "#1a1a1a" },
    { name: "Azul", hex: "#1e40af" },
    { name: "Azul Marino", hex: "#1e3a5f" },
    { name: "Azulkrana", hex: "#a4123f" },
    { name: "Rojo", hex: "#dc2626" },
    { name: "Naranja", hex: "#ea580c" },
    { name: "Amarillo", hex: "#eab308" },
    { name: "Verde", hex: "#16a34a" },
    { name: "Rosa", hex: "#ec4899" },
];

const PRICE_RANGES = [
    { label: { en: "Under 80€", es: "Menos de 80€" }, min: 0, max: 79 },
    { label: { en: "80€ – 100€", es: "80€ – 100€" }, min: 80, max: 100 },
    { label: { en: "100€ – 120€", es: "100€ – 120€" }, min: 100, max: 120 },
    { label: { en: "Over 120€", es: "Más de 120€" }, min: 121, max: 9999 },
];

// Componente de sección de filtro colapsable
function FilterSection({ title, isOpen, onToggle, children }) {
    return (
        <div className="mb-1">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-900 uppercase tracking-wider hover:text-indigo-600 transition-colors"
            >
                {title}
                {isOpen
                    ? <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                    : <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                }
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}
            >
                {children}
            </div>
            <hr className="border-gray-200" />
        </div>
    );
}

export default function Products({ lang = "en", onAddToCart }) {
    const t = translations[lang];
    const [productList, setProductList] = useState(fallbackProducts);
    const [originalList, setOriginalList] = useState(fallbackProducts);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedLigas, setSelectedLigas] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedMarcas, setSelectedMarcas] = useState([]);
    const [selectedColores, setSelectedColores] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Secciones de filtro colapsables
    const [openSections, setOpenSections] = useState({
        liga: true,
        equipo: true,
        equipacion: true,
        talla: true,
        marca: true,
        color: false,
        precio: false,
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Modal de detalle
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [shippingOpen, setShippingOpen] = useState(false);

    // Lista dinámica de equipos
    const [availableTeams, setAvailableTeams] = useState([]);

    // Helper para extraer precio numérico
    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        return parseFloat(String(priceStr).replace("€", "").replace(",", ".")) || 0;
    };

    // Cargar productos desde MongoDB
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                const data = await response.json();

                if (data.status === "success" && data.data.length > 0) {
                    const mappedProducts = data.data.map((product, index) => ({
                        id: index + 1,
                        _id: product._id,
                        name: product.name,
                        href: "#",
                        imageSrc: product.imageSrc || "",
                        imageAlt: product.imageAlt || "Product image",
                        price: product.preu,
                        color: product.color || { en: "", es: "" },
                        equip: product.equip || "Unknown Team",
                        liga: product.liga || "La Liga",
                        marca: product.marca || "Adidas",
                        colorPrincipal: product.colorPrincipal || "Blanco",
                        talla: product.talla || "M",
                        descripcio: product.descripcio || { en: "", es: "" },
                    }));
                    setProductList(mappedProducts);
                    setOriginalList(mappedProducts);
                    const teams = [...new Set(mappedProducts.map(p => p.equip))].sort();
                    setAvailableTeams(teams);
                } else {
                    setProductList(fallbackProducts);
                    setOriginalList(fallbackProducts);
                    const teams = [...new Set(fallbackProducts.map(p => p.equip))].sort();
                    setAvailableTeams(teams);
                }
            } catch (error) {
                console.error("Error cargando productos desde API:", error);
                setProductList(fallbackProducts);
                setOriginalList(fallbackProducts);
                const teams = [...new Set(fallbackProducts.map(p => p.equip))].sort();
                setAvailableTeams(teams);
            }
            setLoading(false);
        };

        fetchProducts();
    }, []);

    // Aplicar filtros
    useEffect(() => {
        if (originalList.length === 0) return;

        let filtered = originalList;

        if (selectedTeams.length > 0) {
            filtered = filtered.filter(p => selectedTeams.includes(p.equip));
        }

        if (selectedTypes.length > 0) {
            const typeTag = (p) => {
                const c = (p.color?.en || "").toLowerCase();
                if (c.includes("home")) return "Home";
                if (c.includes("away")) return "Away";
                if (c.includes("third")) return "Third";
                if (c.includes("fourth")) return "Fourth";
                if (c.includes("goalkeeper")) return "Goalkeeper";
                return "Other";
            };
            filtered = filtered.filter(p => selectedTypes.includes(typeTag(p)));
        }

        if (selectedLigas.length > 0) {
            filtered = filtered.filter(p => selectedLigas.includes(p.liga));
        }

        if (selectedSizes.length > 0) {
            filtered = filtered.filter(p => selectedSizes.includes(p.talla));
        }

        if (selectedMarcas.length > 0) {
            filtered = filtered.filter(p => selectedMarcas.includes(p.marca));
        }

        if (selectedColores.length > 0) {
            filtered = filtered.filter(p => selectedColores.includes(p.colorPrincipal));
        }

        if (selectedPriceRanges.length > 0) {
            filtered = filtered.filter(p => {
                const numPrice = parsePrice(p.price);
                return selectedPriceRanges.some(rangeIdx => {
                    const range = PRICE_RANGES[rangeIdx];
                    return numPrice >= range.min && numPrice <= range.max;
                });
            });
        }

        setProductList(filtered);
    }, [selectedTeams, selectedTypes, selectedLigas, selectedSizes, selectedMarcas, selectedColores, selectedPriceRanges, originalList]);

    const toggleFilter = (arr, setArr, value) => {
        if (arr.includes(value)) {
            setArr(arr.filter(v => v !== value));
        } else {
            setArr([...arr, value]);
        }
    };

    const clearAllFilters = () => {
        setSelectedTeams([]);
        setSelectedTypes([]);
        setSelectedLigas([]);
        setSelectedSizes([]);
        setSelectedMarcas([]);
        setSelectedColores([]);
        setSelectedPriceRanges([]);
    };

    const activeFilterCount = selectedTeams.length + selectedTypes.length + selectedLigas.length + selectedSizes.length + selectedMarcas.length + selectedColores.length + selectedPriceRanges.length;

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    const openDetail = (product) => {
        setSelectedProduct(product);
        setShippingOpen(false);
    };

    const closeDetail = () => {
        setSelectedProduct(null);
        setShippingOpen(false);
    };

    // Información de envío adaptada por producto
    const getShippingInfo = (product) => {
        const teamName = product?.equip || "tu equipo";
        const isSpanish = product?.liga === "La Liga" || product?.liga === "Segunda División" || product?.liga === "Primera Federación";
        return {
            title: lang === "es" ? "Envío y devoluciones" : "Shipping & Returns",
            content: lang === "es"
                ? `Echa un vistazo a las opciones de envío disponibles para la camiseta del ${teamName}:

• EU: 2-3 días hábiles
• España: 1-3 días hábiles
${isSpanish ? "• Madrid: 1-3 días hábiles (También disponible next day delivery)\n" : ""}• EE.UU: 4-7 días hábiles
• Australia: 4-9 días hábiles
• Resto del mundo: 7-10 días hábiles

El tiempo de envío es adicional al tiempo de procesado y personalización, si aplica.

Devoluciones:
Dispondrás de 31 días naturales para devolver tu pedido de la camiseta del ${teamName}. Se aplican términos y condiciones.`
                : `Check out the shipping options available for the ${teamName} shirt:

• EU: 2-3 business days
• Spain: 1-3 business days
${isSpanish ? "• Madrid: 1-3 business days (Next day delivery also available)\n" : ""}• USA: 4-7 business days
• Australia: 4-9 business days
• Rest of the world: 7-10 business days

Shipping time is in addition to processing and customization time, if applicable.

Returns:
You will have 31 calendar days to return your order of the ${teamName} shirt. Terms and conditions apply.`
        };
    };

    if (loading) {
        return (
            <div className="bg-white py-28 min-h-screen">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <p className="text-gray-500 animate-pulse">Wait please...</p>
                </div>
            </div>
        );
    }

    // =========== COMPONENTE DE FILTROS SIDEBAR ===========
    const FilterSidebar = () => (
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)] pr-2 custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-gray-50 py-2 z-10">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FunnelIcon className="h-5 w-5" />
                    {lang === "es" ? "Filtros" : "Filters"}
                </h3>
                {activeFilterCount > 0 && (
                    <button onClick={clearAllFilters} className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition">
                        {lang === "es" ? "Limpiar" : "Clear"} ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* Liga */}
            <FilterSection title={lang === "es" ? "Liga" : "League"} isOpen={openSections.liga} onToggle={() => toggleSection("liga")}>
                <div className="space-y-2">
                    {LIGAS.map(liga => (
                        <label key={liga} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedLigas.includes(liga)} onChange={() => toggleFilter(selectedLigas, setSelectedLigas, liga)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">{liga}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Equipo */}
            <FilterSection title={lang === "es" ? "Equipo" : "Team"} isOpen={openSections.equipo} onToggle={() => toggleSection("equipo")}>
                <div className="space-y-2">
                    {availableTeams.map(team => (
                        <label key={team} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedTeams.includes(team)} onChange={() => toggleFilter(selectedTeams, setSelectedTeams, team)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">{team}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Equipación */}
            <FilterSection title={lang === "es" ? "Equipación" : "Kit Type"} isOpen={openSections.equipacion} onToggle={() => toggleSection("equipacion")}>
                <div className="space-y-2">
                    {KIT_TYPES.map(kit => (
                        <label key={kit.value} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedTypes.includes(kit.value)} onChange={() => toggleFilter(selectedTypes, setSelectedTypes, kit.value)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">{lang === "es" ? kit.es : kit.en}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Marca */}
            <FilterSection title={lang === "es" ? "Marca" : "Brand"} isOpen={openSections.marca} onToggle={() => toggleSection("marca")}>
                <div className="space-y-2">
                    {MARCAS.map(marca => (
                        <label key={marca} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedMarcas.includes(marca)} onChange={() => toggleFilter(selectedMarcas, setSelectedMarcas, marca)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">{marca}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Color */}
            <FilterSection title={lang === "es" ? "Color" : "Color"} isOpen={openSections.color} onToggle={() => toggleSection("color")}>
                <div className="grid grid-cols-2 gap-2">
                    {COLORES.map(c => (
                        <button
                            key={c.name}
                            onClick={() => toggleFilter(selectedColores, setSelectedColores, c.name)}
                            className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md border transition-all duration-200
                                ${selectedColores.includes(c.name)
                                    ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                                }`}
                        >
                            <span
                                className="inline-block h-3.5 w-3.5 rounded-full shrink-0"
                                style={{
                                    backgroundColor: c.hex,
                                    border: c.border ? "1.5px solid #d1d5db" : "none"
                                }}
                            />
                            <span className="truncate">{c.name}</span>
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Precio */}
            <FilterSection title={lang === "es" ? "Precio" : "Price"} isOpen={openSections.precio} onToggle={() => toggleSection("precio")}>
                <div className="space-y-2">
                    {PRICE_RANGES.map((range, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedPriceRanges.includes(idx)} onChange={() => toggleFilter(selectedPriceRanges, setSelectedPriceRanges, idx)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">{range.label[lang]}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Talla */}
            <FilterSection title={lang === "es" ? "Talla" : "Size"} isOpen={openSections.talla} onToggle={() => toggleSection("talla")}>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                        <button key={size} onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-all duration-200
                                ${selectedSizes.includes(size)
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </FilterSection>
        </div>
    );

    return (
        <div className="bg-white py-16 sm:py-24 min-h-screen">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c7c7c7; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a0a0a0; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #c7c7c7 transparent; }
            `}</style>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t.products.title}</h2>
                    <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 border border-gray-300 rounded-lg px-4 py-2 transition">
                        <FunnelIcon className="h-5 w-5" />
                        {lang === "es" ? "Filtros" : "Filters"}
                        {activeFilterCount > 0 && <span className="bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{activeFilterCount}</span>}
                    </button>
                </div>

                {/* Filtros móvil */}
                {mobileFiltersOpen && (
                    <div className="lg:hidden mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <FilterSidebar />
                    </div>
                )}

                {/* Layout: Sidebar IZQUIERDA + Grid */}
                <div className="flex gap-8">
                    {/* Sidebar filtros — IZQUIERDA */}
                    <div className="hidden lg:block w-56 shrink-0">
                        <div className="sticky top-28 bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <FilterSidebar />
                        </div>
                    </div>

                    {/* Grid de productos */}
                    <div className="flex-1">
                        {productList.length === 0 ? (
                            <div className="text-center py-20">
                                <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">{lang === "es" ? "No se encontraron productos" : "No products found"}</h3>
                                <p className="mt-1 text-sm text-gray-500">{lang === "es" ? "Prueba a cambiar los filtros." : "Try changing the filters."}</p>
                                <button onClick={clearAllFilters} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500">{lang === "es" ? "Limpiar filtros" : "Clear filters"}</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-5">
                                {productList.map((product) => (
                                    <div key={product._id || product.id} className="group relative cursor-pointer" onClick={() => openDetail(product)}>
                                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 lg:aspect-none group-hover:opacity-90 lg:h-60 relative transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
                                            <img alt={product.imageAlt} src={product.imageSrc} className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                                            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-gray-700 px-2 py-0.5 rounded-full shadow-sm">{product.liga || "La Liga"}</span>
                                            <button onClick={(e) => handleAddToCart(e, product)} className="absolute bottom-3 right-3 z-20 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0" title={lang === "es" ? "Añadir al carrito" : "Add to cart"}>
                                                <ShoppingCartIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="mt-2 flex justify-between">
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-xs text-gray-700 font-medium truncate">{product.name[lang]}</h3>
                                                <p className="mt-0.5 text-xs text-gray-500">{product.color[lang]}</p>
                                            </div>
                                            <p className="text-xs font-bold text-gray-900 ml-2 shrink-0">{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ============ MODAL DE DETALLE ============ */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeDetail}>
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10 custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeDetail} className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-gray-100 transition">
                            <XMarkIcon className="h-5 w-5 text-gray-600" />
                        </button>

                        <div className="md:flex">
                            {/* Imagen */}
                            <div className="md:w-1/2 bg-gray-100 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                <img src={selectedProduct.imageSrc} alt={selectedProduct.imageAlt} className="w-full h-full object-cover object-center min-h-[300px] md:min-h-[400px] rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
                            </div>

                            {/* Info */}
                            <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                                <div className="flex-1">
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">{selectedProduct.equip}</span>
                                        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">{selectedProduct.liga || "La Liga"}</span>
                                        <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full">{selectedProduct.marca}</span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedProduct.name[lang]}</h2>
                                    <p className="text-sm text-indigo-600 font-medium mb-4">{selectedProduct.color[lang]}</p>
                                    <p className="text-3xl font-extrabold text-gray-900 mb-4">{selectedProduct.price}</p>

                                    {/* Color principal */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm text-gray-600">{lang === "es" ? "Color:" : "Color:"}</span>
                                        <span
                                            className="inline-block h-4 w-4 rounded-full"
                                            style={{
                                                backgroundColor: COLORES.find(c => c.name === selectedProduct.colorPrincipal)?.hex || "#ccc",
                                                border: selectedProduct.colorPrincipal === "Blanco" ? "1.5px solid #d1d5db" : "none"
                                            }}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{selectedProduct.colorPrincipal}</span>
                                    </div>

                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        {typeof selectedProduct.descripcio === "object" ? selectedProduct.descripcio[lang] : selectedProduct.descripcio}
                                    </p>

                                    {/* Tallas */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{lang === "es" ? "Tallas disponibles" : "Available Sizes"}</h4>
                                        <div className="flex gap-2">
                                            {SIZES.map(size => (
                                                <span key={size} className={`px-3 py-1.5 text-sm font-medium rounded-md border transition ${size === (selectedProduct.talla || "M") ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300"}`}>{size}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Envío y devoluciones - DESPLEGABLE */}
                                    <div className="border border-gray-200 rounded-lg mb-4">
                                        <button
                                            onClick={() => setShippingOpen(!shippingOpen)}
                                            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition rounded-lg"
                                        >
                                            <span className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                </svg>
                                                {getShippingInfo(selectedProduct).title}
                                            </span>
                                            {shippingOpen
                                                ? <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                                                : <ChevronDownIcon className="h-4 w-4 text-gray-500" />}
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${shippingOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                                            <div className="px-4 pb-4 pt-1">
                                                <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
                                                    {getShippingInfo(selectedProduct).content}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón añadir al carrito */}
                                <button
                                    onClick={(e) => { handleAddToCart(e, selectedProduct); closeDetail(); }}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl active:scale-[0.98]"
                                >
                                    <ShoppingCartIcon className="h-5 w-5" />
                                    {lang === "es" ? "Añadir al carrito" : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
