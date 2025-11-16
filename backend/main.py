from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os 
import sqlite3

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Montar archivos estáticos
frontend_path = os.path.join(os.path.dirname(__file__), "../frontend")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

# Ruta para servir el HTML principal
@app.get("/app")
async def serve_app():
    return FileResponse(os.path.join(frontend_path, "index.html"))

# Ruta raíz redirige a /app
@app.get("/")
def root():
    return {
        "message": "API de Biblioteca Completa - FastAPI + SQLite - 6 Tablas",
        "frontend": "/app",
        "docs": "/docs"
    }
# ==================== MODELOS PYDANTIC ====================
# Definición de los modelos de datos utilizando Pydantic
class Categoria(BaseModel):
    id: Optional[int] = None
    nombre: str
    descripcion: str

class Autor(BaseModel):
    id: Optional[int] = None
    nombre: str
    nacionalidad: str
    fecha_nacimiento: str
    biografia: Optional[str] = None

class Libro(BaseModel):
    id: Optional[int] = None
    titulo: str
    autor_id: int
    categoria_id: int
    isbn: str
    año_publicacion: int
    paginas: int
    disponible: bool = True

class Usuario(BaseModel):
    id: Optional[int] = None
    nombre: str
    email: str
    telefono: str
    direccion: str
    fecha_registro: str

class Prestamo(BaseModel):
    id: Optional[int] = None
    libro_id: int
    usuario_id: int
    fecha_prestamo: str
    fecha_devolucion_esperada: str
    fecha_devolucion_real: Optional[str] = None
    devuelto: bool = False

class Resena(BaseModel):
    id: Optional[int] = None
    libro_id: int
    usuario_id: int
    calificacion: int
    comentario: str
    fecha: str

# ==================== BASE DE DATOS ====================

