const urlParams = new URLSearchParams(window.location.search);

// spinner
const highlight = urlParams.get('highlight');

// Mostrar el spinner solo si hay una búsqueda activa
if (highlight) {
    const loadingEl = document.getElementById('loading-spinner');
    if (loadingEl) loadingEl.style.display = 'block';
}
const loteIndex = parseInt(urlParams.get('lote') || 0);

fetch('data/lotes.json')
    .then(res => res.json())
    .then(lotes => {
        const lote = lotes[loteIndex];
        document.getElementById('titulo-lote').textContent = lote.lote;

        const container = document.getElementById('categorias-container');

        lote.categorias.forEach((categoria, catIndex) => {
            const col = document.createElement('div');
            col.className = "col-md-6";

            const imagenesHTML = (categoria.imagenes || []).slice(0, 4).map(src => `
        <img src="${src}" class="img-thumbnail me-2 img-default" alt="${categoria.nombre}" />
      `).join("");

            const card = document.createElement('div');
            card.className = "card h-100 shadow-sm p-3";
            card.id = `categoria-${loteIndex}-${catIndex}`;

            card.innerHTML = `
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${categoria.nombre}</h5>
          <p class="card-text">${categoria.descripcion || ''}</p>
          <div class="d-flex align-items-center justify-content-between flex-wrap mb-3">
            <div class="d-flex flex-wrap align-items-center">${imagenesHTML}</div>
            <a href="detalles.html?lote=${loteIndex}&categoria=${catIndex}" class="btn btn-primary mt-2 mt-md-0">Ver productos</a>
          </div>
        </div>
      `;

            col.appendChild(card);
            container.appendChild(col);
        });

        // Resaltado si es el card buscado
        const highlightId = urlParams.get('highlight');
        if (highlightId) {
            setTimeout(() => {
                const highlightCard = document.getElementById(highlightId);
                if (highlightCard) {
                    highlightCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    highlightCard.classList.add('highlight-card');

                    // Eliminar el resaltado suavemente después de 4 segundos
                    setTimeout(() => {
                        highlightCard.classList.remove('highlight-card');
                    }, 4000);
                }

                // spinner off
                const loadingEl = document.getElementById('loading-spinner');
                if (loadingEl) loadingEl.style.display = 'none';

            }, 300); // pequeño retardo para asegurar que las cards se han renderizado
        }
    });