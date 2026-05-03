import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, UserCircleIcon, KeyIcon, CameraIcon, ShieldCheckIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

const API_URL = "http://localhost:3000/api";

const tabs = [
  { id: "personal", icon: UserCircleIcon },
  { id: "orders", icon: ShoppingBagIcon },
  { id: "password", icon: KeyIcon },
  { id: "avatar", icon: CameraIcon },
  { id: "privacy", icon: ShieldCheckIcon },
];

const tabLabels = {
  en: { personal: "Personal Data", orders: "My Orders", password: "Password", avatar: "Profile Photo", privacy: "Privacy" },
  es: { personal: "Datos Personales", orders: "Mis Compras", password: "Contraseña", avatar: "Foto de Perfil", privacy: "Privacidad" },
};

const t = {
  en: {
    title: "My Profile",
    back: "Back to Store",
    save: "Save Changes",
    saving: "Saving...",
    saved: "Saved!",
    nom: "First Name",
    primerCognom: "Last Name",
    segonCognom: "Second Last Name",
    email: "Email",
    telefon: "Phone",
    emailReadonly: "Email cannot be changed",
    currentPass: "Current Password",
    newPass: "New Password",
    confirmPass: "Confirm Password",
    changePass: "Change Password",
    passChanged: "Password changed successfully!",
    passMismatch: "Passwords do not match",
    uploadPhoto: "Upload Photo",
    removePhoto: "Remove Photo",
    dragDrop: "Drag & drop or click to upload",
    maxSize: "Max 500KB · JPG, PNG",
    showEmail: "Show email publicly",
    showPhone: "Show phone publicly",
    publicProfile: "Public profile",
    showEmailDesc: "Other users can see your email address",
    showPhoneDesc: "Other users can see your phone number",
    publicProfileDesc: "Your profile is visible to everyone",
    privacySaved: "Privacy settings saved!",
    loginRequired: "Please log in to view your profile",
    goLogin: "Go to Login",
    noOrders: "You haven't made any purchases yet",
    noOrdersDesc: "Once you complete a purchase, it will appear here.",
    goShopping: "Go Shopping",
    orderNum: "Order",
    orderDate: "Date",
    orderTotal: "Total",
    orderStatus: "Status",
    orderItems: "items",
    loadingOrders: "Loading orders...",
  },
  es: {
    title: "Mi Perfil",
    back: "Volver a la Tienda",
    save: "Guardar Cambios",
    saving: "Guardando...",
    saved: "¡Guardado!",
    nom: "Nombre",
    primerCognom: "Primer Apellido",
    segonCognom: "Segundo Apellido",
    email: "Email",
    telefon: "Teléfono",
    emailReadonly: "El email no se puede cambiar",
    currentPass: "Contraseña Actual",
    newPass: "Nueva Contraseña",
    confirmPass: "Confirmar Contraseña",
    changePass: "Cambiar Contraseña",
    passChanged: "¡Contraseña cambiada correctamente!",
    passMismatch: "Las contraseñas no coinciden",
    uploadPhoto: "Subir Foto",
    removePhoto: "Eliminar Foto",
    dragDrop: "Arrastra o haz clic para subir",
    maxSize: "Máx 500KB · JPG, PNG",
    showEmail: "Mostrar email públicamente",
    showPhone: "Mostrar teléfono públicamente",
    publicProfile: "Perfil público",
    showEmailDesc: "Otros usuarios pueden ver tu email",
    showPhoneDesc: "Otros usuarios pueden ver tu teléfono",
    publicProfileDesc: "Tu perfil es visible para todos",
    privacySaved: "¡Configuración de privacidad guardada!",
    loginRequired: "Inicia sesión para ver tu perfil",
    goLogin: "Ir al Login",
    noOrders: "Aún no has realizado ninguna compra",
    noOrdersDesc: "Cuando completes una compra, aparecerá aquí.",
    goShopping: "Ir a Comprar",
    orderNum: "Pedido",
    orderDate: "Fecha",
    orderTotal: "Total",
    orderStatus: "Estado",
    orderItems: "artículos",
    loadingOrders: "Cargando pedidos...",
  },
};

