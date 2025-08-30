function sanitizeId(str) {
    return str.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
}

let todosLosDatos = [];

// Cargar datos
fetch('data/lotes.json')
    .then(res => res.json())
    .then(data => {
        todosLosDatos = data;
    });

$(document).ready(function () {
    const $input = $('#search-input');
    const $suggestions = $('#search-suggestions');

    $input.on('input', function () {
        const q = $(this).val().toLowerCase().trim();
        $suggestions.empty();

        if (!q) {
            $suggestions.removeClass('show');
            return;
        }

        const matches = [];

        todosLosDatos.forEach((lote, loteIndex) => {
            if (lote.lote.toLowerCase().includes(q)) {
                matches.push({
                    text: `🔹 Lote: ${lote.lote}`,
                    href: `index.html?lote=${loteIndex}&highlight=lote-${loteIndex}`
                });
            }
            if (lote.descripcion.toLowerCase().includes(q)) {
                matches.push({
                    text: `📄 Desc. Lote: ${lote.descripcion}`,
                    href: `index.html?lote=${loteIndex}&highlight=lote-${loteIndex}`
                });
            }

            lote.categorias.forEach((categoria, catIndex) => {
                if (categoria.nombre.toLowerCase().includes(q)) {
                    matches.push({
                        text: `📂 Categoría: ${categoria.nombre}`,
                        href: `categorias.html?lote=${loteIndex}&categoria=${catIndex}&highlight=categoria-${loteIndex}-${catIndex}`
                    });
                }

                (categoria.productos || []).forEach((producto, prodIndex) => {
                    const safeId = sanitizeId(producto.codigo);
                    if (producto.codigo.toLowerCase().includes(q)) {
                        matches.push({
                            text: `🔍 Producto: ${producto.codigo}`,
                            href: `detalles.html?lote=${loteIndex}&categoria=${catIndex}&highlight=${safeId}`
                        });
                    } else if (producto.descripcion && producto.descripcion.toLowerCase().includes(q)) {
                        matches.push({
                            text: `📝 Desc. Producto: ${producto.descripcion}`,
                            href: `detalles.html?lote=${loteIndex}&categoria=${catIndex}&highlight=${safeId}`
                        });
                    }
                });
            });
        });

        if (matches.length === 0) {
            $suggestions.html('<li class="list-group-item text-muted">Sin resultados</li>');
        } else {
            matches.slice(0, 10).forEach(match => {
                const $li = $('<li class="list-group-item"></li>');
                $li.html(`<a href="${match.href}">${match.text}</a>`);
                $suggestions.append($li);
            });
        }

        $suggestions.addClass('show');
    });

    // Ocultar sugerencias al hacer clic fuera
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#search-input, #search-suggestions').length) {
            $suggestions.removeClass('show');
        }
    });
});
