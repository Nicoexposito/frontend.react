import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:3000/api/usuari/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, contrasenya: password }),
            });
            const data = await res.json();
            if (data.status === "success") {
                localStorage.setItem("loggedUser", JSON.stringify(data.data.usuari));
                localStorage.setItem("token", data.data.token);
                navigate("/");
            } else {
                setError(data.message || "Credenciales incorrectas");
            }
        } catch {
            setError("Error de conexión con el servidor");
        }
    };

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
            <div style={{
                width: '100%',
                maxWidth: '380px',
                padding: '0 20px',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <span style={{
                            fontSize: '22px', fontWeight: '900',
                            letterSpacing: '0.1em', color: '#d4af37',
                        }}>⚽ EXPOMANIA</span>
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
                    padding: '32px',
                }}>
                    <h1 style={{
                        fontSize: '20px', fontWeight: '800', color: 'white',
                        margin: '0 0 20px', letterSpacing: '-0.01em',
                    }}>Iniciar sesión</h1>

                    {error && (
                        <div style={{
                            background: 'rgba(155,28,48,0.15)',
                            border: '1px solid rgba(155,28,48,0.4)',
                            color: '#fca5a5', padding: '10px 14px',
                            borderRadius: '10px', fontSize: '13px',
                            marginBottom: '16px',
                        }}>{error}</div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Correo electrónico
                            </label>
                            <input
                                type="email" value={email}
                                onChange={e => setEmail(e.target.value)} required
                                placeholder="tu@correo.com"
                                style={{
                                    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                                }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Contraseña
                            </label>
                            <input
                                type="password" value={password}
                                onChange={e => setPassword(e.target.value)} required
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '11px 14px', boxSizing: 'border-box',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none',
                                }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%', padding: '12px',
                                background: '#9a1c20', border: 'none',
                                borderRadius: '10px', color: 'white',
                                fontSize: '14px', fontWeight: '700',
                                cursor: 'pointer', marginTop: '4px',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.target.style.background = '#b02030'}
                            onMouseLeave={e => e.target.style.background = '#9a1c20'}
                        >
                            Entrar
                        </button>
                    </form>
                </div>

                {/* Footer links */}
                <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '20px' }}>
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" style={{ color: '#d4af37', fontWeight: '600', textDecoration: 'none' }}>
                        Regístrate
                    </Link>
                </p>
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Link to="/" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>
                        ← Volver a la tienda
                    </Link>
                </p>
            </div>
        </div>
    );
}