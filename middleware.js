// Protección de acceso para Casa — Sonia
// Muestra una pantalla de acceso propia (usuario + contraseña) antes de servir
// cualquier contenido. Al acertar, guarda una cookie de sesión válida 1 año.

export const config = {
  matcher: '/:path*',
};

const USER = 'SoyNya';
const PASS = 'Artia100%';
const COOKIE_NAME = 'casa_auth';
const COOKIE_VALUE = 'ok-' + btoa(USER + ':' + PASS).replace(/=/g, '');

function loginPageHtml(showError) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Acceso — Casa</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  *{ box-sizing:border-box; }
  body{
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    background:#EEF4E9; display:flex; align-items:center; justify-content:center;
    min-height:100vh; margin:0; padding:20px;
  }
  .card{
    background:#FBF7F1; padding:40px 34px; border-radius:22px;
    box-shadow:0 12px 40px rgba(75,62,50,0.12); width:100%; max-width:320px;
  }
  h1{ font-family:Georgia,serif; font-size:21px; color:#4B3E32; margin:0 0 22px; font-weight:500; }
  input{
    width:100%; padding:12px 14px; margin-bottom:12px; border-radius:12px;
    border:1px solid #F7E0C9; font-size:14px; background:#fff; color:#4B3E32;
  }
  input:focus{ outline:2px solid #EC96A3; border-color:transparent; }
  button{
    width:100%; padding:12px; border-radius:12px; border:none; background:#EC96A3;
    color:white; font-size:14px; font-weight:600; cursor:pointer; margin-top:4px;
  }
  button:hover{ background:#BB7B82; }
  .error{ color:#BB7B82; font-size:12.5px; margin:-4px 0 14px; }
</style>
</head>
<body>
  <div class="card">
    <h1>Acceso privado</h1>
    ${showError ? `<p class="error">Usuario o contraseña incorrectos.</p>` : ''}
    <form method="POST" action="/api/login">
      <input type="text" name="user" placeholder="Usuario" autofocus required autocomplete="username">
      <input type="password" name="pass" placeholder="Contraseña" required autocomplete="current-password">
      <button type="submit">Entrar</button>
    </form>
  </div>
</body>
</html>`;
}

export default async function middleware(request) {
  const url = new URL(request.url);

  // gestiona el envío del formulario de login
  if (request.method === 'POST' && url.pathname === '/api/login') {
    const form = await request.formData();
    const user = form.get('user');
    const pass = form.get('pass');

    if (user === USER && pass === PASS) {
      const response = new Response(null, { status: 302, headers: { Location: '/' } });
      response.headers.append(
        'Set-Cookie',
        `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`
      );
      return response;
    }
    return new Response(loginPageHtml(true), {
      status: 401,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  // comprueba si ya hay una sesión válida (cookie)
  const cookieHeader = request.headers.get('cookie') || '';
  const hasValidCookie = cookieHeader
    .split(';')
    .some(c => c.trim() === `${COOKIE_NAME}=${COOKIE_VALUE}`);

  if (hasValidCookie) {
    return; // sesión válida: deja pasar la petición
  }

  return new Response(loginPageHtml(false), {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
