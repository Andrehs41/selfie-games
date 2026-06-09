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
