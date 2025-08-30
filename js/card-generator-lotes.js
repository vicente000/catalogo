function getHighlightParam() {
    const urlParams = new URLSearchParams(window.location.search);

    // spinner
    const highlight = urlParams.get('highlight');

    // Mostrar el spinner solo si hay una búsqueda activa
    if (highlight) {
        const loadingEl = document.getElementById('loading-spinner');
        if (loadingEl) loadingEl.style.display = 'block';
    }


    return urlParams.get('highlight'); // puede ser "lote-0"
}

fetch('data/lotes.json')
    .then(res => res.json())
    .then(lotes => {
        const container = document.getElementById('lotes-container');
        const highlightId = getHighlightParam(); // e.g. "lote-2"

        lotes.forEach((lote, loteIndex) => {
            const col = document.createElement('div');
            col.className = "col-md-6";

            const imagenesHTML = (lote.imagenes || []).slice(0, 5).map(src => `
          <img src="${src}" class="img-thumbnail me-2 img-default" alt="Imagen lote ${lote.lote}" />
        `).join('');

            const card = document.createElement('div');
            const cardId = `lote-${loteIndex}`;
            card.className = "card h-100 shadow-sm";
            card.id = cardId;

            // Resaltado si es el card buscado
            if (highlightId === cardId) {
                setTimeout(() => {
                    card.scrollIntoView({ behavior: "smooth", block: "center" });

                    card.classList.add('highlight-card');

                    // Eliminar el resaltado suavemente después de 4 segundos
                    setTimeout(() => {
                        card.classList.remove('highlight-card');
                    }, 4000);

                    // spinner off
                    const loadingEl = document.getElementById('loading-spinner');
                    if (loadingEl) loadingEl.style.display = 'none';
                }, 300); // pequeño delay para asegurar renderizado
            }

            card.innerHTML = `
          <div class="card-body">
              <h5 class="card-title">${lote.lote}</h5>
              <p class="card-text">${lote.descripcion}</p>
              <div class="d-flex justify-content-between align-items-center flex-wrap">
                  <div class="d-flex flex-wrap align-items-center">
                      ${imagenesHTML}
                  </div>
                  <a href="categorias.html?lote=${loteIndex}" class="btn btn-primary mt-2 mt-md-0">Ver categorías</a>
              </div>
          </div>
        `;

            col.appendChild(card);
            container.appendChild(col);
        });
    });
