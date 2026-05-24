import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ChartBarIcon, UsersIcon, ShoppingBagIcon, CurrencyEuroIcon, ArrowRightOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const API_URL = "http://localhost:3000/api";

const tabs = [
  { id: "resumen", label: "Resumen", icon: ChartBarIcon },
  { id: "productos", label: "Productos", icon: ShoppingBagIcon },
  { id: "usuarios", label: "Usuarios", icon: UsersIcon },
  { id: "ventas", label: "Ventas", icon: CurrencyEuroIcon },
];

const getStoredAdmin = () => {
  try {
    const stored = localStorage.getItem("loggedUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const formatMoney = (value) => {
  if (value === undefined || value === null || value === "") return "0€";
  const raw = String(value);
  return raw.includes("€") ? raw : `${raw}€`;
};

const statusClass = (status = "") => {
  const key = status.toLowerCase();
  if (key.includes("pag") || key.includes("paid") || key.includes("complet")) return "bg-emerald-100 text-emerald-800";
  if (key.includes("pend")) return "bg-[#fff4cf] text-[#8a6200]";
  if (key.includes("cancel") || key.includes("fail")) return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [stats, setStats] = useState(null);
  const [salesWeekly, setSalesWeekly] = useState(null);
  const [salesStatus, setSalesStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const adminUser = getStoredAdmin();

  useEffect(() => {
    if (!token || adminUser?.rol !== 'admin') {
      navigate("/login");
      return;
    }
    fetchStats();
    fetchCharts();
  }, [token, navigate, adminUser?.rol]);

  useEffect(() => {
    if (activeTab === 'productos') fetchProducts();
    if (activeTab === 'usuarios') fetchUsers();
    if (activeTab === 'ventas') fetchOrders();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') setStats(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchCharts = async () => {
    try {
      const resW = await fetch(`${API_URL}/admin/charts/sales-weekly`, { headers: { Authorization: `Bearer ${token}` } });
      const dataW = await resW.json();
      if (dataW.status === 'success') setSalesWeekly(dataW.data);

      const resS = await fetch(`${API_URL}/admin/charts/sales-status`, { headers: { Authorization: `Bearer ${token}` } });
      const dataS = await resS.json();
      if (dataS.status === 'success') setSalesStatus(dataS.data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (data.status === 'success') setProducts(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/usuari`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') setUsers(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/ventas/all`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 'success') setOrders(data.data);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Seguro que quieres eliminar este producto?")) return;
    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Seguro que quieres eliminar este usuario?")) return;
    try {
      await fetch(`${API_URL}/usuari/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const kpis = [
    { title: 'Ingresos', value: stats ? formatMoney(stats.totalIngressos) : '--', icon: CurrencyEuroIcon, tone: 'bg-emerald-50 text-emerald-700' },
    { title: 'Ventas', value: stats?.totalVendes ?? '--', icon: ShoppingBagIcon, tone: 'bg-[#fff4cf] text-[#8a6200]' },
    { title: 'Usuarios', value: stats?.totalUsuaris ?? '--', icon: UsersIcon, tone: 'bg-red-50 text-[#9a1c20]' },
    { title: 'Productos', value: stats?.totalProductes ?? '--', icon: ChartBarIcon, tone: 'bg-sky-50 text-sky-700' },
  ];

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#284236', boxWidth: 10 } },
      tooltip: { backgroundColor: '#06140d', titleColor: '#ffffff', bodyColor: '#ffffff' },
    },
    scales: {
      x: { ticks: { color: '#5e776b' }, grid: { color: 'rgba(15, 122, 67, 0.08)' } },
      y: { ticks: { color: '#5e776b' }, grid: { color: 'rgba(15, 122, 67, 0.08)' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#284236', boxWidth: 10 } },
      tooltip: { backgroundColor: '#06140d', titleColor: '#ffffff', bodyColor: '#ffffff' },
    },
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-emerald-950 lg:flex">
      <aside className="bg-[#06140d] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col">
        <div className="stadium-surface relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-[#06140d]/82" aria-hidden="true" />
          <div className="relative">
            <button onClick={() => navigate('/')} className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/80 transition hover:bg-white/15">
              <ArrowLeftIcon className="h-4 w-4" />
              Tienda
            </button>
            <p className="text-xs font-black uppercase text-[#f4c542]">Backoffice club</p>
            <h2 className="mt-1 text-3xl font-black">EXPOMANIA</h2>
            <p className="mt-2 text-sm text-white/60">{adminUser?.email || "Administrador"}</p>
          </div>
        </div>

        <nav className="grid gap-2 p-4 sm:grid-cols-4 lg:flex lg:flex-1 lg:flex-col">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition lg:justify-start ${selected ? 'bg-[#f4c542] text-emerald-950 shadow-lg shadow-black/20' : 'text-white/72 hover:bg-white/10 hover:text-white'}`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-black text-white/70 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 lg:justify-start">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="flex-1 p-5 sm:p-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-[#9a1c20]">Panel administrativo</p>
            <h1 className="mt-1 text-4xl font-black text-emerald-950">{tabs.find(tab => tab.id === activeTab)?.label}</h1>
          </div>
          <div className="rounded-lg border border-emerald-900/10 bg-white px-4 py-3 text-sm font-bold text-emerald-950/70 shadow-lg shadow-emerald-950/8">
            Control de catalogo, ventas y usuarios
          </div>
        </div>

        {activeTab === 'resumen' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.title} className="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-xl shadow-emerald-950/8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-black uppercase text-emerald-950/50">{kpi.title}</p>
                        <p className="mt-2 text-3xl font-black text-emerald-950">{kpi.value}</p>
                      </div>
                      <div className={`rounded-lg p-3 ${kpi.tone}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-xl shadow-emerald-950/8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-black">Ventas ultimos 7 dias</h3>
                  <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Semana</span>
                </div>
                <div className="h-80">
                  {salesWeekly ? (
                    <Bar data={{
                      labels: salesWeekly.labels,
                      datasets: [{ label: 'Ventas (€)', data: salesWeekly.totals, backgroundColor: '#0f7a43', borderRadius: 6 }]
                    }} options={barOptions} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-bold text-emerald-950/45">Sin datos de ventas</div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-xl shadow-emerald-950/8">
                <h3 className="mb-4 text-lg font-black">Estado de pedidos</h3>
                <div className="h-80">
                  {salesStatus && salesStatus.labels.length > 0 ? (
                    <Doughnut data={{
                      labels: salesStatus.labels,
                      datasets: [{ data: salesStatus.counts, backgroundColor: ['#0f7a43', '#f4c542', '#9a1c20', '#2563eb', '#111827', '#94a3b8'], borderWidth: 0 }]
                    }} options={doughnutOptions} />
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-950/45">No hay estados todavia.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'productos' && (
          <div className="animate-fade-in">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-black">Gestion de productos</h2>
              <button className="rounded-lg bg-emerald-950 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-800">Nuevo producto</button>
            </div>
            <div className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/8">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-emerald-950 text-xs font-black uppercase text-white/75">
                    <tr><th className="p-4">Equipo</th><th className="p-4">Precio</th><th className="p-4">Stock</th><th className="p-4">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/10">
                    {products.length === 0 && (
                      <tr><td colSpan="4" className="p-8 text-center text-sm font-bold text-emerald-950/45">No hay productos cargados.</td></tr>
                    )}
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-emerald-50/60">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="kit-image-stage relative overflow-hidden flex h-12 w-12 items-center justify-center rounded-md p-1">
                              <img src={p.imageSrc} alt="" className="h-full w-full object-contain" />
                            </div>
                            <div>
                              <p className="font-black text-emerald-950">{p.equip}</p>
                              <p className="text-xs font-semibold text-emerald-950/50">{p.marca || "Marca"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-black text-[#8a6200]">{formatMoney(p.preu)}</td>
                        <td className="p-4 font-bold">{p.stock ?? 0}</td>
                        <td className="p-4">
                          <div className="flex gap-3">
                            <button className="font-black text-sky-700 hover:underline">Editar</button>
                            <button onClick={() => deleteProduct(p._id)} className="font-black text-[#9a1c20] hover:underline">Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="animate-fade-in">
            <h2 className="mb-5 text-2xl font-black">Usuarios</h2>
            <div className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/8">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-emerald-950 text-xs font-black uppercase text-white/75">
                    <tr><th className="p-4">Nombre</th><th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4">Acciones</th></tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/10">
                    {users.length === 0 && (
                      <tr><td colSpan="4" className="p-8 text-center text-sm font-bold text-emerald-950/45">No hay usuarios cargados.</td></tr>
                    )}
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-emerald-50/60">
                        <td className="p-4 font-black">{u.nom} {u.primerCognom}</td>
                        <td className="p-4 text-emerald-950/70">{u.email}</td>
                        <td className="p-4"><span className={`rounded-md px-2 py-1 text-xs font-black ${u.rol === 'admin' ? 'bg-[#fff4cf] text-[#8a6200]' : 'bg-emerald-50 text-emerald-700'}`}>{u.rol}</span></td>
                        <td className="p-4">
                          <button onClick={() => deleteUser(u._id)} className="font-black text-[#9a1c20] hover:underline">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ventas' && (
          <div className="animate-fade-in">
            <h2 className="mb-5 text-2xl font-black">Ventas</h2>
            <div className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/8">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left">
                  <thead className="bg-emerald-950 text-xs font-black uppercase text-white/75">
                    <tr><th className="p-4">ID</th><th className="p-4">Fecha</th><th className="p-4">Usuario</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Estado</th></tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/10">
                    {orders.length === 0 && (
                      <tr><td colSpan="6" className="p-8 text-center text-sm font-bold text-emerald-950/45">No hay ventas cargadas.</td></tr>
                    )}
                    {orders.map(o => (
                      <tr key={o._id} className="hover:bg-emerald-50/60">
                        <td className="p-4 font-mono text-xs text-emerald-950/50">{o._id.slice(-6)}</td>
                        <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-emerald-950/70">{o.userId?.email || 'Desconocido'}</td>
                        <td className="p-4 text-sm font-bold">{o.items?.length || 0} productos</td>
                        <td className="p-4 font-black text-emerald-700">{formatMoney(o.total)}</td>
                        <td className="p-4"><span className={`rounded-md px-2 py-1 text-xs font-black capitalize ${statusClass(o.estat)}`}>{o.estat}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
