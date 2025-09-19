# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Login & Registro de Usuarios

Se implementa autenticación con **JWT** consumiendo el backend de NestJS:

1. **Login (`/auth/login`)**  
   - El usuario ingresa su correo y contraseña.  
   - Se envía una petición `POST` al backend (`http://localhost:3000/auth/login`).  
   - Si las credenciales son válidas, el backend responde con un **token JWT**.  
   - El token se guarda en `localStorage` y permite acceder a las rutas protegidas.  

2. **Registro (`/auth/register`)**  
   - El usuario puede crear una nueva cuenta desde el formulario de registro.  
   - Los datos se envían al backend (`/auth/register`).  
   - Si el registro es exitoso, se redirige automáticamente a la página de login.  

3. **Protección de rutas**  
   - Se utiliza un custom hook `useAuth` que revisa si existe un token en `localStorage`.  
   - Si no hay token, cualquier intento de acceder a páginas protegidas redirige al login.  
   - Si el token existe, se renderiza el layout principal con las páginas internas (Reglas de negocio, Archivos, etc.).  

4. **Logout**  
   - Al cerrar sesión se elimina el token de `localStorage` y el usuario es redirigido al login.  
