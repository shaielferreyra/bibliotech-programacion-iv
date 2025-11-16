# Frontend - BiblioTech 📚

Interfaz web moderna e interactiva para la gestión de la biblioteca digital BiblioTech.

## Descripción

Frontend responsivo desarrollado con **HTML5**, **CSS3** y **JavaScript vanilla** que proporciona una experiencia completa para:
- 📖 Explorar y gestionar libros
- ✍️ Administrar autores
- 👥 Gestionar usuarios de la biblioteca
- 🤝 Controlar préstamos y devoluciones
- 🏷️ Organizar categorías
- ⭐ Leer y escribir reseñas

## Características

✨ Interfaz moderna y responsive  
🎨 Diseño intuitivo con colores armoniosos  
⚡ Carga dinámica sin necesidad de recargar la página  
🔍 Sistema de búsqueda en tiempo real  
📱 Compatible con dispositivos móviles  
🎯 Filtros avanzados para cada sección  
📊 Dashboard con estadísticas actualizadas  
♿ Interfaz accesible  

## Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos (Flexbox, Grid)
- **JavaScript (Vanilla)** - Interactividad sin dependencias externas
- **Font Awesome 6.4.0** - Iconos profesionales
- **Fetch API** - Comunicación con el backend

## Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Backend ejecutándose en `http://localhost:8000`

## Instalación y Uso

### Opción 1: Servidor Local (recomendado)

#### Con Python (si tienes Python 3+)
```bash
cd frontend
python -m http.server 8080
```

Luego abre: `http://localhost:8080`

#### Con Node.js
```bash
cd frontend
npx http-server
```

#### Con Live Server (VS Code)
1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

### Opción 2: Abrir directamente
Simplemente abre `index.html` en tu navegador (nota: los datos no se cargarán correctamente sin un servidor)

## Estructura de Archivos

```
frontend/
├── index.html          # Estructura principal
├── app.js             # Lógica y funcionalidad
├── styles.css         # Estilos y diseño
└── README.md          # Este archivo
```

## Uso de la Aplicación

### 1. Inicio
Al abrir la aplicación, verás:
- Dashboard con estadísticas generales
- Menú de navegación superior
- Sección activa de Libros por defecto

### 2. Navegación
Usa el menú superior para moverte entre secciones:
- **Libros** - Visualizar y gestionar libros disponibles
- **Autores** - Administrar base de datos de autores
- **Usuarios** - Gestionar usuarios registrados
- **Préstamos** - Control de préstamos activos
- **Categorías** - Organizar libros por género
- **Reseñas** - Leer y escribir reseñas

### 3. Operaciones CRUD

#### Crear
1. Haz clic en el botón "Crear" o "Agregar"
2. Completa el formulario
3. Haz clic en "Guardar"

#### Leer
- Los datos se cargan automáticamente
- Usa la búsqueda para filtrar

#### Actualizar
1. Haz clic en el ícono "Editar" del elemento
2. Modifica los datos
3. Haz clic en "Guardar"

#### Eliminar
1. Haz clic en el ícono "Eliminar"
2. Confirma la acción

### 4. Filtros y Búsqueda
- **Búsqueda global** - Encuentra elementos por nombre/título
- **Filtros por estado** - Filtra libros disponibles, préstamos activos, etc.
- **Búsqueda por categoría** - En la sección de libros

## Configuración

### URL de la API

La URL de la API se configura en la primera línea de `app.js`:

```javascript
const API_URL = 'http://localhost:8000';
```

Si cambias el puerto o el host del backend, actualiza esta variable.

## Estadísticas del Dashboard

El dashboard muestra:
- **Libros** - Total de libros en la biblioteca
- **Autores** - Cantidad de autores registrados
- **Usuarios** - Usuarios activos
- **Préstamos** - Préstamos activos actualmente
- **Categorías** - Géneros disponibles
- **Reseñas** - Total de reseñas publicadas

Las estadísticas se actualizan automáticamente al cargar los datos.

## Funcionalidades Principales

### Sección de Libros
- Vista de todos los libros disponibles
- Información: título, autor, ISBN, año de publicación
- Estado de disponibilidad
- Crear nuevos libros
- Editar información de libros
- Eliminar libros

