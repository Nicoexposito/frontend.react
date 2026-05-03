import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ChartBarIcon, UsersIcon, ShoppingBagIcon, CurrencyEuroIcon, ArrowRightOnRectangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const API_URL = "http://localhost:3000/api";

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
  const adminUser = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    if (!token || adminUser?.rol !== 'admin') {
      navigate("/login");
      return;
    }
    fetchStats();
    fetchCharts();
  }, [token, navigate, adminUser]);

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
    if(!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
        await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (id) => {
    if(!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
        await fetch(`${API_URL}/usuari/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col shadow-2xl">
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">EXPOMANIA</h2>
        </div>
        <nav className="flex-1 space-y-2">
          {['resumen', 'productos', 'usuarios', 'ventas'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'hover:bg-gray-700'}`}
            >
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition">
          <ArrowRightOnRectangleIcon className="w-5 h-5" /> Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'resumen' && stats && (
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold">Resumen del Panel</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Total Ingresos', value: `€${stats.totalIngressos}`, icon: CurrencyEuroIcon, color: 'text-green-400' },
                { title: 'Ventas Totales', value: stats.totalVendes, icon: ShoppingBagIcon, color: 'text-indigo-400' },
                { title: 'Usuarios', value: stats.totalUsuaris, icon: UsersIcon, color: 'text-pink-400' },
                { title: 'Productos', value: stats.totalProductes, icon: ChartBarIcon, color: 'text-blue-400' }
              ].map((kpi, i) => (
                <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gray-700/50 ${kpi.color}`}>
                      <kpi.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">{kpi.title}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {salesWeekly && (
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4">Ventas Últimos 7 Días</h3>
                  <Bar data={{
                    labels: salesWeekly.labels,
                    datasets: [{ label: 'Ventas (€)', data: salesWeekly.totals, backgroundColor: 'rgba(99, 102, 241, 0.8)' }]
                  }} options={{ responsive: true }} />
                </div>
              )}
              {salesStatus && salesStatus.labels.length > 0 ? (
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-4 w-full text-left">Estado de Pedidos</h3>
                  <div className="w-2/3">
                    <Doughnut data={{
                      labels: salesStatus.labels,
                      datasets: [{ data: salesStatus.counts, backgroundColor: ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa'] }]
                    }} />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl flex flex-col items-center justify-center text-gray-500">
                  <p>No hay datos de estados de pedidos todavía.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'productos' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Productos</h1>
                {/* Añadir funcionalidad de creación en un futuro modal */}
                <button className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500">Nuevo Producto</button>
            </div>
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50">
                  <tr><th className="p-4">Equipo</th><th className="p-4">Precio</th><th className="p-4">Stock</th><th className="p-4">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-gray-700/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.imageSrc} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        {p.equip}
                      </td>
                      <td className="p-4">€{p.preu}</td>
                      <td className="p-4">{p.stock}</td>
                      <td className="p-4 flex gap-2">
                          <button className="text-blue-400 hover:underline">Editar</button>
                          <button onClick={() => deleteProduct(p._id)} className="text-red-400 hover:underline">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50">
                  <tr><th className="p-4">Nombre</th><th className="p-4">Email</th><th className="p-4">Rol</th><th className="p-4">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-700/50">
                      <td className="p-4">{u.nom} {u.primerCognom}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-xs ${u.rol === 'admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-600'}`}>{u.rol}</span></td>
                      <td className="p-4">
                        <button onClick={() => deleteUser(u._id)} className="text-red-400 hover:underline">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ventas' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">Ventas</h1>
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-900/50">
                  <tr><th className="p-4">ID</th><th className="p-4">Fecha</th><th className="p-4">Usuario</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Estado</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orders.map(o => (
                    <tr key={o._id} className="hover:bg-gray-700/50">
                      <td className="p-4 text-xs font-mono text-gray-400">{o._id.slice(-6)}</td>
                      <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">{o.userId?.email || 'Desconocido'}</td>
                      <td className="p-4 text-sm">{o.items?.length || 0} productos</td>
                      <td className="p-4 font-bold text-green-400">€{o.total}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-gray-700 rounded text-xs capitalize">{o.estat}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