export default function Profile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ nom: "", primerCognom: "", segonCognom: "", telefon: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [privacy, setPrivacy] = useState({ mostrarEmail: false, mostrarTelefon: false, perfilPublic: false });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const token = localStorage.getItem("token");
  const labels = t[lang];
  const tTabs = tabLabels[lang];

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API_URL}/ventas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") setOrders(data.data || []);
    } catch (e) { console.error("Error loading orders:", e); }
    setOrdersLoading(false);
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status === "success") {
        setProfile(data.data);
        setForm({ nom: data.data.nom || "", primerCognom: data.data.primerCognom || "", segonCognom: data.data.segonCognom || "", telefon: data.data.telefon || "" });
        setPrivacy(data.data.privacitat || { mostrarEmail: false, mostrarTelefon: false, perfilPublic: false });
        setAvatarPreview(data.data.imatgePerfil || "");
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const showMsg = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(""); } else { setSuccess(msg); setError(""); }
    setTimeout(() => { setSuccess(""); setError(""); }, 3000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/profile/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === "success") { setProfile(data.data); showMsg(labels.saved); }
      else showMsg(data.message, true);
    } catch (e) { showMsg(e.message, true); }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) { showMsg(labels.passMismatch, true); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/profile/me/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword }),
      });
      const data = await res.json();
      if (data.status === "success") { showMsg(labels.passChanged); setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
      else showMsg(data.message, true);
    } catch (e) { showMsg(e.message, true); }
    setSaving(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) { showMsg("File too large (max 500KB)", true); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      setAvatarPreview(base64);
      try {
        const res = await fetch(`${API_URL}/profile/me/avatar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ imatgePerfil: base64 }),
        });
        const data = await res.json();
        if (data.status === "success") showMsg(labels.saved);
        else showMsg(data.message, true);
      } catch (e) { showMsg(e.message, true); }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    setAvatarPreview("");
    try {
      await fetch(`${API_URL}/profile/me/avatar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imatgePerfil: "" }),
      });
      showMsg(labels.saved);
    } catch (e) { showMsg(e.message, true); }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/profile/me/privacy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(privacy),
      });
      const data = await res.json();
      if (data.status === "success") showMsg(labels.privacySaved);
      else showMsg(data.message, true);
    } catch (e) { showMsg(e.message, true); }
    setSaving(false);
  };

  const getInitials = () => {
    if (!profile) return "?";
    return (profile.nom?.[0] || "") + (profile.primerCognom?.[0] || "");
  };

  // Not logged in — redirect handled in useEffect

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition font-medium">
            <ArrowLeftIcon className="h-5 w-5" /> {labels.back}
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{labels.title}</h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Toast messages */}
      {(success || error) && (
        <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
          <div className={`px-5 py-3 rounded-xl shadow-lg font-medium text-sm ${success ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {success || error}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              {/* Avatar */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-100" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-indigo-100">
                    {getInitials()}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{profile?.nom} {profile?.primerCognom}</h3>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase">{profile?.rol}</span>

              {/* Tab navigation */}
              <nav className="mt-6 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${isActive ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                    >
                      <Icon className="h-5 w-5" />
                      {tTabs[tab.id]}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

              {/* PERSONAL DATA TAB */}
              {activeTab === "personal" && (
                <form onSubmit={handleSaveProfile}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{tTabs.personal}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label={labels.nom} value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} required />
                    <Field label={labels.primerCognom} value={form.primerCognom} onChange={(v) => setForm({ ...form, primerCognom: v })} required />
                    <Field label={labels.segonCognom} value={form.segonCognom} onChange={(v) => setForm({ ...form, segonCognom: v })} />
                    <Field label={labels.telefon} value={form.telefon} onChange={(v) => setForm({ ...form, telefon: v })} pattern="\d{9}" />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{labels.email}</label>
                      <input type="email" value={profile?.email || ""} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" />
                      <p className="text-xs text-gray-400 mt-1">{labels.emailReadonly}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={saving} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 disabled:opacity-50 transition shadow-sm">
                      {saving ? labels.saving : labels.save}
                    </button>
                  </div>
                </form>
              )}

              {/* PASSWORD TAB */}
              {activeTab === "password" && (
                <form onSubmit={handleChangePassword}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{tTabs.password}</h2>
                  <div className="max-w-md space-y-5">
                    <Field label={labels.currentPass} value={passForm.currentPassword} onChange={(v) => setPassForm({ ...passForm, currentPassword: v })} type="password" required />
                    <Field label={labels.newPass} value={passForm.newPassword} onChange={(v) => setPassForm({ ...passForm, newPassword: v })} type="password" required minLength={6} />
                    <Field label={labels.confirmPass} value={passForm.confirmPassword} onChange={(v) => setPassForm({ ...passForm, confirmPassword: v })} type="password" required minLength={6} />
                  </div>
                  <div className="mt-8">
                    <button type="submit" disabled={saving} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 disabled:opacity-50 transition shadow-sm">
                      {saving ? labels.saving : labels.changePass}
                    </button>
                  </div>
                </form>
              )}

              {/* AVATAR TAB */}
              {activeTab === "avatar" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{tTabs.avatar}</h2>
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40 mb-6">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-40 h-40 rounded-full object-cover ring-4 ring-indigo-100 shadow-lg" />
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold ring-4 ring-indigo-100 shadow-lg">
                          {getInitials()}
                        </div>
                      )}
                    </div>
                    <div
                      onClick={() => fileRef.current?.click()}
                      className="w-full max-w-sm border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
                    >
                      <CameraIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700">{labels.dragDrop}</p>
                      <p className="text-xs text-gray-400 mt-1">{labels.maxSize}</p>
                      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => fileRef.current?.click()} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition shadow-sm">
                        {labels.uploadPhoto}
                      </button>
                      {avatarPreview && (
                        <button onClick={handleRemoveAvatar} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition">
                          {labels.removePhoto}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{tTabs.privacy}</h2>
                  <div className="space-y-4 max-w-lg">
                    <Toggle label={labels.showEmail} desc={labels.showEmailDesc} checked={privacy.mostrarEmail} onChange={(v) => setPrivacy({ ...privacy, mostrarEmail: v })} />
                    <Toggle label={labels.showPhone} desc={labels.showPhoneDesc} checked={privacy.mostrarTelefon} onChange={(v) => setPrivacy({ ...privacy, mostrarTelefon: v })} />
                    <Toggle label={labels.publicProfile} desc={labels.publicProfileDesc} checked={privacy.perfilPublic} onChange={(v) => setPrivacy({ ...privacy, perfilPublic: v })} />
                  </div>
                  <div className="mt-8">
                    <button onClick={handleSavePrivacy} disabled={saving} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 disabled:opacity-50 transition shadow-sm">
                      {saving ? labels.saving : labels.save}
                    </button>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{tTabs.orders}</h2>
                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">{labels.noOrders}</h3>
                      <p className="text-sm text-gray-500 mb-6">{labels.noOrdersDesc}</p>
                      <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition">{labels.goShopping}</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderCard key={order._id} order={order} labels={labels} lang={lang} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}

/* Reusable Field component */
function Field({ label, value, onChange, type = "text", required, minLength, pattern, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        required={required} minLength={minLength} pattern={pattern} disabled={disabled}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}

/* Reusable Toggle component */
function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <p className="font-medium text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-gray-300"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

/* OrderCard component */
const statusColors = {
  pendent: "bg-yellow-100 text-yellow-800",
  pagat: "bg-blue-100 text-blue-800",
  completada: "bg-green-100 text-green-800",
  enviada: "bg-purple-100 text-purple-800",
  entregada: "bg-green-100 text-green-800",
  "cancel·lada": "bg-red-100 text-red-800",
};
const statusLabels = {
  en: { pendent: "Pending", pagat: "Paid", completada: "Completed", enviada: "Shipped", entregada: "Delivered", "cancel·lada": "Cancelled" },
  es: { pendent: "Pendiente", pagat: "Pagado", completada: "Completada", enviada: "Enviada", entregada: "Entregada", "cancel·lada": "Cancelada" },
};

function OrderCard({ order, labels, lang }) {
  const date = new Date(order.createdAt).toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {
    year: "numeric", month: "long", day: "numeric"
  });
  const color = statusColors[order.estat] || "bg-gray-100 text-gray-800";
  const statusText = statusLabels[lang]?.[order.estat] || order.estat;

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900">{labels.orderNum} #{order._id.slice(-6).toUpperCase()}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>{statusText}</span>
        </div>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <div className="space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {item.productId?.imageSrc && (
                <img src={item.productId.imageSrc} alt={item.nom} className="w-10 h-10 rounded-lg object-cover" />
              )}
              <span className="text-gray-700">{item.nom} <span className="text-gray-400">×{item.quantitat}</span></span>
            </div>
            <span className="font-medium text-gray-900">{(item.preu * item.quantitat).toFixed(2)}€</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">{order.items.length} {labels.orderItems}</span>
        <span className="font-bold text-gray-900">{labels.orderTotal}: {order.total?.toFixed(2)}€</span>
      </div>
    </div>
  );
}
