import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [nom, setNom] = useState("");
    const [primerCognom, setPrimerCognom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
                body: JSON.stringify({ nom, primerCognom, email, contrasenya: password, rol: "client" }),
            });
            const data = await res.json();
            if (data.status === "success") {
                setSuccess("Registro exitoso. Redirigiendo...");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(data.message || "Error en el registro");
            }
        } catch {
            setError("Error de conexión con el servidor");
        }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%', padding: '11px 14px', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
    };
    const labelStyle = {
        display: 'block', fontSize: '12px', fontWeight: '600',
        color: 'rgba(255,255,255,0.5)', marginBottom: '6px',
        letterSpacing: '0.05em', textTransform: 'uppercase',
    };
    const onFocus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; };
    const onBlur  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; };

    return (
        <div style={{
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d1a12',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{ width: '100%', maxWidth: '420px', padding: '0 20px' }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '0.1em', color: '#d4af37' }}>
                            ⚽ EXPOMANIA
                        </span>
                    </Link>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: '6px 0 0' }}>
                        Tienda de camisetas de fútbol
                    </p>
                </div>

                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '16px',
                    padding: '28px 32px',
                }}>
                    <h1 style={{
                        fontSize: '20px', fontWeight: '800', color: 'white',
                        margin: '0 0 18px', letterSpacing: '-0.01em',
                    }}>Crear cuenta</h1>

                    {error && (
                        <div style={{
                            background: 'rgba(155,28,48,0.15)', border: '1px solid rgba(155,28,48,0.4)',
                            color: '#fca5a5', padding: '10px 14px', borderRadius: '10px',
                            fontSize: '13px', marginBottom: '14px',
                        }}>{error}</div>
                    )}
                    {success && (
                        <div style={{
                            background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                            color: '#6ee7b7', padding: '10px 14px', borderRadius: '10px',
                            fontSize: '13px', marginBottom: '14px',
                        }}>{success}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Nombre + Apellido */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label style={labelStyle}>Nombre</label>
                                <input type="text" value={nom} onChange={e => setNom(e.target.value)}
                                    required placeholder="Nico" style={inputStyle}
                                    onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Apellido</label>
                                <input type="text" value={primerCognom} onChange={e => setPrimerCognom(e.target.value)}
                                    required placeholder="Gómez" style={inputStyle}
                                    onFocus={onFocus} onBlur={onBlur} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Correo electrónico</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                required placeholder="tu@correo.com" style={inputStyle}
                                onFocus={onFocus} onBlur={onBlur} />
                        </div>

                        <div>
                            <label style={labelStyle}>Contraseña</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                required minLength={6} placeholder="Mín. 6 caracteres" style={inputStyle}
                                onFocus={onFocus} onBlur={onBlur} />
                        </div>

                        <div>
                            <label style={labelStyle}>Confirmar contraseña</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                required minLength={6} placeholder="Repite tu contraseña" style={inputStyle}
                                onFocus={onFocus} onBlur={onBlur} />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '12px',
                                background: loading ? 'rgba(155,28,48,0.5)' : '#9a1c20',
                                border: 'none', borderRadius: '10px',
                                color: 'white', fontSize: '14px', fontWeight: '700',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                marginTop: '4px', transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { if (!loading) e.target.style.background = '#b02030'; }}
                            onMouseLeave={e => { if (!loading) e.target.style.background = '#9a1c20'; }}
                        >
                            {loading ? 'Registrando...' : 'Crear cuenta'}
                        </button>
                    </form>
                </div>

                {/* Footer links */}
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '18px' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={{ color: '#d4af37', fontWeight: '600', textDecoration: 'none' }}>
                        Inicia sesión
                    </Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: '8px' }}>
                    <Link to="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
                        ← Volver a la tienda
                    </Link>
                </p>
            </div>
        </div>
    );
}