def get_db():
    conn = sqlite3.connect('biblioteca.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = sqlite3.connect('biblioteca.db')
    cursor = conn.cursor()
    
    # Tabla Categorías
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            descripcion TEXT NOT NULL
        )
    ''')
    
    # Tabla Autores
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS autores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            nacionalidad TEXT NOT NULL,
            fecha_nacimiento TEXT NOT NULL,
            biografia TEXT
        )
    ''')
    
    # Tabla Libros
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS libros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            autor_id INTEGER NOT NULL,
            categoria_id INTEGER NOT NULL,
            isbn TEXT NOT NULL UNIQUE,
            año_publicacion INTEGER NOT NULL,
            paginas INTEGER NOT NULL,
            disponible BOOLEAN DEFAULT 1,
            FOREIGN KEY (autor_id) REFERENCES autores (id),
            FOREIGN KEY (categoria_id) REFERENCES categorias (id)
        )
    ''')
    
    # Tabla Usuarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            telefono TEXT NOT NULL,
            direccion TEXT NOT NULL,
            fecha_registro TEXT NOT NULL
        )
    ''')
    
    # Tabla Préstamos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prestamos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            libro_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            fecha_prestamo TEXT NOT NULL,
            fecha_devolucion_esperada TEXT NOT NULL,
            fecha_devolucion_real TEXT,
            devuelto BOOLEAN DEFAULT 0,
            FOREIGN KEY (libro_id) REFERENCES libros (id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )
    ''')
    
    # Tabla Reseñas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resenas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            libro_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),
            comentario TEXT NOT NULL,
            fecha TEXT NOT NULL,
            FOREIGN KEY (libro_id) REFERENCES libros (id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )
    ''')
    
    # Insertar datos de ejemplo
    cursor.execute("SELECT COUNT(*) FROM categorias")
    if cursor.fetchone()[0] == 0:
        categorias_data = [
            ('Ficción', 'Obras narrativas basadas en la imaginación'),
            ('No Ficción', 'Obras basadas en hechos reales'),
            ('Ciencia Ficción', 'Narrativa especulativa sobre tecnología y futuro'),
            ('Fantasía', 'Mundos imaginarios con elementos mágicos'),
            ('Romance', 'Historias centradas en relaciones amorosas'),
            ('Misterio', 'Historias de suspense e investigación'),
            ('Biografía', 'Historia de vida de personas reales'),
            ('Poesía', 'Expresión artística en verso'),
            ('Historia', 'Relatos de acontecimientos pasados'),
            ('Filosofía', 'Reflexiones sobre existencia y conocimiento'),
            ('Terror', 'Historias que provocan miedo'),
            ('Aventura', 'Narrativas de exploración y acción')
        ]
        cursor.executemany('INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)', categorias_data)
        
        autores_data = [
            ('Gabriel García Márquez', 'Colombiano', '1927-03-06', 'Premio Nobel de Literatura 1982'),
            ('Jorge Luis Borges', 'Argentino', '1899-08-24', 'Maestro del cuento y la poesía'),
            ('Isabel Allende', 'Chilena', '1942-08-02', 'Una de las autoras más leídas en español'),
            ('Mario Vargas Llosa', 'Peruano', '1936-03-28', 'Premio Nobel de Literatura 2010'),
            ('Pablo Neruda', 'Chileno', '1904-07-12', 'Premio Nobel de Literatura 1971'),
            ('Julio Cortázar', 'Argentino', '1914-08-26', 'Maestro del cuento fantástico'),
            ('Octavio Paz', 'Mexicano', '1914-03-31', 'Premio Nobel de Literatura 1990'),
            ('Carlos Fuentes', 'Mexicano', '1928-11-11', 'Una de las figuras más importantes de la literatura mexicana'),
            ('Roberto Bolaño', 'Chileno', '1953-04-28', 'Autor de "Los detectives salvajes"'),
            ('Laura Esquivel', 'Mexicana', '1950-09-30', 'Autora de "Como agua para chocolate"'),
            ('Miguel de Cervantes', 'Español', '1547-09-29', 'Autor de Don Quijote'),
            ('Federico García Lorca', 'Español', '1898-06-05', 'Poeta y dramaturgo de la Generación del 27'),
            ('J.K. Rowling', 'Británica', '1965-07-31', 'Creadora de Harry Potter'),
            ('Stephen King', 'Estadounidense', '1947-09-21', 'Maestro del terror contemporáneo'),
            ('Agatha Christie', 'Británica', '1890-09-15', 'Reina del misterio')
        ]
        cursor.executemany('INSERT INTO autores (nombre, nacionalidad, fecha_nacimiento, biografia) VALUES (?, ?, ?, ?)', autores_data)
        
        libros_data = [
            ('Cien años de soledad', 1, 1, '978-0307474728', 1967, 417, 1),
            ('El amor en los tiempos del cólera', 1, 5, '978-0307389732', 1985, 368, 1),
            ('Ficciones', 2, 1, '978-0802130303', 1944, 174, 1),
            ('El Aleph', 2, 1, '978-8420633473', 1949, 203, 1),
            ('La casa de los espíritus', 3, 4, '978-1501117015', 1982, 433, 1),
            ('La ciudad y los perros', 4, 1, '978-8420412146', 1963, 408, 1),
            ('Conversación en La Catedral', 4, 1, '978-8420471358', 1969, 734, 1),
            ('Veinte poemas de amor', 5, 8, '978-8437604695', 1924, 112, 1),
            ('Rayuela', 6, 1, '978-8437604572', 1963, 600, 1),
            ('Bestiario', 6, 1, '978-8420471341', 1951, 158, 1),
            ('El laberinto de la soledad', 7, 10, '978-0802150424', 1950, 398, 1),
            ('Como agua para chocolate', 10, 5, '978-0385721233', 1989, 245, 1),
            ('Don Quijote de la Mancha', 11, 1, '978-8467033069', 1605, 863, 1),
            ('Bodas de sangre', 12, 1, '978-8437604541', 1933, 96, 1),
            ('Harry Potter y la piedra filosofal', 13, 4, '978-8498383447', 1997, 254, 1),
            ('El resplandor', 14, 11, '978-0307743657', 1977, 447, 1),
            ('Asesinato en el Orient Express', 15, 6, '978-0062693662', 1934, 256, 1)
        ]
        cursor.executemany('INSERT INTO libros (titulo, autor_id, categoria_id, isbn, año_publicacion, paginas, disponible) VALUES (?, ?, ?, ?, ?, ?, ?)', libros_data)
        
        usuarios_data = [
            ('María González', 'maria.gonzalez@email.com', '+54 381 4567890', 'San Martín 123, Tucumán', '2024-01-15'),
            ('Juan Pérez', 'juan.perez@email.com', '+54 381 4567891', 'Av. Aconquija 456, Tucumán', '2024-02-20'),
            ('Ana Martínez', 'ana.martinez@email.com', '+54 381 4567892', 'Congreso 789, Tucumán', '2024-03-10'),
            ('Carlos López', 'carlos.lopez@email.com', '+54 381 4567893', 'Muñecas 321, Tucumán', '2024-03-25'),
            ('Laura Fernández', 'laura.fernandez@email.com', '+54 381 4567894', 'Laprida 654, Tucumán', '2024-04-05'),
            ('Pedro Sánchez', 'pedro.sanchez@email.com', '+54 381 4567895', '24 de Septiembre 987, Tucumán', '2024-04-18'),
            ('Sofía Torres', 'sofia.torres@email.com', '+54 381 4567896', 'Mate de Luna 147, Tucumán', '2024-05-02'),
            ('Diego Ramírez', 'diego.ramirez@email.com', '+54 381 4567897', 'Junín 258, Tucumán', '2024-05-15'),
            ('Valentina Ruiz', 'valentina.ruiz@email.com', '+54 381 4567898', 'Córdoba 369, Tucumán', '2024-06-01'),
            ('Mateo Silva', 'mateo.silva@email.com', '+54 381 4567899', 'Salta 741, Tucumán', '2024-06-20'),
            ('Camila Morales', 'camila.morales@email.com', '+54 381 4567800', 'Mendoza 852, Tucumán', '2024-07-10'),
            ('Lucas Herrera', 'lucas.herrera@email.com', '+54 381 4567801', 'Buenos Aires 963, Tucumán', '2024-08-05')
        ]
        cursor.executemany('INSERT INTO usuarios (nombre, email, telefono, direccion, fecha_registro) VALUES (?, ?, ?, ?, ?)', usuarios_data)
        
        prestamos_data = [
            (1, 1, '2024-10-15', '2024-10-29', '2024-10-28', 1),
            (3, 2, '2024-10-20', '2024-11-03', '2024-11-02', 1),
            (5, 3, '2024-10-25', '2024-11-08', None, 0),
            (7, 4, '2024-10-28', '2024-11-11', None, 0),
            (9, 5, '2024-11-01', '2024-11-15', None, 0),
            (2, 6, '2024-09-10', '2024-09-24', '2024-09-23', 1),
            (4, 7, '2024-09-15', '2024-09-29', '2024-09-28', 1),
            (6, 8, '2024-10-05', '2024-10-19', '2024-10-18', 1),
            (8, 9, '2024-10-10', '2024-10-24', '2024-10-23', 1),
            (10, 10, '2024-10-12', '2024-10-26', '2024-10-25', 1),
            (11, 11, '2024-10-18', '2024-11-01', None, 0),
            (12, 12, '2024-10-22', '2024-11-05', None, 0),
            (15, 3, '2024-11-05', '2024-11-19', None, 0),
            (16, 7, '2024-11-07', '2024-11-21', None, 0)
        ]
        cursor.executemany('INSERT INTO prestamos (libro_id, usuario_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, devuelto) VALUES (?, ?, ?, ?, ?, ?)', prestamos_data)
        
        resenas_data = [
            (1, 1, 5, 'Obra maestra de la literatura latinoamericana. Inolvidable.', '2024-10-29'),
            (1, 2, 5, 'Una historia increíble que te atrapa desde el principio.', '2024-10-30'),
            (3, 2, 4, 'Cuentos brillantes que desafían la realidad.', '2024-11-03'),
            (5, 3, 5, 'Hermosa narrativa sobre familia y tradición.', '2024-11-04'),
            (2, 6, 5, 'Una historia de amor épica y conmovedora.', '2024-09-24'),
            (4, 7, 4, 'Borges en su máximo esplendor literario.', '2024-09-30'),
            (6, 8, 4, 'Crítica social envuelta en una gran historia.', '2024-10-19'),
            (8, 9, 5, 'Poemas que tocan el alma profundamente.', '2024-10-24'),
            (10, 10, 4, 'Cuentos surrealistas fascinantes.', '2024-10-26'),
            (9, 5, 5, 'Una obra experimental única e innovadora.', '2024-11-02'),
            (12, 4, 5, 'Realismo mágico delicioso en cada página.', '2024-11-03'),
            (15, 3, 5, 'El inicio de una saga maravillosa e inolvidable.', '2024-11-06')
        ]
        cursor.executemany('INSERT INTO resenas (libro_id, usuario_id, calificacion, comentario, fecha) VALUES (?, ?, ?, ?, ?)', resenas_data)
    
    conn.commit()
    conn.close()

