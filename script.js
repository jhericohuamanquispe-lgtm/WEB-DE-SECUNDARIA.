// Base de datos inicial de comunicados y avisos institucionales (Nivel Secundaria)
const anunciosIniciales = [
    {
        id: 1,
        titulo: "XXIII Aniversario - Campeonato de Ex Alumnos 2026",
        categoria: "secundaria",
        fecha: "Lunes 19 de Octubre, 2026",
        descripcion: "¡Gran campeonato deportivo por nuestro XXIII Aniversario! Disciplinas: Futsal (Masculino) y Vóley (Femenino). Hora: 8:00 AM en los campos deportivos de la I.E. Informes e inscripciones: 929 706 819 - 993 720 439. ¡Habrá grandes premios y sorpresas!",
        afiche: "campeonato-exalumnos.jpg"
    },
  
];

// Obtener anuncios guardados en el navegador o usar los iniciales
let anuncios = JSON.parse(localStorage.getItem('anuncios_ie_chipa')) || anunciosIniciales;

// Elementos del DOM
const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const botonesFiltro = document.querySelectorAll('.btn-filtro');
const btnMenuMovil = document.getElementById('btnMenuMovil');
const navLinks = document.getElementById('navLinks');
const btnVolverArriba = document.getElementById('btnVolverArriba');
const inputBuscador = document.getElementById('inputBuscador');
const toastContainer = document.getElementById('toastContainer');

// SISTEMA DE NOTIFICACIONES TOAST PROFESIONALES
function mostrarToast(mensaje, icono = "fa-circle-check") {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icono}"></i> <span>${mensaje}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// CONTROL DE CONTADORES NUMÉRICOS ANIMADOS
function iniciarContadores() {
    const contadores = document.querySelectorAll('.contador');
    contadores.forEach(contador => {
        const target = +contador.getAttribute('data-target');
        let count = 0;
        const velocidad = target / 40;

        const actualizarConteo = () => {
            count += velocidad;
            if (count < target) {
                contador.innerText = Math.ceil(count);
                setTimeout(actualizarConteo, 35);
            } else {
                contador.innerText = target + (target === 100 ? '%' : '+');
            }
        };
        actualizarConteo();
    });
}

// BOTONES DE ACCESIBILIDAD (Aumentar / Reducir Letra)
const btnAumentarLetra = document.getElementById('btnAumentarLetra');
const btnReducirLetra = document.getElementById('btnReducirLetra');
let escalaActual = 1;

if (btnAumentarLetra && btnReducirLetra) {
    btnAumentarLetra.addEventListener('click', () => {
        if (escalaActual < 1.25) {
            escalaActual += 0.1;
            document.documentElement.style.setProperty('--font-scale', `${escalaActual}rem`);
            mostrarToast("Tamaño de letra aumentado para mayor legibilidad.");
        }
    });

    btnReducirLetra.addEventListener('click', () => {
        if (escalaActual > 0.9) {
            escalaActual -= 0.1;
            document.documentElement.style.setProperty('--font-scale', `${escalaActual}rem`);
            mostrarToast("Tamaño de letra ajustado.");
        }
    });
}

// Control del menú móvil (hamburguesa)
if (btnMenuMovil && navLinks) {
    btnMenuMovil.addEventListener('click', () => {
        navLinks.classList.toggle('activo');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('activo');
        });
    });
}

// Botón volver arriba dinámico según scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        btnVolverArriba.classList.add('visible');
    } else {
        btnVolverArriba.classList.remove('visible');
    }
});

