# Polaris Frontend

Actualmente incluye autenticación (login/register), navegación con
sidebar y los módulos de **Reglas de Negocio**, **Ejecuciones de
Archivos** y **Usuarios**.

------------------------------------------------------------------------

## Stack Tecnológico

-   [React](https://react.dev/) -- Librería principal de la UI.\
-   [Vite](https://vitejs.dev/) -- Bundler y dev server.\
-   [React Router](https://reactrouter.com/) -- Ruteo y navegación.\
-   [TailwindCSS](https://tailwindcss.com/) -- Estilos utilitarios.\
-   [shadcn/ui](https://ui.shadcn.com/) -- Componentes de interfaz
    reutilizables.\
-   [lucide-react](https://lucide.dev/) -- Íconos SVG.

------------------------------------------------------------------------

## Autenticación

El flujo de login y registro funciona de la siguiente manera:

-   **Login** (`/auth`)\
    Permite iniciar sesión con correo y contraseña.\
    Al iniciar sesión correctamente se almacena el token JWT en
    `localStorage` y se muestra el **dashboard**.

-   **Registro** (`/auth`)\
    Permite crear un usuario con nombre, correo, contraseña y
    confirmación de contraseña.\
    Una vez registrado, se puede iniciar sesión directamente.

-   **Logout**\
    Limpia el token y redirige automáticamente a la pantalla de login.

------------------------------------------------------------------------

## Navegación

La aplicación usa un **sidebar** con los siguientes módulos:

-   **Inicio** → `/home`\
-   **Archivos** → `/file-executions`\
-   **Reglas de Negocio** → `/business-rules`\
-   **Usuarios** → `/users`

Al iniciar sesión, el header con el logo de Banorte y el botón de
**Logout** se mantiene fijo en todas las páginas protegidas.

------------------------------------------------------------------------

## Módulos actuales

### Usuarios (`/users`)

-   Lista los usuarios registrados en el sistema (conectado al
    backend).\
-   Muestra nombre, correo y rol.\
-   Botones de acción (ej: editar) disponibles para administración
    futura.

### Reglas de Negocio (`/business-rules`)

-   Vista de reglas ya integradas desde el backend.\
-   Incluye listado y detalles de reglas.

### Ejecuciones de Archivos (`/file-executions`)

-   Vista para ejecutar y consultar archivos.