init_db()

# ==================== ENDPOINTS CATEGORÍAS ====================

@app.get("/categorias")
def get_categorias():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM categorias ORDER BY nombre")
    categorias = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return categorias

@app.post("/categorias")
def create_categoria(categoria: Categoria):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
            (categoria.nombre, categoria.descripcion)
        )
        conn.commit()
        categoria_id = cursor.lastrowid
        conn.close()
        return {"id": categoria_id, **categoria.dict()}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="La categoría ya existe")

@app.put("/categorias/{categoria_id}")
def update_categoria(categoria_id: int, categoria: Categoria):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",
        (categoria.nombre, categoria.descripcion, categoria_id)
    )
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"id": categoria_id, **categoria.dict()}

@app.delete("/categorias/{categoria_id}")
def delete_categoria(categoria_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM categorias WHERE id = ?", (categoria_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"message": "Categoría eliminada correctamente"}

# ==================== ENDPOINTS AUTORES ====================

@app.get("/autores")
def get_autores():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM autores ORDER BY nombre")
    autores = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return autores

@app.post("/autores")
def create_autor(autor: Autor):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO autores (nombre, nacionalidad, fecha_nacimiento, biografia) VALUES (?, ?, ?, ?)",
        (autor.nombre, autor.nacionalidad, autor.fecha_nacimiento, autor.biografia)
    )
    conn.commit()
    autor_id = cursor.lastrowid
    conn.close()
    return {"id": autor_id, **autor.dict()}

