# Selfie Games — By Mariana Zapata (Expobelleza)

Activación de marca con dos juegos: **La Trivia** y **La Ruleta**. Detrás hay registro de
usuarios y login (captura de leads para uso posterior). Cada usuario puede jugar **una vez
cada juego**; el resultado/premio queda guardado.

## Stack

- **Frontend** (`/client`): React + Vite, Material UI, GSAP, React Router.
- **Backend** (`/server`): Node + Express, MongoDB (Mongoose), JWT, bcrypt.

> Paleta provisional pastel/beige hasta que el cliente entregue logos y colores definitivos
> (se cambia en un solo lugar: `client/src/theme.js`).

## Puesta en marcha

### Requisitos

- Node 18+ (probado en 24).
- MongoDB: local (`mongodb://127.0.0.1:27017`) o un cluster de Atlas.

### Backend

```bash
cd server
cp .env.example .env   # ajusta MONGODB_URI y JWT_SECRET
npm install
npm run dev            # http://localhost:4000
```

### Frontend

```bash
cd client
npm install
npm run dev            # http://localhost:5173
```

El front habla con el back vía el proxy de Vite (`/api` → `localhost:4000`).

## Datos del juego

Las preguntas de la trivia y los premios de la ruleta viven en el servidor
(`server/src/data/`). La trivia se **valida en el backend** (el cliente nunca recibe la
respuesta correcta) y el premio de la ruleta lo **decide el backend** (el front solo anima
hacia el segmento ganador). Así no se puede hacer trampa desde el navegador.
