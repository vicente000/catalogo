const urlParams = new URLSearchParams(window.location.search);

// spinner
const highlight = urlParams.get('highlight');

// Mostrar el spinner solo si hay una búsqueda activa
if (highlight) {
    const loadingEl = document.getElementById('loading-spinner');
    if (loadingEl) loadingEl.style.display = 'block';
}

const loteIndex = parseInt(urlParams.get('lote') || 0);
const categoriaIndex = urlParams.has('categoria') ? parseInt(urlParams.get('categoria')) : null;

fetch('data/lotes.json')
    .then(res => res.json())
    .then(lotes => {
        const lote = lotes[loteIndex];
        document.getElementById('titulo-lote').textContent = lote.lote;

        const contenedor = document.getElementById('contenedor-productos');

        const categoriasAMostrar = categoriaIndex !== null ? [lote.categorias[categoriaIndex]] : lote.categorias;

        categoriasAMostrar.forEach((categoria, cIndex) => {
            const seccion = document.createElement('div');
            seccion.className = 'mb-5';
            seccion.innerHTML = `<h4 class="mb-3">${categoria.nombre}</h4>`;

            const fila = document.createElement('div');
            fila.className = 'row g-4';

            function sanitizeId(str) {
                return str.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
            }

            categoria.productos.forEach((producto, pIndex) => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4';

                const safeId = sanitizeId(producto.codigo);
                const imagenesHTML = (producto.imagenes || []).map((src, i) => `
          <div class="col-6 col-md-3">
            <img src="${src}" class="img-thumbnail card-img-hover" alt="${producto.codigo}" 
                 data-bs-toggle="modal" data-bs-target="#modal-${safeId}-${pIndex}-${i}" />
          </div>
          <div class="modal fade" id="modal-${safeId}-${pIndex}-${i}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
              <div class="modal-content">
                <div class="modal-body text-center">
                  <img src="${src}" class="img-fluid rounded" alt="${producto.codigo}" />
                </div>
              </div>
            </div>
          </div>
        `).join("");

                col.innerHTML = `
          <div class="card h-100 shadow-sm" id="${safeId}">
            <div class="card-body">
              <h5 class="card-title">${producto.codigo}</h5>
              <p class="card-text">${producto.descripcion === 'n/d' ? 'Descripción no disponible' : producto.descripcion}</p>
              <ul class="list-unstyled mb-3">
                <li><strong>Fabricante:</strong> ${producto.fabricante || 'n/d'}</li>
                <li><strong>Referencia:</strong> ${producto.referencia ? producto.referencia : 'n/d'}</li>
                <li><strong>Cantidad:</strong> ${producto.cantidad}</li>
                <li><strong>Precio/unidad:</strong> ${producto.precio} €</li>
                ${producto.notas ? `<li><strong>Notas:</strong> ${producto.notas}</li>` : ''}
              </ul>
              <div class="row g-2">
                ${imagenesHTML}
              </div>
            </div>
          </div>
        `;

                fila.appendChild(col);
            });

            seccion.appendChild(fila);
            contenedor.appendChild(seccion);
        });

        // Resaltar si hay highlight en la URL
        const highlightId = urlParams.get('highlight');
        if (highlightId) {
            setTimeout(() => {
                const highlightCard = document.getElementById(highlightId);
                if (highlightCard) {
                    highlightCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    highlightCard.classList.add('highlight-card');

                    // Eliminar el resaltado suavemente después de 3 segundos
                    setTimeout(() => {
                        highlightCard.classList.remove('highlight-card');
                    }, 4000);
                }

                // Spinner off 
                const loadingEl = document.getElementById('loading-spinner');
                if (loadingEl) loadingEl.style.display = 'none';

            }, 1500);
        }
    });