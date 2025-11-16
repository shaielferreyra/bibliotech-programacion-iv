
// Esta línea detecta automáticamente si estás en desarrollo o producción
// Reemplaza con tu URL REAL de Render
const API_URL = 'https://bibliotech-0eo9.onrender.com';
// Variables globales
let autores = [];
let libros = [];
let usuarios = [];
let prestamos = [];
let categorias = [];
let resenas = [];
let currentFilter = 'all';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initSearch();
    initFilterTabs();
    loadAllData();
    setDefaultDates();
});

// ==================== NAVEGACIÓN ====================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(`section-${section}`).classList.add('active');
            
            // Cerrar menú móvil
            document.getElementById('navList').classList.remove('active');
        });
    });
}

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
}

// ==================== BÚSQUEDA ====================

function initSearch() {
    document.getElementById('searchLibros').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = libros.filter(libro => 
            libro.titulo.toLowerCase().includes(term) ||
            libro.autor_nombre.toLowerCase().includes(term) ||
            libro.categoria_nombre.toLowerCase().includes(term) ||
            libro.isbn.toLowerCase().includes(term)
        );
        renderLibros(filtered);
    });
    
    document.getElementById('searchAutores').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = autores.filter(autor => 
            autor.nombre.toLowerCase().includes(term) ||
            autor.nacionalidad.toLowerCase().includes(term)
        );
        renderAutores(filtered);
    });
    
    document.getElementById('searchUsuarios').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = usuarios.filter(usuario => 
            usuario.nombre.toLowerCase().includes(term) ||
            usuario.email.toLowerCase().includes(term)
        );
        renderUsuarios(filtered);
    });
}

// ==================== FILTROS ====================

function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            filterPrestamos();
        });
    });
}

function filterPrestamos() {
    let filtered = prestamos;
    
    if (currentFilter === 'active') {
        filtered = prestamos.filter(p => !p.devuelto);
    } else if (currentFilter === 'returned') {
        filtered = prestamos.filter(p => p.devuelto);
    }
    
    renderPrestamos(filtered);
}

// ==================== CARGAR DATOS ====================

async function loadAllData() {
    await Promise.all([
        loadCategorias(),
        loadAutores(),
        loadLibros(),
        loadUsuarios(),
        loadPrestamos(),
        loadResenas()
    ]);
    updateStats();
}

async function loadCategorias() {
    try {
        const response = await fetch(`${API_URL}/categorias`);
        categorias = await response.json();
        renderCategorias(categorias);
        populateCategoriaSelects();
    } catch (error) {
        showToast('Error al cargar categorías', 'error');
        console.error(error);
    }
}

async function loadAutores() {
    try {
        const response = await fetch(`${API_URL}/autores`);
        autores = await response.json();
        renderAutores(autores);
        populateAutorSelects();
    } catch (error) {
        showToast('Error al cargar autores', 'error');
        console.error(error);
    }
}

async function loadLibros() {
    try {
        const response = await fetch(`${API_URL}/libros`);
        libros = await response.json();
        renderLibros(libros);
        populateLibroSelects();
    } catch (error) {
        showToast('Error al cargar libros', 'error');
        console.error(error);
    }
}

async function loadUsuarios() {
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        usuarios = await response.json();
        renderUsuarios(usuarios);
        populateUsuarioSelects();
    } catch (error) {
        showToast('Error al cargar usuarios', 'error');
        console.error(error);
    }
}

async function loadPrestamos() {
    try {
        const response = await fetch(`${API_URL}/prestamos`);
        prestamos = await response.json();
        filterPrestamos();
    } catch (error) {
        showToast('Error al cargar préstamos', 'error');
        console.error(error);
    }
}

async function loadResenas() {
    try {
        const response = await fetch(`${API_URL}/resenas`);
        resenas = await response.json();
        renderResenas(resenas);
    } catch (error) {
        showToast('Error al cargar reseñas', 'error');
        console.error(error);
    }
}

