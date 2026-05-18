const fs = require('fs');
const path = 'c:/DAW2/FRAME/api/frontend-react/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace the dropdown
const ddStartTag = '<MenuItems className="absolute right-0 z-50 mt-3 w-64 origin-top-right focus:outline-none">';
const ddEndTag = '</MenuItems>';
const ddStartIdx = content.indexOf(ddStartTag);
const ddEndIdx = content.indexOf(ddEndTag, ddStartIdx) + ddEndTag.length;

if (ddStartIdx !== -1 && ddEndIdx !== -1) {
  const ddReplacement = `<MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right focus:outline-none">
  <div style={{ background: '#0d1a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
    {loggedUser ? (
      <>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: 0 }}>
            {loggedUser.nom} {loggedUser.primerCognom || ''}
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(212,175,55,0.7)', margin: '2px 0 0' }}>
            {loggedUser.rol === 'admin' ? 'Administrador' : 'Cliente'}
          </p>
        </div>
        <div style={{ padding: '6px' }}>
          <MenuItem>
            {({ active }) => (
              <Link to="/profile" style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? 'white' : 'rgba(255,255,255,0.7)', background: active ? 'rgba(255,255,255,0.05)' : 'transparent', textDecoration: 'none' }}>Mi Perfil</Link>
            )}
          </MenuItem>
          {loggedUser.rol === 'admin' && (
            <MenuItem>
              {({ active }) => (
                <Link to="/admin" style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? '#d4af37' : 'rgba(212,175,55,0.7)', background: active ? 'rgba(212,175,55,0.05)' : 'transparent', textDecoration: 'none' }}>Panel Admin</Link>
              )}
            </MenuItem>
          )}
          <MenuItem>
            {({ active }) => (
              <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? '#f87171' : 'rgba(248,113,113,0.7)', background: active ? 'rgba(248,113,113,0.05)' : 'transparent', border: 'none', cursor: 'pointer' }}>Cerrar Sesión</button>
            )}
          </MenuItem>
        </div>
      </>
    ) : (
      <div style={{ padding: '6px' }}>
        <MenuItem>
          {({ active }) => (
            <Link to="/login" style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? 'white' : 'rgba(255,255,255,0.7)', background: active ? 'rgba(255,255,255,0.05)' : 'transparent', textDecoration: 'none' }}>Iniciar Sesión</Link>
          )}
        </MenuItem>
        <MenuItem>
          {({ active }) => (
            <Link to="/register" style={{ display: 'block', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: active ? 'white' : 'rgba(255,255,255,0.7)', background: active ? 'rgba(255,255,255,0.05)' : 'transparent', textDecoration: 'none' }}>Registrarse</Link>
          )}
        </MenuItem>
      </div>
    )}
  </div>
</MenuItems>`;
  content = content.substring(0, ddStartIdx) + ddReplacement + content.substring(ddEndIdx);
} else {
  console.log("Could not find dropdown");
}

// 2. Navigation array
const navSearch = `const navigation = [
  { name: "home", href: "home" },
  { name: "about", href: "about" },
  { name: "products", href: "products" },
  { name: "retros", href: "retros" },
  { name: "contact", href: "contact" },
];`;
const navReplace = `const navigation = [
  { name: "home", href: "home" },
  { name: "products", href: "products" },
  { name: "retros", href: "retros" },
  { name: "about", href: "about" },
];`;
content = content.replace(navSearch, navReplace);

// 3. About & Contact sections
const oldAboutStart = '{section === "about" && (';
const oldContactEnd = '      </main>';
const idxAbout = content.indexOf(oldAboutStart);
const idxMainEnd = content.indexOf(oldContactEnd, idxAbout);

if (idxAbout !== -1 && idxMainEnd !== -1) {
  const newAboutSection = `{section === "about" && (
          <section className="min-h-screen bg-[#0d1a12] pt-28 text-white">
            <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
              <div className="text-center mb-16">
                <p className="text-sm font-black uppercase tracking-widest text-[#d4af37] mb-4">EXPOMANIA CLUBHOUSE</p>
                <h2 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl text-white">
                  Más que una tienda, <br/>
                  <span className="text-[#9a1c20]">nuestra pasión.</span>
                </h2>
                <p className="mt-6 text-lg leading-8 text-white/70 max-w-2xl mx-auto">
                  Fundada por y para verdaderos amantes del fútbol. Nos dedicamos a conseguir, clasificar y entregar las mejores camisetas con la máxima calidad y una experiencia de compra impecable. 
                </p>
              </div>

              <div className="grid gap-12 lg:grid-cols-2 items-start mt-12">
                <div className="bg-[#15291d] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/50">
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="text-[#d4af37]">01.</span> Nuestra Misión
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    Creemos que cada camiseta cuenta una historia. Nuestro objetivo es llevar esa historia a tus manos con el mejor servicio, transparencia total y envíos rápidos en 24h.
                  </p>
                  <ul className="space-y-4 text-white/80 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="text-[#9a1c20]">✓</span> Calidad 100% garantizada
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#9a1c20]">✓</span> Proceso de compra seguro
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-[#9a1c20]">✓</span> Catálogo cuidadosamente seleccionado
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#9a1c20] to-[#6a1015] border border-red-900/50 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-red-900/20">
                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="text-[#d4af37]">02.</span> Contacto y Soporte
                  </h3>
                  <p className="text-white/90 leading-relaxed mb-8">
                    ¿Dudas sobre tallas, envíos o pedidos especiales? Nuestro equipo está listo para ayudarte antes, durante y después de tu compra.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl">
                      <div className="bg-[#d4af37]/20 p-3 rounded-lg text-[#d4af37]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-white/60 tracking-wider">Email</p>
                        <p className="font-semibold text-white">support@expomania.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-black/20 p-4 rounded-xl">
                      <div className="bg-[#d4af37]/20 p-3 rounded-lg text-[#d4af37]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-white/60 tracking-wider">Horario de Atención</p>
                        <p className="font-semibold text-white">Lunes a Viernes / 9:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
`;
  content = content.substring(0, idxAbout) + newAboutSection + '\n' + content.substring(idxMainEnd);
} else {
  console.log("Could not find about section");
}

fs.writeFileSync(path, content, 'utf8');

// Also translations.js just in case
const transPath = 'c:/DAW2/FRAME/api/frontend-react/src/pages/translations.js';
let transContent = fs.readFileSync(transPath, 'utf8');
if (transContent.includes('contact: "Contacto",')) {
    transContent = transContent.replace(/about: "Sobre nosotros",\s+products: "Productos",\s+retros: "Retros",\s+contact: "Contacto",/g, 'products: "Productos",\n            retros: "Retros",\n            about: "Sobre nosotros / Contacto",');
    fs.writeFileSync(transPath, transContent, 'utf8');
}

console.log("Script executed!");
