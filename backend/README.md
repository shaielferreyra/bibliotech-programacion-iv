# Backend - BiblioTech 📚

API REST para la gestión de una biblioteca digital construida con **FastAPI**.

## Descripción

Este backend proporciona una API completa para gestionar:
- **Libros**: CRUD de libros con información detallada
- **Autores**: Gestión de autores con biografía
- **Categorías**: Clasificación de libros por géneros
- **Usuarios**: Registro y gestión de usuarios de la biblioteca
- **Préstamos**: Control de préstamos y devoluciones de libros
- **Reseñas**: Sistema de calificaciones y comentarios

## Características

✅ API RESTful con validación de datos  
✅ Base de datos SQLite integrada  
✅ CORS habilitado para acceso desde frontend  
✅ Modelos Pydantic para validación automática  
✅ Datos de ejemplo precargados  
✅ Manejo robusto de errores  

## Tecnologías

- **FastAPI** (0.104.1) - Framework web moderno y rápido
- **Uvicorn** (0.24.0) - Servidor ASGI
- **Pydantic** (1.10.16) - Validación de datos
- **SQLite** - Base de datos
- **Python** 3.7+

## Instalación

### 1. Clonar o descargar el proyecto
```bash
cd backend
```

### 2. Crear un entorno virtual (recomendado)
```bash
# En Windows
python -m venv venv
venv\Scripts\activate

# En macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

## Uso

### Iniciar el servidor
```bash
uvicorn main:app --reload
```

El servidor estará disponible en: `http://localhost:8000`

### Documentación interactiva
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Estructura de Endpoints

### Categorías
```
GET    /categorias              - Obtener todas las categorías
POST   /categorias              - Crear nueva categoría
PUT    /categorias/{id}         - Actualizar categoría
DELETE /categorias/{id}         - Eliminar categoría
```

### Autores
```
GET    /autores                 - Obtener todos los autores
POST   /autores                 - Crear nuevo autor
PUT    /autores/{id}            - Actualizar autor
DELETE /autores/{id}            - Eliminar autor
```

### Libros
```
GET    /libros                  - Obtener todos los libros
POST   /libros                  - Crear nuevo libro
PUT    /libros/{id}             - Actualizar libro
DELETE /libros/{id}             - Eliminar libro
```

### Usuarios
```
GET    /usuarios                - Obtener todos los usuarios
POST   /usuarios                - Crear nuevo usuario
PUT    /usuarios/{id}           - Actualizar usuario
DELETE /usuarios/{id}           - Eliminar usuario
```

### Préstamos
```
GET    /prestamos               - Obtener todos los préstamos
POST   /prestamos               - Crear nuevo préstamo
PUT    /prestamos/{id}/devolver - Registrar devolución
DELETE /prestamos/{id}          - Eliminar préstamo
```

### Reseñas
```
GET    /resenas                 - Obtener todas las reseñas
POST   /resenas                 - Crear nueva reseña
PUT    /resenas/{id}            - Actualizar reseña
DELETE /resenas/{id}            - Eliminar reseña
```

## Modelos de Datos

### Categoria
```json
{
  "id": 1,
  "nombre": "Ficción",
  "descripcion": "Obras narrativas basadas en la imaginación"
}
```

### Autor
```json
{
  "id": 1,
  "nombre": "Gabriel García Márquez",
  "nacionalidad": "Colombiano",
  "fecha_nacimiento": "1927-03-06",
  "biografia": "Premio Nobel de Literatura 1982"
}
```

### Libro
```json
{
  "id": 1,
  "titulo": "Cien años de soledad",
  "autor_id": 1,
  "categoria_id": 1,
  "isbn": "978-0307474728",
  "año_publicacion": 1967,
  "paginas": 417,
  "disponible": true
}
```

### Usuario
```json
{
  "id": 1,
  "nombre": "María González",
  "email": "maria.gonzalez@email.com",
  "telefono": "+54 381 4567890",
  "direccion": "San Martín 123, Tucumán",
  "fecha_registro": "2024-01-15"
}
```

### Préstamo
```json
{
  "id": 1,
  "libro_id": 1,
  "usuario_id": 1,
  "fecha_prestamo": "2024-10-15",
  "fecha_devolucion_esperada": "2024-10-29",
  "fecha_devolucion_real": "2024-10-28",
  "devuelto": true
}
```

### Reseña
```json
{
  "id": 1,
  "libro_id": 1,
  "usuario_id": 1,
  "calificacion": 5,
  "comentario": "Obra maestra de la literatura latinoamericana",
  "fecha": "2024-10-29"
}
```

## Base de Datos

### Inicialización Automática
La base de datos se crea automáticamente al iniciar la aplicación con:
- 12 categorías de libros
- 15 autores destacados
- 17 libros de ejemplo
- 12 usuarios registrados
- 14 préstamos de ejemplo
- 12 reseñas de ejemplo

### Ubicación
La base de datos SQLite se guarda como `biblioteca.db` en el directorio raíz del backend.

## CORS

El backend está configurado para aceptar solicitudes desde cualquier origen:
```python
allow_origins=["*"]
```

Para producción, se recomienda especificar los orígenes permitidos:
```python
allow_origins=["http://localhost:3000", "https://tudominio.com"]
```

## Manejo de Errores

La API devuelve errores HTTP estándar:
- `200 OK` - Solicitud exitosa
- `400 Bad Request` - Datos inválidos
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Ejemplo de Uso con cURL

```bash
# Obtener todos los libros
curl http://localhost:8000/libros

# Crear una nueva categoría
curl -X POST http://localhost:8000/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Novela Negra", "descripcion": "Historias de crimen y misterio"}'

# Actualizar un libro
curl -X PUT http://localhost:8000/libros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Nuevo Título", "autor_id": 1, ...}'
```

## Desarrollo

### Agregar nuevos endpoints

1. Crear el modelo Pydantic en la sección de modelos
2. Implementar la lógica del endpoint
3. Probar en http://localhost:8000/docs

### Variables de entorno (opcional)

Para proyectos futuros, considera usar archivo `.env`:
```
DATABASE_URL=sqlite:///biblioteca.db
API_PORT=8000
```

## Licencia

Este proyecto es parte del curso Programación IV.

## Autor

Proyecto realizado por Shaiel Ferreyra
