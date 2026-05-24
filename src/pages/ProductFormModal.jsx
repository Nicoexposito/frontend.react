import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ProductFormModal({ isOpen, onClose, product, onSave, token }) {
  const [formData, setFormData] = useState({
    name: { en: "", es: "" },
    equip: "",
    color: { en: "", es: "" },
    talla: "M",
    preu: "",
    stock: 100,
    imageSrc: "",
    imageAlt: "",
    liga: "La Liga",
    marca: "Adidas",
    colorPrincipal: "Blanco",
    descripcio: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: {
          en: product.name?.en || "",
          es: product.name?.es || "",
        },
        equip: product.equip || "",
        color: {
          en: product.color?.en || "",
          es: product.color?.es || "",
        },
        talla: product.talla || "M",
        preu: product.preu || "",
        stock: product.stock ?? 100,
        imageSrc: product.imageSrc || "",
        imageAlt: product.imageAlt || "",
        liga: product.liga || "La Liga",
        marca: product.marca || "Adidas",
        colorPrincipal: product.colorPrincipal || "Blanco",
        descripcio: product.descripcio || "",
      });
    } else {
      // Reset form
      setFormData({
        name: { en: "", es: "" },
        equip: "",
        color: { en: "", es: "" },
        talla: "M",
        preu: "",
        stock: 100,
        imageSrc: "",
        imageAlt: "",
        liga: "La Liga",
        marca: "Adidas",
        colorPrincipal: "Blanco",
        descripcio: "",
      });
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "stock" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const isEdit = !!product;
    const url = isEdit
      ? `http://localhost:3000/api/products/${product._id}`
      : `http://localhost:3000/api/products`;
    
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        onSave();
        onClose();
      } else {
        setError(data.message || "Error al guardar el producto");
      }
    } catch (err) {
      setError("Error de red. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-900/10 bg-white px-6 py-4">
          <h3 className="text-xl font-black text-emerald-950">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-emerald-950/50 transition hover:bg-emerald-50 hover:text-emerald-950"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name EN */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Nombre (EN)</label>
                <input
                  required
                  type="text"
                  name="name.en"
                  value={formData.name.en}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Name ES */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Nombre (ES)</label>
                <input
                  required
                  type="text"
                  name="name.es"
                  value={formData.name.es}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Equip */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Equipo</label>
                <input
                  required
                  type="text"
                  name="equip"
                  value={formData.equip}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Talla */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Talla</label>
                <select
                  name="talla"
                  value={formData.talla}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>

              {/* Color EN */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Tipo/Color (EN)</label>
                <input
                  required
                  type="text"
                  name="color.en"
                  value={formData.color.en}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Color ES */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Tipo/Color (ES)</label>
                <input
                  required
                  type="text"
                  name="color.es"
                  value={formData.color.es}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Preu */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Precio (ej. 89.99)</label>
                <input
                  required
                  type="text"
                  name="preu"
                  value={formData.preu}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Stock</label>
                <input
                  required
                  type="number"
                  min="0"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Image Src */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">URL de Imagen</label>
                <input
                  required
                  type="text"
                  name="imageSrc"
                  value={formData.imageSrc}
                  onChange={handleChange}
                  placeholder="/images/product.jpg"
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Image Alt */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Texto Alt de Imagen</label>
                <input
                  required
                  type="text"
                  name="imageAlt"
                  value={formData.imageAlt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              
              {/* Liga */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Liga</label>
                <input
                  type="text"
                  name="liga"
                  value={formData.liga}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Color Principal */}
              <div>
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Color Principal</label>
                <input
                  type="text"
                  name="colorPrincipal"
                  value={formData.colorPrincipal}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Descripcio */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-emerald-950/70">Descripción</label>
                <textarea
                  name="descripcio"
                  value={formData.descripcio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-emerald-900/20 bg-emerald-50/30 p-2.5 text-emerald-950 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                ></textarea>
              </div>

            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-emerald-900/10 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-6 py-2.5 text-sm font-bold text-emerald-950 hover:bg-emerald-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-emerald-950 px-6 py-2.5 text-sm font-black text-white hover:bg-emerald-800 disabled:opacity-70"
              >
                {isLoading ? "Guardando..." : "Guardar Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