### Sección de Autores
- Directorio completo de autores
- Información: nombre, nacionalidad, fecha de nacimiento, biografía
- Agregar nuevos autores
- Actualizar datos de autores
- Eliminar autores

### Sección de Usuarios
- Base de datos de usuarios
- Información: nombre, email, teléfono, dirección, fecha de registro
- Registrar nuevos usuarios
- Actualizar información de usuarios
- Eliminar usuarios

### Sección de Préstamos
- Historial de préstamos
- Estado: activos o devueltos
- Fechas de préstamo y devolución
- Crear nuevos préstamos
- Registrar devoluciones

### Sección de Categorías
- Clasificación de géneros
- Descripción de cada categoría
- Crear nuevas categorías
- Editar categorías
- Eliminar categorías

### Sección de Reseñas
- Calificaciones de libros (1-5 estrellas)
- Comentarios de usuarios
- Crear nuevas reseñas
- Editar reseñas
- Eliminar reseñas

## Responsive Design

La aplicación es completamente responsive:
- **Desktop** (1200px+) - Vista de escritorio completa
- **Tablet** (768px - 1199px) - Adaptado para tablets
- **Móvil** (< 768px) - Menú hamburguesa y layout móvil

### Menú Móvil
En dispositivos pequeños, el menú se convierte en un hamburguesa:
- Haz clic en el ícono de tres líneas
- Se abre el menú lateral
- Selecciona la sección deseada

## Validación de Formularios

Los formularios incluyen validaciones:
- Campos requeridos marcados con `*`
- Validación de email
- Validación de formatos de fecha
- Mensajes de error descriptivos

## Manejo de Errores

La aplicación muestra:
- ✅ Mensajes de éxito al completar acciones
- ❌ Mensajes de error si algo falla
- ⚠️ Advertencias para acciones importantes

## Temas de Colores

Colores principales utilizados:
- **Azul** (#007BFF, #0056b3) - Acciones principales
- **Verde** (#28a745, #1e7e34) - Éxito
- **Rojo** (#dc3545, #a71d2a) - Eliminar/Peligro
- **Gris** (#6c757d, #5a6268) - Elementos secundarios
- **Blanco/Negro** - Contraste y legibilidad

## Fuentes

Se utiliza la familia de fuentes del sistema para optimizar carga y compatibilidad.

## Iconos

Todos los iconos provienen de **Font Awesome 6.4.0**:
- 📖 Libros
- ✍️ Autores
- 👥 Usuarios
- 🤝 Préstamos
- 🏷️ Categorías
- ⭐ Reseñas

## Compatibilidad

| Navegador | Soporte |
|-----------|---------|
| Chrome    | ✅ Total |
| Firefox   | ✅ Total |
| Safari    | ✅ Total |
| Edge      | ✅ Total |
| IE 11     | ⚠️ Limitado |

## Localización

La interfaz está en **español** completamente.

## Performance

- Carga sin librerías externas (excepto iconos)
- Carga dinámica de datos
- Optimizado para velocidad
- Caché de datos en memoria

## Desarrollo Futuro

Posibles mejoras:
- 🔐 Sistema de autenticación
- 📧 Notificaciones por email
- 📊 Gráficos y reportes
- 🌙 Modo oscuro
- 🔄 Sincronización en tiempo real
- 📱 PWA (Progressive Web App)

## Troubleshooting

### No carga los datos
- Verifica que el backend está corriendo en `http://localhost:8000`
- Abre la consola del navegador (F12) y busca errores
- Revisa que los orígenes CORS están configurados correctamente

### Errores de CORS
- Verifica la URL de la API en `app.js`
- Asegúrate que el backend tiene CORS habilitado

### Formularios no funcionan
- Verifica la consola para mensajes de error
- Asegúrate de llenar todos los campos requeridos
- Valida el formato de los datos ingresados

## Licencia

Este proyecto es parte del curso Programación IV.

## Autor

Proyecto realizado por Shaiel Ferreyra

---

**¿Necesitas ayuda?** Consulta los endpoints disponibles en: `http://localhost:8000/docs`
