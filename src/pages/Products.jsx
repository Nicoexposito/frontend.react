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
                className="flex w-full items-center justify-between py-3 text-sm font-black uppercase text-emerald-950 transition-colors hover:text-[#9a1c20]"
            >
                {title}
                {isOpen
                    ? <ChevronUpIcon className="h-4 w-4 text-emerald-900/55" />
                    : <ChevronDownIcon className="h-4 w-4 text-emerald-900/55" />
                }
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"}`}
            >
                {children}
            </div>
            <hr className="border-emerald-900/10" />
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
            <div className="stadium-surface flex min-h-screen items-center justify-center py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <p className="rounded-lg bg-white/90 px-5 py-3 text-sm font-black uppercase text-emerald-950 shadow-xl animate-pulse">
                        {lang === "es" ? "Cargando camisetas..." : "Loading kits..."}
                    </p>
                </div>
            </div>
        );
    }

    // =========== COMPONENTE DE FILTROS SIDEBAR ===========
    const FilterSidebar = () => (
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)] pr-2 custom-scrollbar">
            {/* Header */}
            <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-white py-2">
                <h3 className="flex items-center gap-2 text-lg font-black text-emerald-950">
                    <FunnelIcon className="h-5 w-5" />
                    {lang === "es" ? "Filtros" : "Filters"}
                </h3>
                {activeFilterCount > 0 && (
                    <button onClick={clearAllFilters} className="text-xs font-black text-[#9a1c20] transition hover:text-red-700">
                        {lang === "es" ? "Limpiar" : "Clear"} ({activeFilterCount})
                    </button>
                )}
            </div>

            {/* Liga */}
            <FilterSection title={lang === "es" ? "Liga" : "League"} isOpen={openSections.liga} onToggle={() => toggleSection("liga")}>
                <div className="space-y-2">
                    {LIGAS.map(liga => (
                        <label key={liga} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedLigas.includes(liga)} onChange={() => toggleFilter(selectedLigas, setSelectedLigas, liga)} className="h-4 w-4 rounded border-emerald-900/20 text-emerald-700 focus:ring-emerald-700" />
                            <span className="text-sm font-medium text-emerald-950/70 transition group-hover:text-emerald-950">{liga}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Equipo */}
            <FilterSection title={lang === "es" ? "Equipo" : "Team"} isOpen={openSections.equipo} onToggle={() => toggleSection("equipo")}>
                <div className="space-y-2">
                    {availableTeams.map(team => (
                        <label key={team} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedTeams.includes(team)} onChange={() => toggleFilter(selectedTeams, setSelectedTeams, team)} className="h-4 w-4 rounded border-emerald-900/20 text-emerald-700 focus:ring-emerald-700" />
                            <span className="text-sm font-medium text-emerald-950/70 transition group-hover:text-emerald-950">{team}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Equipación */}
            <FilterSection title={lang === "es" ? "Equipación" : "Kit Type"} isOpen={openSections.equipacion} onToggle={() => toggleSection("equipacion")}>
                <div className="space-y-2">
                    {KIT_TYPES.map(kit => (
                        <label key={kit.value} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedTypes.includes(kit.value)} onChange={() => toggleFilter(selectedTypes, setSelectedTypes, kit.value)} className="h-4 w-4 rounded border-emerald-900/20 text-emerald-700 focus:ring-emerald-700" />
                            <span className="text-sm font-medium text-emerald-950/70 transition group-hover:text-emerald-950">{lang === "es" ? kit.es : kit.en}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Marca */}
            <FilterSection title={lang === "es" ? "Marca" : "Brand"} isOpen={openSections.marca} onToggle={() => toggleSection("marca")}>
                <div className="space-y-2">
                    {MARCAS.map(marca => (
                        <label key={marca} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={selectedMarcas.includes(marca)} onChange={() => toggleFilter(selectedMarcas, setSelectedMarcas, marca)} className="h-4 w-4 rounded border-emerald-900/20 text-emerald-700 focus:ring-emerald-700" />
                            <span className="text-sm font-medium text-emerald-950/70 transition group-hover:text-emerald-950">{marca}</span>
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
                                    ? "bg-emerald-50 border-emerald-700 text-emerald-900 ring-1 ring-emerald-700"
                                    : "bg-white text-emerald-950/75 border-emerald-900/15 hover:border-[#9a1c20]"
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
                            <input type="checkbox" checked={selectedPriceRanges.includes(idx)} onChange={() => toggleFilter(selectedPriceRanges, setSelectedPriceRanges, idx)} className="h-4 w-4 rounded border-emerald-900/20 text-emerald-700 focus:ring-emerald-700" />
                            <span className="text-sm font-medium text-emerald-950/70 transition group-hover:text-emerald-950">{range.label[lang]}</span>
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
                                    ? "bg-emerald-950 text-white border-emerald-950 shadow-sm"
                                    : "bg-white text-emerald-950/75 border-emerald-900/15 hover:border-[#9a1c20] hover:text-[#9a1c20]"
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
        <div className="min-h-screen bg-[#f5f7f2] pb-16 pt-24 text-emerald-950 sm:pt-28 sm:pb-24">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #9fb5a8; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6d8f7b; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #9fb5a8 transparent; }
            `}</style>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/8">
                    <div className="match-ticker px-5 py-2 text-xs font-black uppercase text-white">
                        {lang === "es" ? "Catalogo matchday - camisetas oficiales, alternativas y retro" : "Matchday catalog - home, away, third and retro shirts"}
                    </div>
                    <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-black uppercase text-[#9a1c20]">{lang === "es" ? "Tienda de equipaciones" : "Kit shop"}</p>
                            <h2 className="mt-1 text-4xl font-black text-emerald-950 sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>{t.products.title}</h2>
                            <p className="mt-2 max-w-2xl text-sm font-medium text-emerald-950/65">
                                {lang === "es" ? "Filtra por liga, equipo, marca, talla y color sin perder de vista la camiseta." : "Filter by league, club, brand, size, and color while keeping the shirt front and center."}
                            </p>
                        </div>
                        <button onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="flex items-center justify-center gap-2 rounded-lg border border-emerald-900/15 bg-emerald-950 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800 lg:hidden">
                            <FunnelIcon className="h-5 w-5" />
                            {lang === "es" ? "Filtros" : "Filters"}
                            {activeFilterCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f4c542] text-xs font-black text-emerald-950">{activeFilterCount}</span>}
                        </button>
                    </div>
                </div>

                {/* Filtros móvil */}
                {mobileFiltersOpen && (
                    <div className="mb-8 rounded-lg border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/8 lg:hidden">
                        <FilterSidebar />
                    </div>
                )}

                {/* Layout: Sidebar IZQUIERDA + Grid */}
                <div className="flex gap-8">
                    {/* Sidebar filtros — IZQUIERDA */}
                    <div className="hidden lg:block w-60 shrink-0">
                        <div className="sticky top-24 rounded-lg border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/8">
                            <FilterSidebar />
                        </div>
                    </div>

                    {/* Grid de productos */}
                    <div className="flex-1">
                        {productList.length === 0 ? (
                            <div className="rounded-lg border border-emerald-900/10 bg-white py-20 text-center shadow-xl shadow-emerald-950/8">
                                <FunnelIcon className="mx-auto h-12 w-12 text-emerald-900/35" />
                                <h3 className="mt-2 text-sm font-black text-emerald-950">{lang === "es" ? "No se encontraron productos" : "No products found"}</h3>
                                <p className="mt-1 text-sm text-emerald-950/60">{lang === "es" ? "Prueba a cambiar los filtros." : "Try changing the filters."}</p>
                                <button onClick={clearAllFilters} className="mt-4 text-sm font-black text-[#9a1c20] hover:text-red-700">{lang === "es" ? "Limpiar filtros" : "Clear filters"}</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-5">
                                {productList.map((product) => (
                                    <div key={product._id || product.id} className="product-card group relative cursor-pointer overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-lg shadow-emerald-950/8" onClick={() => openDetail(product)}>
                                        <div className="kit-image-stage relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden p-4">
                                            <img alt={product.imageAlt} src={product.imageSrc} className="product-image h-full w-full object-contain object-center drop-shadow-xl" />
                                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-700 via-[#f4c542] to-[#9a1c20]"></div>
                                            <span className="glass-dark absolute left-3 top-3 rounded-md px-3 py-1 text-[10px] font-black uppercase text-white/95 shadow-lg">{product.liga || "La Liga"}</span>
                                            <button onClick={(e) => handleAddToCart(e, product)} className="absolute bottom-3 right-3 z-20 rounded-lg bg-emerald-950 p-2.5 text-[#f4c542] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-[#f4c542] focus:ring-offset-2" title={lang === "es" ? "Añadir al carrito" : "Add to cart"}>
                                                <ShoppingCartIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <p className="mb-1 text-[11px] font-black uppercase text-[#9a1c20]">{product.equip}</p>
                                            <div className="flex justify-between items-start">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-sm font-black text-emerald-950">{product.name[lang]}</h3>
                                                    <p className="mt-1 text-xs font-semibold text-emerald-900/55">{product.color[lang]}</p>
                                                </div>
                                                <span className="ml-3 shrink-0 rounded-md bg-[#fff4cf] px-2.5 py-1 text-sm font-black text-[#8a6200]">{product.price}</span>
                                            </div>
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

                    <div className="custom-scrollbar relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeDetail} className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition hover:bg-emerald-50">
                            <XMarkIcon className="h-5 w-5 text-emerald-950" />
                        </button>

                        <div className="md:flex">
                            {/* Imagen */}
                            <div className="kit-image-stage flex items-center justify-center p-6 md:w-1/2">
                                <img src={selectedProduct.imageSrc} alt={selectedProduct.imageAlt} className="min-h-[300px] w-full object-contain object-center drop-shadow-2xl md:min-h-[460px]" />
                            </div>

                            {/* Info */}
                            <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
                                <div className="flex-1">
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="rounded-md bg-emerald-950 px-2.5 py-1 text-xs font-black text-white">{selectedProduct.equip}</span>
                                        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800">{selectedProduct.liga || "La Liga"}</span>
                                        <span className="rounded-md bg-[#fff4cf] px-2.5 py-1 text-xs font-black text-[#8a6200]">{selectedProduct.marca}</span>
                                    </div>

                                    <h2 className="mb-1 text-2xl font-black text-emerald-950">{selectedProduct.name[lang]}</h2>
                                    <p className="mb-4 text-sm font-bold text-[#9a1c20]">{selectedProduct.color[lang]}</p>
                                    <p className="mb-4 text-3xl font-black text-emerald-950">{selectedProduct.price}</p>

                                    {/* Color principal */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-sm text-emerald-950/65">{lang === "es" ? "Color:" : "Color:"}</span>
                                        <span
                                            className="inline-block h-4 w-4 rounded-full"
                                            style={{
                                                backgroundColor: COLORES.find(c => c.name === selectedProduct.colorPrincipal)?.hex || "#ccc",
                                                border: selectedProduct.colorPrincipal === "Blanco" ? "1.5px solid #d1d5db" : "none"
                                            }}
                                        />
                                        <span className="text-sm font-bold text-emerald-950">{selectedProduct.colorPrincipal}</span>
                                    </div>

                                    <p className="mb-4 text-sm leading-relaxed text-emerald-950/68">
                                        {typeof selectedProduct.descripcio === "object" ? selectedProduct.descripcio[lang] : selectedProduct.descripcio}
                                    </p>

                                    {/* Tallas */}
                                    <div className="mb-4">
                                        <h4 className="mb-2 text-sm font-black text-emerald-950">{lang === "es" ? "Tallas disponibles" : "Available Sizes"}</h4>
                                        <div className="flex gap-2">
                                            {SIZES.map(size => (
                                                <span key={size} className={`rounded-md border px-3 py-1.5 text-sm font-bold transition ${size === (selectedProduct.talla || "M") ? "bg-emerald-950 text-white border-emerald-950" : "bg-white text-emerald-950/70 border-emerald-900/15"}`}>{size}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Envío y devoluciones - DESPLEGABLE */}
                                    <div className="mb-4 rounded-lg border border-emerald-900/10">
                                        <button
                                            onClick={() => setShippingOpen(!shippingOpen)}
                                            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-black text-emerald-950 transition hover:bg-emerald-50"
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
                                                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-emerald-950/65">
                                                    {getShippingInfo(selectedProduct).content}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón añadir al carrito */}
                                <button
                                    onClick={(e) => { handleAddToCart(e, selectedProduct); closeDetail(); }}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-950 px-6 py-3.5 font-black text-white shadow-lg transition-all duration-200 hover:bg-emerald-800 hover:shadow-xl active:scale-[0.98]"
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
