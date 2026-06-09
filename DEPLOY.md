# Guía de despliegue

Arquitectura recomendada: **Frontend en Vercel** + **Backend en Render** + **MongoDB en Atlas**.

```
[ Navegador ] ──> [ Vercel (React estático) ] ──HTTPS──> [ Render (Express) ] ──> [ Atlas (MongoDB) ]
```

---

## 1. MongoDB Atlas

Ya tienes el cluster. Para producción:

1. **Network Access** → agrega `0.0.0.0/0` (Render usa IPs dinámicas, no fijas).
2. Confirma que la URI incluye el nombre de la BD: `.../selfie-games?...`
3. **Rota la contraseña** del usuario de BD si se compartió en algún lado.

---

## 2. Backend en Render

1. Sube el repo a GitHub.
2. En Render: **New → Blueprint** y selecciona el repo (detecta `server/render.yaml`).
   - O bien **New → Web Service** manual con: Root Directory `server`, Build `npm install`, Start `npm start`.
3. Define las variables de entorno (Environment):
   - `MONGODB_URI` → tu URI de Atlas
   - `JWT_SECRET` → cadena larga y aleatoria
   - `JWT_EXPIRES_IN` → `7d`
   - `CLIENT_ORIGIN` → la URL de Vercel (se rellena tras el paso 3). Acepta varias separadas por coma.
4. Deploy. Verifica `https://TU-API.onrender.com/api/health` → `{"ok":true}`.
5. Crea el admin (una vez): en Render abre **Shell** y ejecuta
   `node src/scripts/seedAdmin.js admin@tucorreo.com TuClaveSegura "Nombre Admin"`.

> Nota: el plan free de Render "duerme" el servicio tras inactividad; la primera
> petición puede tardar ~30s en despertar. Para una expo en vivo, considera el
> plan de pago o hacer un ping periódico.

---

## 2-bis. Backend en Hostinger (auto-deploy desde GitHub)

Hostinger es buena opción: **no se "duerme"** como el plan free de Render, así que es más
confiable para la expo en vivo.

Hostinger despliega desde la **raíz del repo** (no deja elegir la subcarpeta `server/`).
Para eso el repo trae un **`package.json` en la raíz** que instala las dependencias del
`server` y lo arranca. Así, compilando desde la raíz, se levanta el backend.

Config en el panel de Hostinger (auto-deploy):

1. **Repositorio:** `selfie-games`, rama `main`.
2. **Preajuste del marco:** **NO Vite.** Elige **Node.js** (u "Otro/Ninguno"). Vite haría
   una compilación *estática* y un backend Express necesita un proceso Node vivo.
3. **Directorio raíz:** la **raíz del repo** (déjalo vacío / `.`), NO `client`.
4. **Versión de Node:** 18, 20 o 22.
5. **Comandos:**
   - Build / Install: `npm install` (el `postinstall` instala las deps de `server/`).
   - Start / arranque: `npm start` (ejecuta `node server/src/index.js`).
   - Si pide un **archivo de inicio**: `server/src/index.js`.
   - Directorio de salida: no aplica (es un servicio, no un sitio estático).
6. **Variables de entorno** (en el panel, NO subas `.env`):
   - `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `CLIENT_ORIGIN=<url de Vercel>`.
   - El `PORT` lo asigna Hostinger (el código usa `process.env.PORT`).
7. **Atlas Network Access:** agrega la **IP fija** que te dé Hostinger (o `0.0.0.0/0`).
8. **Crea el admin** una vez (por SSH, en la raíz del repo):
   `node server/src/scripts/seedAdmin.js admin@tucorreo.com TuClave "Nombre Admin"`
9. Verifica `https://selfieapi.daanagency.com/api/health` → `{"ok":true}` y usa esa URL
   **con `/api`** (`https://selfieapi.daanagency.com/api`) como `VITE_API_URL` en Vercel.

> El `client/` no se ejecuta en Hostinger (el backend no lo usa); el frontend va a Vercel.
> Si el panel de Hostinger solo ofrece "sitio estático" (build → carpeta de salida) y no un
> servicio Node persistente, ese modo NO puede correr Express: usa la opción de
> **aplicación Node.js**.

## 3. Frontend en Vercel

1. En Vercel: **Add New → Project** y selecciona el repo.
2. Configura:
   - **Root Directory:** `client`
   - Framework: **Vite** (autodetectado). Build `npm run build`, Output `dist`.
3. Variable de entorno:
   - `VITE_API_URL` → `https://TU-API.onrender.com/api`
4. Deploy. Copia la URL final (p. ej. `https://selfie-games.vercel.app`).
5. Vuelve a Render y pon esa URL en `CLIENT_ORIGIN` (re-deploy del backend).
   - Para permitir también las preview URLs: `https://selfie-games.vercel.app,https://selfie-games-git-*.vercel.app`
     (si usas comodines, mejor lista las que necesites explícitamente).

El `client/vercel.json` ya incluye el rewrite SPA para que rutas como `/admin`
funcionen al recargar.

---

## Checklist final

- [ ] `/api/health` responde en Render
- [ ] Atlas permite la IP de Render (`0.0.0.0/0`)
- [ ] `VITE_API_URL` apunta al backend (con `/api`)
- [ ] `CLIENT_ORIGIN` en Render = dominio de Vercel
- [ ] Admin creado con `seedAdmin`
- [ ] `JWT_SECRET` y contraseña de Mongo seguras (no las de desarrollo)
