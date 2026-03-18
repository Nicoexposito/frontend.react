import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [nom, setNom] = useState("");
    const [primerCognom, setPrimerCognom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rol, setRol] = useState("client");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/usuari/registre", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nom,
                    primerCognom,
                    email,
                    contrasenya: password,
                    rol,
                }),
            });
            const data = await res.json();

            if (data.status === "success") {
                setSuccess("Registro exitoso. Redirigiendo al login...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(data.message || "Error en el registro");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                                placeholder="Nico"
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                                type="text"
                                value={primerCognom}
                                onChange={(e) => setPrimerCognom(e.target.value)}
                                required
                                placeholder="Exposito"
                                className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Registrando..." : "Register"}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}