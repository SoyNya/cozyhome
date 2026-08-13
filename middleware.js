// Protección de acceso para Casa — Sonia
// Pide usuario y contraseña ANTES de enviar el archivo al navegador.
// Si no se introducen correctamente, no se envía ni una sola línea del HTML.

export const config = {
  matcher: '/:path*',
};

const USER = 'SoyNya';
const PASS = 'Artia100%';

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const encoded = authHeader.split(' ')[1] || '';
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(':');
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    if (user === USER && pass === PASS) {
      return; // credenciales correctas: deja pasar la petición
    }
  }

  return new Response('Acceso restringido. Introduce el usuario y la contraseña.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Casa — Sonia", charset="UTF-8"',
    },
  });
}