async function updateStats() {
    try {
        const response = await fetch(`${API_URL}/estadisticas`);
        const stats = await response.json();
        
        document.getElementById('totalLibros').textContent = stats.total_libros;
        document.getElementById('totalAutores').textContent = stats.total_autores;
        document.getElementById('totalUsuarios').textContent = stats.total_usuarios;
        document.getElementById('prestamosActivos').textContent = stats.prestamos_activos;
        document.getElementById('totalCategorias').textContent = stats.total_categorias;
        document.getElementById('totalResenas').textContent = stats.total_resenas;
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
}

// ==================== RENDERIZAR LIBROS ====================

function renderLibros(data) {
    const tbody = document.getElementById('tablaLibros');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="loading">No se encontraron libros</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(libro => `
        <tr>
            <td>${libro.id}</td>
            <td><strong>${libro.titulo}</strong></td>
            <td>${libro.autor_nombre}</td>
            <td><span class="badge badge-warning">${libro.categoria_nombre}</span></td>
            <td><code>${libro.isbn}</code></td>
            <td>${libro.año_publicacion}</td>
            <td>${libro.paginas}</td>
            <td>
                <span class="badge ${libro.disponible ? 'badge-success' : 'badge-danger'}">
                    <i class="fas ${libro.disponible ? 'fa-check' : 'fa-times'}"></i>
                    ${libro.disponible ? 'Disponible' : 'Prestado'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editLibro(${libro.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteLibro(${libro.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== RENDERIZAR AUTORES ====================

function renderAutores(data) {
    const grid = document.getElementById('autoresGrid');
    
    if (data.length === 0) {
        grid.innerHTML = '<div class="loading-card">No se encontraron autores</div>';
        return;
    }
    
    grid.innerHTML = data.map(autor => {
        const iniciales = autor.nombre.split(' ').map(n => n[0]).join('').substring(0, 2);
        const fecha = new Date(autor.fecha_nacimiento);
        const edad = new Date().getFullYear() - fecha.getFullYear();
        
        return `
            <div class="author-card">
                <div class="author-card-header">
                    <div class="author-avatar">${iniciales}</div>
                    <div>
                        <h3>${autor.nombre}</h3>
                    </div>
                </div>
                <div class="author-card-info">
                    <div>
                        <i class="fas fa-flag"></i>
                        <span>${autor.nacionalidad}</span>
                    </div>
                    <div>
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(autor.fecha_nacimiento)} (${edad} años)</span>
                    </div>
                    ${autor.biografia ? `
                        <div>
                            <i class="fas fa-book"></i>
                            <span>${autor.biografia}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="author-card-actions">
                    <button class="btn btn-sm btn-primary" onclick="editAutor(${autor.id})" style="flex: 1;">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAutor(${autor.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== RENDERIZAR USUARIOS ====================

function renderUsuarios(data) {
    const grid = document.getElementById('usuariosGrid');
    
    if (data.length === 0) {
        grid.innerHTML = '<div class="loading-card">No se encontraron usuarios</div>';
        return;
    }
    
    grid.innerHTML = data.map(usuario => {
        const iniciales = usuario.nombre.split(' ').map(n => n[0]).join('').substring(0, 2);
        
        return `
            <div class="user-card">
                <div class="user-card-header">
                    <div class="user-avatar">${iniciales}</div>
                    <div>
                        <h3>${usuario.nombre}</h3>
                    </div>
                </div>
                <div class="user-card-info">
                    <div>
                        <i class="fas fa-envelope"></i>
                        <span>${usuario.email}</span>
                    </div>
                    <div>
                        <i class="fas fa-phone"></i>
                        <span>${usuario.telefono}</span>
                    </div>
                    <div>
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${usuario.direccion}</span>
                    </div>
                    <div>
                        <i class="fas fa-calendar"></i>
                        <span>Registrado: ${formatDate(usuario.fecha_registro)}</span>
                    </div>
                </div>
                <div class="user-card-actions">
                    <button class="btn btn-sm btn-primary" onclick="editUsuario(${usuario.id})" style="flex: 1;">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUsuario(${usuario.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== RENDERIZAR PRÉSTAMOS ====================

function renderPrestamos(data) {
    const tbody = document.getElementById('tablaPrestamos');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No se encontraron préstamos</td></tr>';
        return;
    }
    
    tbody.innerHTML = data.map(prestamo => `
        <tr>
            <td>${prestamo.id}</td>
            <td>
                <strong>${prestamo.libro_titulo}</strong><br>
                <small>${prestamo.autor_nombre}</small>
            </td>
            <td>${prestamo.usuario_nombre}</td>
            <td>${formatDate(prestamo.fecha_prestamo)}</td>
            <td>
                ${prestamo.fecha_devolucion_real ? formatDate(prestamo.fecha_devolucion_real) : 
                  `<span class="badge badge-warning">${formatDate(prestamo.fecha_devolucion_esperada)}</span>`}
            </td>
            <td>
                <span class="badge ${prestamo.devuelto ? 'badge-success' : 'badge-warning'}">
                    ${prestamo.devuelto ? 'Devuelto' : 'Activo'}
                </span>
            </td>
            <td>
                ${!prestamo.devuelto ? `
                    <button class="btn btn-sm btn-success" onclick="devolverLibro(${prestamo.id})" title="Devolver">
                        <i class="fas fa-undo"></i>
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-danger" onclick="deletePrestamo(${prestamo.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ==================== RENDERIZAR CATEGORÍAS ====================

function renderCategorias(data) {
    const grid = document.getElementById('categoriasGrid');
    
    if (data.length === 0) {
        grid.innerHTML = '<div class="loading-card">No se encontraron categorías</div>';
        return;
    }
    
    const icons = ['book', 'graduation-cap', 'rocket', 'hat-wizard', 'heart', 'magnifying-glass', 
                   'user', 'feather', 'landmark', 'brain', 'ghost', 'map'];
    
    grid.innerHTML = data.map((categoria, index) => `
        <div class="category-card">
            <div class="category-header">
                <div class="category-icon">
                    <i class="fas fa-${icons[index % icons.length]}"></i>
                </div>
                <h3>${categoria.nombre}</h3>
            </div>
            <p>${categoria.descripcion}</p>
            <div class="category-card-actions">
                <button class="btn btn-sm btn-primary" onclick="editCategoria(${categoria.id})" style="flex: 1;">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategoria(${categoria.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== RENDERIZAR RESEÑAS ====================

function renderResenas(data) {
    const grid = document.getElementById('resenasGrid');
    
    if (data.length === 0) {
        grid.innerHTML = '<div class="loading-card">No se encontraron reseñas</div>';
        return;
    }
    
    grid.innerHTML = data.map(resena => {
        const estrellas = '⭐'.repeat(resena.calificacion);
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-book">${resena.libro_titulo}</div>
                    <div class="review-rating">${estrellas}</div>
                </div>
                <div class="review-user">
                    <i class="fas fa-user"></i>
                    <span>${resena.usuario_nombre}</span>
                </div>
                <div class="review-comment">${resena.comentario}</div>
                <div class="review-date">
                    <i class="fas fa-calendar"></i> ${formatDate(resena.fecha)}
                </div>
                <div class="review-actions">
                    <button class="btn btn-sm btn-primary" onclick="editResena(${resena.id})" style="flex: 1;">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteResena(${resena.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== FORMS - LIBROS ====================

document.getElementById('formLibro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('libroId').value;
    const data = {
        titulo: document.getElementById('libroTitulo').value,
        autor_id: parseInt(document.getElementById('libroAutor').value),
        categoria_id: parseInt(document.getElementById('libroCategoria').value),
        isbn: document.getElementById('libroISBN').value,
        año_publicacion: parseInt(document.getElementById('libroAño').value),
        paginas: parseInt(document.getElementById('libroPaginas').value),
        disponible: document.getElementById('libroDisponible').checked
    };
    
    try {
        const url = id ? `${API_URL}/libros/${id}` : `${API_URL}/libros`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast(`Libro ${id ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeModal('modalLibro');
            await loadLibros();
            updateStats();
        } else {
            const error = await response.json();
            showToast(error.detail || 'Error al guardar el libro', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
});

// ==================== FORMS - AUTORES ====================

document.getElementById('formAutor').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('autorId').value;
    const data = {
        nombre: document.getElementById('autorNombre').value,
        nacionalidad: document.getElementById('autorNacionalidad').value,
        fecha_nacimiento: document.getElementById('autorFecha').value,
        biografia: document.getElementById('autorBiografia').value || null
    };
    
    try {
        const url = id ? `${API_URL}/autores/${id}` : `${API_URL}/autores`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast(`Autor ${id ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeModal('modalAutor');
            await loadAutores();
            updateStats();
        } else {
            showToast('Error al guardar el autor', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
});

// ==================== FORMS - USUARIOS ====================

document.getElementById('formUsuario').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('usuarioId').value;
    const data = {
        nombre: document.getElementById('usuarioNombre').value,
        email: document.getElementById('usuarioEmail').value,
        telefono: document.getElementById('usuarioTelefono').value,
        direccion: document.getElementById('usuarioDireccion').value,
        fecha_registro: document.getElementById('usuarioFechaRegistro').value
    };
    
    try {
        const url = id ? `${API_URL}/usuarios/${id}` : `${API_URL}/usuarios`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast(`Usuario ${id ? 'actualizado' : 'creado'} correctamente`, 'success');
            closeModal('modalUsuario');
            await loadUsuarios();
            updateStats();
        } else {
            const error = await response.json();
            showToast(error.detail || 'Error al guardar el usuario', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
});

// ==================== FORMS - PRÉSTAMOS ====================

document.getElementById('formPrestamo').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        libro_id: parseInt(document.getElementById('prestamoLibro').value),
        usuario_id: parseInt(document.getElementById('prestamoUsuario').value),
        fecha_prestamo: document.getElementById('prestamoFecha').value,
        fecha_devolucion_esperada: document.getElementById('prestamoFechaDevolucion').value,
        devuelto: false
    };
    
    try {
        const response = await fetch(`${API_URL}/prestamos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast('Préstamo registrado correctamente', 'success');
            closeModal('modalPrestamo');
            await loadPrestamos();
            await loadLibros();
            updateStats();
        } else {
            const error = await response.json();
            showToast(error.detail || 'Error al registrar el préstamo', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
});

// ==================== FORMS - CATEGORÍAS ====================

document.getElementById('formCategoria').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('categoriaId').value;
    const data = {
        nombre: document.getElementById('categoriaNombre').value,
        descripcion: document.getElementById('categoriaDescripcion').value
    };
    
    try {
        const url = id ? `${API_URL}/categorias/${id}` : `${API_URL}/categorias`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast(`Categoría ${id ? 'actualizada' : 'creada'} correctamente`, 'success');
            closeModal('modalCategoria');
            await loadCategorias();
            updateStats();
        } else {
            const error = await response.json();
            showToast(error.detail || 'Error al guardar la categoría', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
});

// ==================== FORMS - RESEÑAS ====================

document.getElementById('formResena').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('resenaId').value;
    const data = {
        libro_id: parseInt(document.getElementById('resenaLibro').value),
        usuario_id: parseInt(document.getElementById('resenaUsuario').value),
        calificacion: parseInt(document.getElementById('resenaCalificacion').value),
        comentario: document.getElementById('resenaComentario').value,
        fecha: document.getElementById('resenaFecha').value
    };
    
    try {
        const url = id ? `${API_URL}/resenas/${id}` : `${API_URL}/resenas`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showToast(`Reseña ${id ? 'actualizada' : 'creada'} correctamente`, 'success');
            closeModal('modalResena');
            await loadResenas();
            updateStats();
        } else {
            showToast('Error al guardar la reseña', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
});

// ==================== FUNCIONES EDIT ====================

function editLibro(id) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;
    
    document.getElementById('libroId').value = libro.id;
    document.getElementById('libroTitulo').value = libro.titulo;
    document.getElementById('libroAutor').value = libro.autor_id;
    document.getElementById('libroCategoria').value = libro.categoria_id;
    document.getElementById('libroISBN').value = libro.isbn;
    document.getElementById('libroAño').value = libro.año_publicacion;
    document.getElementById('libroPaginas').value = libro.paginas;
    document.getElementById('libroDisponible').checked = libro.disponible;
    document.getElementById('tituloModalLibro').textContent = 'Editar Libro';
    
    openModal('modalLibro');
}

function editAutor(id) {
    const autor = autores.find(a => a.id === id);
    if (!autor) return;
    
    document.getElementById('autorId').value = autor.id;
    document.getElementById('autorNombre').value = autor.nombre;
    document.getElementById('autorNacionalidad').value = autor.nacionalidad;
    document.getElementById('autorFecha').value = autor.fecha_nacimiento;
    document.getElementById('autorBiografia').value = autor.biografia || '';
    document.getElementById('tituloModalAutor').textContent = 'Editar Autor';
    
    openModal('modalAutor');
}

function editUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('usuarioNombre').value = usuario.nombre;
    document.getElementById('usuarioEmail').value = usuario.email;
    document.getElementById('usuarioTelefono').value = usuario.telefono;
    document.getElementById('usuarioDireccion').value = usuario.direccion;
    document.getElementById('usuarioFechaRegistro').value = usuario.fecha_registro;
    document.getElementById('tituloModalUsuario').textContent = 'Editar Usuario';
    
    openModal('modalUsuario');
}

function editCategoria(id) {
    const categoria = categorias.find(c => c.id === id);
    if (!categoria) return;
    
    document.getElementById('categoriaId').value = categoria.id;
    document.getElementById('categoriaNombre').value = categoria.nombre;
    document.getElementById('categoriaDescripcion').value = categoria.descripcion;
    document.getElementById('tituloModalCategoria').textContent = 'Editar Categoría';
    
    openModal('modalCategoria');
}

function editResena(id) {
    const resena = resenas.find(r => r.id === id);
    if (!resena) return;
    
    document.getElementById('resenaId').value = resena.id;
    document.getElementById('resenaLibro').value = resena.libro_id;
    document.getElementById('resenaUsuario').value = resena.usuario_id;
    document.getElementById('resenaCalificacion').value = resena.calificacion;
    document.getElementById('resenaComentario').value = resena.comentario;
    document.getElementById('resenaFecha').value = resena.fecha;
    document.getElementById('tituloModalResena').textContent = 'Editar Reseña';
    
    openModal('modalResena');
}

// ==================== FUNCIONES DELETE ====================

async function deleteLibro(id) {
    if (!confirm('¿Estás seguro de eliminar este libro?')) return;
    
    try {
        const response = await fetch(`${API_URL}/libros/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            showToast('Libro eliminado correctamente', 'success');
            await loadLibros();
            updateStats();
        } else {
            showToast('Error al eliminar el libro', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
}

async function deleteAutor(id) {
    if (!confirm('¿Estás seguro de eliminar este autor?')) return;
    
    try {
        const response = await fetch(`${API_URL}/autores/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            showToast('Autor eliminado correctamente', 'success');
            await loadAutores();
            updateStats();
        } else {
            showToast('Error al eliminar el autor', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
}

async function deleteUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            showToast('Usuario eliminado correctamente', 'success');
            await loadUsuarios();
            updateStats();
        } else {
            showToast('Error al eliminar el usuario', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
}

async function deletePrestamo(id) {
    if (!confirm('¿Estás seguro de eliminar este préstamo?')) return;
    
    try {
        const response = await fetch(`${API_URL}/prestamos/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            showToast('Préstamo eliminado correctamente', 'success');
            await loadPrestamos();
            await loadLibros();
            updateStats();
        } else {
            showToast('Error al eliminar el préstamo', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
}

async function deleteCategoria(id) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
        const response = await fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            showToast('Categoría eliminada correctamente', 'success');
            await loadCategorias();
            updateStats();
        } else {
            showToast('Error al eliminar la categoría', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
}

async function deleteResena(id) {
    if (!confirm('¿Estás seguro de eliminar esta reseña?')) return;
    
    try {
        const response = await fetch(`${API_URL}/resenas/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            showToast('Reseña eliminada correctamente', 'success');
            await loadResenas();
            updateStats();
        } else {
            showToast('Error al eliminar la reseña', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
}

// ==================== DEVOLVER LIBRO ====================

async function devolverLibro(id) {
    try {
        const response = await fetch(`${API_URL}/prestamos/${id}/devolver`, { method: 'PUT' });
        
        if (response.ok) {
            showToast('Libro devuelto correctamente', 'success');
            await loadPrestamos();
            await loadLibros();
            updateStats();
        } else {
            showToast('Error al devolver el libro', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
        console.error(error);
    }
}

// ==================== POBLAR SELECTS ====================

function populateCategoriaSelects() {
    const select = document.getElementById('libroCategoria');
    select.innerHTML = '<option value="">Seleccione...</option>';
    categorias.forEach(categoria => {
        select.innerHTML += `<option value="${categoria.id}">${categoria.nombre}</option>`;
    });
}

function populateAutorSelects() {
    const select = document.getElementById('libroAutor');
    select.innerHTML = '<option value="">Seleccione...</option>';
    autores.forEach(autor => {
        select.innerHTML += `<option value="${autor.id}">${autor.nombre}</option>`;
    });
}

function populateLibroSelects() {
    const selectPrestamo = document.getElementById('prestamoLibro');
    const selectResena = document.getElementById('resenaLibro');
    
    const optionsHTML = '<option value="">Seleccione...</option>' + 
        libros.map(libro => `<option value="${libro.id}">${libro.titulo} - ${libro.autor_nombre}</option>`).join('');
    
    selectPrestamo.innerHTML = optionsHTML;
    selectResena.innerHTML = optionsHTML;
}

function populateUsuarioSelects() {
    const selectPrestamo = document.getElementById('prestamoUsuario');
    const selectResena = document.getElementById('resenaUsuario');
    
    const optionsHTML = '<option value="">Seleccione...</option>' + 
        usuarios.map(usuario => `<option value="${usuario.id}">${usuario.nombre}</option>`).join('');
    
    selectPrestamo.innerHTML = optionsHTML;
    selectResena.innerHTML = optionsHTML;
}

// ==================== MODALES ====================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    
    // Reset form si es crear nuevo
    if (modalId === 'modalLibro' && !document.getElementById('libroId').value) {
        document.getElementById('formLibro').reset();
        document.getElementById('tituloModalLibro').textContent = 'Agregar Libro';
        document.getElementById('libroDisponible').checked = true;
    }
    if (modalId === 'modalAutor' && !document.getElementById('autorId').value) {
        document.getElementById('formAutor').reset();
        document.getElementById('tituloModalAutor').textContent = 'Agregar Autor';
    }
    if (modalId === 'modalUsuario' && !document.getElementById('usuarioId').value) {
        document.getElementById('formUsuario').reset();
        document.getElementById('tituloModalUsuario').textContent = 'Agregar Usuario';
        setDefaultDates();
    }
    if (modalId === 'modalPrestamo') {
        document.getElementById('formPrestamo').reset();
        setDefaultDates();
    }
    if (modalId === 'modalCategoria' && !document.getElementById('categoriaId').value) {
        document.getElementById('formCategoria').reset();
        document.getElementById('tituloModalCategoria').textContent = 'Agregar Categoría';
    }
    if (modalId === 'modalResena' && !document.getElementById('resenaId').value) {
        document.getElementById('formResena').reset();
        document.getElementById('tituloModalResena').textContent = 'Agregar Reseña';
        setDefaultDates();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    
    // Limpiar IDs ocultos
    if (modalId === 'modalLibro') {
        document.getElementById('libroId').value = '';
    }
    if (modalId === 'modalAutor') {
        document.getElementById('autorId').value = '';
    }
    if (modalId === 'modalUsuario') {
        document.getElementById('usuarioId').value = '';
    }
    if (modalId === 'modalCategoria') {
        document.getElementById('categoriaId').value = '';
    }
    if (modalId === 'modalResena') {
        document.getElementById('resenaId').value = '';
    }
}

// Cerrar modal al hacer click fuera
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// ==================== UTILIDADES ====================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (document.getElementById('prestamoFecha')) {
        document.getElementById('prestamoFecha').value = today;
    }
    if (document.getElementById('prestamoFechaDevolucion')) {
        document.getElementById('prestamoFechaDevolucion').value = twoWeeksLater;
    }
    if (document.getElementById('usuarioFechaRegistro')) {
        document.getElementById('usuarioFechaRegistro').value = today;
    }
    if (document.getElementById('resenaFecha')) {
        document.getElementById('resenaFecha').value = today;
    }
}
// ==================== TOASTS ====================
// Muestra un mensaje toast en la pantalla
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}