if (btnVolverArriba) {
    btnVolverArriba.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Función para renderizar tarjetas con filtros y buscador en tiempo real
function mostrarAnuncios(filtro = 'todos', busqueda = '') {
    if (!contenedorTarjetas) return;
    contenedorTarjetas.innerHTML = '';

    let anunciosFiltrados = filtro === 'todos' 
        ? anuncios 
        : anuncios.filter(anuncio => anuncio.categoria === filtro);

    if (busqueda.trim() !== '') {
        const query = busqueda.toLowerCase();
        anunciosFiltrados = anunciosFiltrados.filter(anuncio => 
            anuncio.titulo.toLowerCase().includes(query) || 
            anuncio.descripcion.toLowerCase().includes(query)
        );
    }

    if (anunciosFiltrados.length === 0) {
        contenedorTarjetas.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No se encontraron comunicados con los criterios de búsqueda.</p>`;
        return;
    }

    anunciosFiltrados.slice().reverse().forEach(anuncio => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'tarjeta-anuncio';
        
        tarjeta.innerHTML = `
            <img src="${anuncio.afiche}" alt="Afiche de ${anuncio.titulo}" class="tarjeta-afiche" onerror="this.src='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'">
            <div class="tarjeta-contenido">
                <span class="badge-categoria">${anuncio.categoria}</span>
                <h3>${anuncio.titulo}</h3>
                <p>${anuncio.descripcion}</p>
                <span class="fecha-anuncio"><i class="fa-regular fa-calendar"></i> ${anuncio.fecha}</span>
            </div>
        `;

        contenedorTarjetas.appendChild(tarjeta);
    });
}

// Filtros interactivos del Tablero
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', (e) => {
        botonesFiltro.forEach(b => b.classList.remove('activo'));
        e.currentTarget.classList.add('activo');
        
        const categoriaSeleccionada = e.currentTarget.getAttribute('data-filtro');
        const textoBusqueda = inputBuscador ? inputBuscador.value : '';
        mostrarAnuncios(categoriaSeleccionada, textoBusqueda);
    });
});

// Evento Buscador en Tiempo Real
if (inputBuscador) {
    inputBuscador.addEventListener('input', (e) => {
        const categoriaActiva = document.querySelector('.btn-filtro.activo').getAttribute('data-filtro');
        mostrarAnuncios(categoriaActiva, e.target.value);
    });
}

// Manejo del formulario de contacto hacia el WhatsApp del Director
const formContacto = document.getElementById('formContacto');

if (formContacto) {
    formContacto.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombreRemitente').value.trim();
        const asunto = document.getElementById('asuntoMensaje').value.trim();
        const mensajeTexto = document.getElementById('textoMensaje').value.trim();
        
        const numeroWhatsAppDirector = "51963642884"; 

        const mensajeWhatsApp = `*¡Nueva Consulta desde el Portal Web!*%0A%0A` +
                                `*Remitente:* ${nombre}%0A` +
                                `*Asunto:* ${asunto}%0A` +
                                `*Mensaje:* ${mensajeTexto}`;

        const urlWhatsApp = `https://wa.me/${numeroWhatsAppDirector}?text=${mensajeWhatsApp}`;

        mostrarToast(`¡Mensaje preparado para WhatsApp con éxito!`);
        window.open(urlWhatsApp, '_blank');
        formContacto.reset();
    });
}

// Lógica de seguridad y panel de administración exclusivo para el Director
const btnAbrirAdmin = document.getElementById('btnAbrirAdmin');
const modalAdmin = document.getElementById('modalAdmin');
const btnCerrarAdmin = document.getElementById('btnCerrarAdmin');
const seccionClave = document.getElementById('seccionClave');
const panelGestionAdmin = document.getElementById('panelGestionAdmin');
const inputClaveDirector = document.getElementById('inputClaveDirector');
const btnVerificarClave = document.getElementById('btnVerificarClave');
const formAdminAnuncio = document.getElementById('formAdminAnuncio');
const listaAdminBorrar = document.getElementById('listaAdminBorrar');

const CLAVE_DIRECTOR_SECRETA = "Chipa2026*"; 

if (btnAbrirAdmin && modalAdmin) {
    btnAbrirAdmin.addEventListener('click', () => {
        modalAdmin.style.display = 'flex';
        if (inputClaveDirector) inputClaveDirector.value = '';
        if (seccionClave) seccionClave.style.display = 'block';
        if (panelGestionAdmin) panelGestionAdmin.style.display = 'none';
    });

    if (btnCerrarAdmin) {
        btnCerrarAdmin.addEventListener('click', () => {
            modalAdmin.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalAdmin) {
            modalAdmin.style.display = 'none';
        }
    });
}

