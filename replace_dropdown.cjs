const fs = require('fs');
const path = 'c:/DAW2/FRAME/api/frontend-react/src/pages/Home.jsx';
let content = fs.readFileSync(path, 'utf8');

const startTag = '<MenuItems className="absolute right-0 z-50 mt-3 w-64 origin-top-right focus:outline-none">';
const endTag = '</MenuItems>';

const startIdx = content.indexOf(startTag);
const endIdx = content.indexOf(endTag, startIdx) + endTag.length;

if (startIdx === -1 || endIdx === -1) {
    console.log('Could not find tags. StartIdx:', startIdx, 'EndIdx:', endIdx);
    process.exit(1);
}

const replacement = `<MenuItems className="absolute right-0 z-50 mt-2 w-48 origin-top-right focus:outline-none">
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

content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
fs.writeFileSync(path, content, 'utf8');
console.log('Success!');
