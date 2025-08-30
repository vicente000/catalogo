document.addEventListener('DOMContentLoaded', () => {
  const loteSelect = document.getElementById('lote-select');
  const categoriaSelect = document.getElementById('categoria-select');
  const generateBtn = document.getElementById('generate-report');
  const reportContainer = document.getElementById('report-content');

  let data = [];

  // Formatea números con 3 decimales y coma como separador decimal
  function formatoEuro(num) {
    return num.toFixed(3).replace('.', ',');
  }

  fetch('data/lotes.json')
    .then(res => res.json())
    .then(json => {
      data = json;

      // Rellenar selector de lote
      data.forEach((lote, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = lote.lote;
        loteSelect.appendChild(option);
      });
    });

  loteSelect.addEventListener('change', () => {
    categoriaSelect.innerHTML = '<option value="">-- Todas las categorías --</option>';
    const loteIndex = loteSelect.value;

    if (loteIndex !== '') {
      categoriaSelect.disabled = false;
      data[loteIndex].categorias.forEach((cat, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = cat.nombre;
        categoriaSelect.appendChild(option);
      });
    } else {
      categoriaSelect.disabled = true;
    }
  });

  // Generar PDF con jsPDF y autoTable
  generateBtn.addEventListener('click', () => {
    const loteIndex = loteSelect.value;
    const selectedOptions = Array.from(categoriaSelect.selectedOptions);
    const selectedCategoriaIndices = selectedOptions
      .filter(opt => opt.value !== '')
      .map(opt => parseInt(opt.value));

    const lotesFiltrados = (loteIndex === '') ? data : [data[loteIndex]];

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    let y = 10;

    lotesFiltrados.forEach((lote) => {
      const categorias = lote.categorias;
      const categoriasFiltradas =
        selectedCategoriaIndices.length > 0
          ? selectedCategoriaIndices.map(i => categorias[i])
          : categorias;

      let totalLote = 0;

      doc.setFontSize(14);
      doc.text(lote.lote, 10, y);
      y += 8;

      categoriasFiltradas.forEach((categoria) => {
        let totalCategoria = 0;

        const body = categoria.productos.map(prod => {
          const precio = parseFloat(prod.precio.replace(',', '.')) || 0;
          const cantidad = parseInt(prod.cantidad) || 0;
          const total = +(precio * cantidad).toFixed(3);
          totalCategoria += total;

          return [
            prod.codigo,
            prod.descripcion,
            prod.referencia,
            prod.fabricante,
            cantidad.toString(),
            `${formatoEuro(precio)} €`,
            `${formatoEuro(total)} €`,
          ];
        });

        totalLote += totalCategoria;

        doc.setFontSize(11);
        doc.text(categoria.nombre, 10, y);
        y += 6;

        doc.autoTable({
          startY: y,
          head: [[
            'Código', 'Descripción', 'Referencia',
            'Fabricante', 'Cantidad', 'Precio', 'Total'
          ]],
          body,
          styles: {
            fontSize: 6,
            overflow: 'linebreak',
            cellPadding: 0.5,  // padding interno en mm
          },
          headStyles: {
            fillColor: [124, 124, 124],
            cellPadding: 0.5,  // padding interno en mm
          },
          bodyStyles: {
            cellPadding: 0.5
          },
          theme: 'grid',
          margin: { left: 10, right: 10 },
          didDrawPage: (data) => {
            // Número de página en el pie
            const pageNumber = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Página ${pageNumber}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);

            // Actualizar cursor para el siguiente bloque
            y = data.cursor.y + 10;
          }
        });

        // Total categoría
        doc.setFontSize(9);
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.text(
          `Total categoría: ${formatoEuro(totalCategoria)} €`,
          pageWidth - 10, // margen derecho de 10 mm
          y,
          { align: 'right' }
        );
        y += 10;

      });

      // Total lote
      doc.setFontSize(10);
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.text(
        `Total lote: ${formatoEuro(totalLote)} €`,
        pageWidth - 10, // margen derecho de 10 mm 
        y,
        { align: 'right' }
      );
      y += 12;

      doc.setLineWidth(0.1);
      doc.line(10, y, 287, y); // línea divisoria
      y += 10;
    });

    doc.save('reporte-catalogo.pdf');
  });




});