// Función para renderizar la lista de anuncios dentro del panel del director (para poder borrarlos)
function cargarListaParaBorrar() {
    if (!listaAdminBorrar) return;
    listaAdminBorrar.innerHTML = '';

    if (anuncios.length === 0) {
        listaAdminBorrar.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.85rem;">No hay anuncios publicados.</p>`;
        return;
    }

    anuncios.slice().reverse().forEach(anuncio => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-glass);";
        
        item.innerHTML = `
            <div style="overflow: hidden; margin-right: 1rem;">
                <strong style="font-size: 0.9rem; color: var(--text-primary); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">${anuncio.titulo}</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">${anuncio.fecha}</span>
            </div>
            <button onclick="eliminarAnuncio(${anuncio.id})" style="background: #ff5555; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; flex-shrink: 0;"><i class="fa-solid fa-trash"></i> Borrar</button>
        `;
        listaAdminBorrar.appendChild(item);
    });
}

// Función global para eliminar un anuncio
window.eliminarAnuncio = function(id) {
    if (confirm("¿Estás seguro de eliminar este comunicado del tablero institucional?")) {
        anuncios = anuncios.filter(a => a.id !== id);
        localStorage.setItem('anuncios_ie_chipa', JSON.stringify(anuncios));
        
        const categoriaActiva = document.querySelector('.btn-filtro.activo').getAttribute('data-filtro');
        const textoBusqueda = inputBuscador ? inputBuscador.value : '';
        mostrarAnuncios(categoriaActiva, textoBusqueda);
        cargarListaParaBorrar();
        mostrarToast("Comunicado eliminado exitosamente.", "fa-trash-can");
    }
};

// Validación de la clave secreta del Director
if (btnVerificarClave) {
    btnVerificarClave.addEventListener('click', () => {
        const claveIngresada = inputClaveDirector.value.trim();
        
        if (claveIngresada === CLAVE_DIRECTOR_SECRETA) {
            mostrarToast("¡Acceso autorizado, Prof. Ricardo Solis Chacon!");
            seccionClave.style.display = 'none';
            panelGestionAdmin.style.display = 'block';
            cargarListaParaBorrar();
        } else {
            mostrarToast("Clave incorrecta. Acceso denegado.", "fa-triangle-exclamation");
            inputClaveDirector.value = '';
        }
    });
}

// Envío y almacenamiento de anuncios procesando la imagen seleccionada
if (formAdminAnuncio) {
    formAdminAnuncio.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputArchivo = document.getElementById('adminAfiche');
        const archivo = inputArchivo.files[0];

        if (archivo) {
            const lector = new FileReader();
            
            lector.onload = function(eventoLectura) {
                const urlImagen = eventoLectura.target.result;

                const nuevoAnuncio = {
                    id: Date.now(),
                    titulo: document.getElementById('adminTitulo').value.trim(),
                    categoria: document.getElementById('adminCategoria').value,
                    fecha: document.getElementById('adminFecha').value.trim(),
                    afiche: urlImagen,
                    descripcion: document.getElementById('adminDescripcion').value.trim()
                };

                anuncios.push(nuevoAnuncio);
                localStorage.setItem('anuncios_ie_chipa', JSON.stringify(anuncios));

                mostrarToast("¡Anuncio y foto publicados correctamente en el tablero!");
                
                formAdminAnuncio.reset();
                modalAdmin.style.display = 'none';
                
                const categoriaActiva = document.querySelector('.btn-filtro.activo').getAttribute('data-filtro');
                const textoBusqueda = inputBuscador ? inputBuscador.value : '';
                mostrarAnuncios(categoriaActiva, textoBusqueda);
            };

            lector.readAsDataURL(archivo);
        }
    });
}

// Renderizado inicial al cargar la página web
document.addEventListener('DOMContentLoaded', () => {
    mostrarAnuncios('todos');
    iniciarContadores();
});