@app.put("/autores/{autor_id}")
def update_autor(autor_id: int, autor: Autor):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE autores SET nombre = ?, nacionalidad = ?, fecha_nacimiento = ?, biografia = ? WHERE id = ?",
        (autor.nombre, autor.nacionalidad, autor.fecha_nacimiento, autor.biografia, autor_id)
    )
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Autor no encontrado")
    return {"id": autor_id, **autor.dict()}

@app.delete("/autores/{autor_id}")
def delete_autor(autor_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM autores WHERE id = ?", (autor_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Autor no encontrado")
    return {"message": "Autor eliminado correctamente"}

# ==================== ENDPOINTS LIBROS ====================

@app.get("/libros")
def get_libros():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT l.*, a.nombre as autor_nombre, c.nombre as categoria_nombre 
        FROM libros l 
        JOIN autores a ON l.autor_id = a.id 
        JOIN categorias c ON l.categoria_id = c.id
        ORDER BY l.titulo
    """)
    libros = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return libros

@app.post("/libros")
def create_libro(libro: Libro):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO libros (titulo, autor_id, categoria_id, isbn, año_publicacion, paginas, disponible) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (libro.titulo, libro.autor_id, libro.categoria_id, libro.isbn, libro.año_publicacion, libro.paginas, libro.disponible)
        )
        conn.commit()
        libro_id = cursor.lastrowid
        conn.close()
        return {"id": libro_id, **libro.dict()}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="El ISBN ya existe")

@app.put("/libros/{libro_id}")
def update_libro(libro_id: int, libro: Libro):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE libros SET titulo = ?, autor_id = ?, categoria_id = ?, isbn = ?, año_publicacion = ?, paginas = ?, disponible = ? WHERE id = ?",
        (libro.titulo, libro.autor_id, libro.categoria_id, libro.isbn, libro.año_publicacion, libro.paginas, libro.disponible, libro_id)
    )
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return {"id": libro_id, **libro.dict()}

@app.delete("/libros/{libro_id}")
def delete_libro(libro_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM libros WHERE id = ?", (libro_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Libro no encontrado")
    return {"message": "Libro eliminado correctamente"}

# ==================== ENDPOINTS USUARIOS ====================

@app.get("/usuarios")
def get_usuarios():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM usuarios ORDER BY nombre")
    usuarios = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return usuarios

@app.post("/usuarios")
def create_usuario(usuario: Usuario):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO usuarios (nombre, email, telefono, direccion, fecha_registro) VALUES (?, ?, ?, ?, ?)",
            (usuario.nombre, usuario.email, usuario.telefono, usuario.direccion, usuario.fecha_registro)
        )
        conn.commit()
        usuario_id = cursor.lastrowid
        conn.close()
        return {"id": usuario_id, **usuario.dict()}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="El email ya está registrado")

@app.put("/usuarios/{usuario_id}")
def update_usuario(usuario_id: int, usuario: Usuario):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE usuarios SET nombre = ?, email = ?, telefono = ?, direccion = ?, fecha_registro = ? WHERE id = ?",
        (usuario.nombre, usuario.email, usuario.telefono, usuario.direccion, usuario.fecha_registro, usuario_id)
    )
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"id": usuario_id, **usuario.dict()}

@app.delete("/usuarios/{usuario_id}")
def delete_usuario(usuario_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuarios WHERE id = ?", (usuario_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado correctamente"}

# ==================== ENDPOINTS PRÉSTAMOS ====================

@app.get("/prestamos")
def get_prestamos():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.*, l.titulo as libro_titulo, u.nombre as usuario_nombre, a.nombre as autor_nombre
        FROM prestamos p
        JOIN libros l ON p.libro_id = l.id
        JOIN usuarios u ON p.usuario_id = u.id
        JOIN autores a ON l.autor_id = a.id
        ORDER BY p.fecha_prestamo DESC
    """)
    prestamos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return prestamos

