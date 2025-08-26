let allRecipes = [];

fetch('recipes.json')
    .then(response => response.json())
    .then(data => {
        allRecipes = data;
        loadCategories(allRecipes);
        renderRecipes(allRecipes);
    })
    .catch(error => console.error("Error al cargar las recetas:", error));

function renderRecipes(recipes, category = "Todas", searchTerm = "") {
    const container = document.getElementById('recipes-container');
    container.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const filtered = recipes.filter(r => {
        const matchCategory = category === "Todas" || r.category === category;
        const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (r.ingredients && r.ingredients.join(', ').toLowerCase().includes(searchTerm.toLowerCase()));

        const matchFavorite = !showFavoritesOnly || favorites.includes(r.id);

        return matchCategory && matchSearch && matchFavorite;
    });
        

    filtered.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Tiempo: </strong>${recipe.time}</p>
            <p><strong>Dificultad: </strong>${recipe.difficulty}</p>
            <button class="favorite-btn">
                ${isFavorite(recipe.id) ? '💖' : '🤍'} Favorito
            </button>
        `;

        card.addEventListener('click', () => {
            showModal(recipe);
        });

        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
        });
        container.appendChild(card);
    });
};

function toggleFavorite(id) {
    let favorites = JSON .parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    }else{
        favorites.push(id);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    const selectedCategory = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('search-input')?.value || "";
    renderRecipes(allRecipes, selectedCategory, searchTerm);
}

function isFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return  favorites.includes(id);
}

function loadCategories(recipes) {
    const select = document.getElementById('category-filter');
    const categories = ["Todas", ...new Set(recipes.map(r => r.category))];

    select.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

document.getElementById('category-filter').addEventListener('change', function(){
    renderRecipes(allRecipes, this.value);
})

function showModal(recipe) {
    document.getElementById('modal-img').src = recipe.image;
    document.getElementById('modal-title').textContent = recipe.title;
    document.getElementById('modal-time').textContent = recipe.time;
    document.getElementById('modal-difficulty').textContent = recipe.difficulty;

    const ingredientsList = document.getElementById('modal-ingredients');
    ingredientsList.innerHTML = '';
    recipe.ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        ingredientsList.appendChild(li);
    });

    const stepsList = document.getElementById('modal-steps');
    stepsList.innerHTML = '';
    recipe.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsList.appendChild(li);
    });

    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    setTimeout(() => modal.classList.add('hidden'), 300);
});


document.getElementById('search-input').addEventListener('input', function () {
    const searchTerm = this.value;
    const selectedCategory = document.getElementById('category-filter').value;
    renderRecipes(allRecipes, selectedCategory, searchTerm);
})

document.getElementById('category-filter').addEventListener('change', function(){
    const searchTerm = document.getElementById('search-input').value;
    renderRecipes(allRecipes, this.value, searchTerm);

})

let showFavoritesOnly = false;

const favoritesToggle = document.getElementById('favorites-toggle');
favoritesToggle.addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    favoritesToggle.classList.toggle('active', showFavoritesOnly);
    favoritesToggle.textContent = showFavoritesOnly ? '💖' : '🤍';
    
    const category = document.getElementById('category-filter').value;
    const search = document.getElementById('search-input').value;
    renderRecipes(allRecipes, category, search);
});

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent =  '🌙';
        localStorage.setItem('theme', 'light');
    }
});