const receta = JSON.parse(localStorage.getItem('receta-seleccionada'));

if (!receta) {
    document.getElementById('detalle-receta').innerHTML = "<p>No sse encontró la receta.</p>"
} else {
    const container = document.getElementById('detalle-receta');
    container.innerHTML = `
    <h1>${receta.title}</h1>
    <img src="${receta.image}" alt="${receta.title}" style="max-width: 100%; height: auto;">
    <p><strong>Tiempo:</strong> ${receta.time}</p>
    <p><strong>Dificultad:</strong> ${receta.difficulty}</p>
        <h3>Ingredientes</h3>
        <ul>${receta.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
        <h3>Pasos</h3>
        <ol>${receta.steps.map(s => `<li>${s}</li>`).join('')}</ol>
        <button onclick="history.back()">← Volver</button>
    `;
}