@app.post("/prestamos")
def create_prestamo(prestamo: Prestamo):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT disponible FROM libros WHERE id = ?", (prestamo.libro_id,))
    libro = cursor.fetchone()
    if not libro or not libro[0]:
        conn.close()
        raise HTTPException(status_code=400, detail="El libro no está disponible")
    
    cursor.execute(
        "INSERT INTO prestamos (libro_id, usuario_id, fecha_prestamo, fecha_devolucion_esperada, fecha_devolucion_real, devuelto) VALUES (?, ?, ?, ?, ?, ?)",
        (prestamo.libro_id, prestamo.usuario_id, prestamo.fecha_prestamo, prestamo.fecha_devolucion_esperada, prestamo.fecha_devolucion_real, prestamo.devuelto)
    )
    
    cursor.execute("UPDATE libros SET disponible = 0 WHERE id = ?", (prestamo.libro_id,))
    
    conn.commit()
    prestamo_id = cursor.lastrowid
    conn.close()
    return {"id": prestamo_id, **prestamo.dict()}

@app.put("/prestamos/{prestamo_id}/devolver")
def devolver_libro(prestamo_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT libro_id FROM prestamos WHERE id = ?", (prestamo_id,))
    prestamo = cursor.fetchone()
    if not prestamo:
        conn.close()
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    
    libro_id = prestamo[0]
    fecha_actual = datetime.now().strftime("%Y-%m-%d")
    
    cursor.execute(
        "UPDATE prestamos SET devuelto = 1, fecha_devolucion_real = ? WHERE id = ?",
        (fecha_actual, prestamo_id)
    )
    
    cursor.execute("UPDATE libros SET disponible = 1 WHERE id = ?", (libro_id,))
    
    conn.commit()
    conn.close()
    return {"message": "Libro devuelto correctamente"}

@app.delete("/prestamos/{prestamo_id}")
def delete_prestamo(prestamo_id: int):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT libro_id, devuelto FROM prestamos WHERE id = ?", (prestamo_id,))
    prestamo = cursor.fetchone()
    
    if not prestamo:
        conn.close()
        raise HTTPException(status_code=404, detail="Préstamo no encontrado")
    
    libro_id, devuelto = prestamo[0], prestamo[1]
    
    cursor.execute("DELETE FROM prestamos WHERE id = ?", (prestamo_id,))
    
    if not devuelto:
        cursor.execute("UPDATE libros SET disponible = 1 WHERE id = ?", (libro_id,))
    
    conn.commit()
    conn.close()
    return {"message": "Préstamo eliminado correctamente"}

# ==================== ENDPOINTS RESEÑAS ====================

@app.get("/resenas")
def get_resenas():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.*, l.titulo as libro_titulo, u.nombre as usuario_nombre
        FROM resenas r
        JOIN libros l ON r.libro_id = l.id
        JOIN usuarios u ON r.usuario_id = u.id
        ORDER BY r.fecha DESC
    """)
    resenas = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return resenas

@app.get("/resenas/libro/{libro_id}")
def get_resenas_libro(libro_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT r.*, u.nombre as usuario_nombre
        FROM resenas r
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.libro_id = ?
        ORDER BY r.fecha DESC
    """, (libro_id,))
    resenas = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return resenas

