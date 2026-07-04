# Web de trabajadores — Madam Tusan

Aplicación React/Vite para cocineros, empaquetadores, repartidores y
administradores.

## Desarrollo

```bash
npm ci
npm run dev
```

La API se configura con:

```bash
VITE_API_URL=https://xt3vbja389.execute-api.us-east-1.amazonaws.com
```

## Despliegue en Amplify

1. Publica este directorio en un repositorio GitHub.
2. En AWS Amplify selecciona **Host web app** y conecta el repositorio.
3. Añade `VITE_API_URL` en las variables de entorno de Amplify.
4. Despliega la rama `main`. El archivo `amplify.yml` compila `dist/`.

## Roles

- `cook`: completa `COOK`.
- `pack`: completa `PACK`.
- `deliverer`: completa `DELIVER`.
- `worker`: puede atender cualquiera de las etapas de staff.
- `admin`: administra trabajadores y supervisa el flujo.

La recepción final `RECEIVE` solo puede confirmarla el cliente propietario
desde la web de clientes (o un administrador durante una demo).
