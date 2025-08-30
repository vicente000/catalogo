// BreadCrumb

document.addEventListener('DOMContentLoaded', () => {
  const breadcrumb = document.getElementById('breadcrumb-nav');
  if (!breadcrumb) return;

  const urlParams = new URLSearchParams(window.location.search);
  const page = window.location.pathname.split('/').pop();

  const loteIndex = urlParams.get('lote');
  const categoriaIndex = urlParams.get('categoria');

  const crumbs = [
    { label: 'Inicio', href: 'index.html' },
  ];

  fetch('data/lotes.json')
    .then(res => res.json())
    .then(lotes => {
      if (loteIndex !== null && lotes[loteIndex]) {
        const lote = lotes[loteIndex];
        crumbs.push({
          label: `${lote.lote}`,
          href: `categorias.html?lote=${loteIndex}`
        });

        if (categoriaIndex !== null && lote.categorias[categoriaIndex]) {
          const categoria = lote.categorias[categoriaIndex];
          crumbs.push({
            label: `Categoría: ${categoria.nombre}`,
            href: `detalles.html?lote=${loteIndex}&categoria=${categoriaIndex}`
          });
        }
      }

      // Renderizar breadcrumb
      crumbs.forEach((item, i) => {
        const li = document.createElement('li');
        const isLast = i === crumbs.length - 1;

        li.className = 'breadcrumb-item' + (isLast ? ' active' : '');

        if (item.href && !isLast) {
          li.innerHTML = `<a href="${item.href}">${item.label}</a>`;
        } else {
          // Envolver en span para aplicar estilos sin afectar el separador
          li.innerHTML = `<span class="active-label" aria-current="page">${item.label}</span>`;
        }

        breadcrumb.appendChild(li);
      });
    });
});