@app.post("/resenas")
def create_resena(resena: Resena):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO resenas (libro_id, usuario_id, calificacion, comentario, fecha) VALUES (?, ?, ?, ?, ?)",
        (resena.libro_id, resena.usuario_id, resena.calificacion, resena.comentario, resena.fecha)
    )
    conn.commit()
    resena_id = cursor.lastrowid
    conn.close()
    return {"id": resena_id, **resena.dict()}

@app.put("/resenas/{resena_id}")
def update_resena(resena_id: int, resena: Resena):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE resenas SET libro_id = ?, usuario_id = ?, calificacion = ?, comentario = ?, fecha = ? WHERE id = ?",
        (resena.libro_id, resena.usuario_id, resena.calificacion, resena.comentario, resena.fecha, resena_id)
    )
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    return {"id": resena_id, **resena.dict()}

@app.delete("/resenas/{resena_id}")
def delete_resena(resena_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM resenas WHERE id = ?", (resena_id,))
    conn.commit()
    conn.close()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    return {"message": "Reseña eliminada correctamente"}

# ==================== ESTADÍSTICAS ====================

@app.get("/estadisticas")
def get_estadisticas():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM libros")
    total_libros = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM autores")
    total_autores = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM usuarios")
    total_usuarios = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM prestamos WHERE devuelto = 0")
    prestamos_activos = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM categorias")
    total_categorias = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM resenas")
    total_resenas = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "total_libros": total_libros,
        "total_autores": total_autores,
        "total_usuarios": total_usuarios,
        "prestamos_activos": prestamos_activos,
        "total_categorias": total_categorias,
        "total_resenas": total_resenas
    }

@app.get("/")
def root():
    return {"message": "API de Biblioteca Completa - FastAPI + SQLite - 6 Tablas"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)