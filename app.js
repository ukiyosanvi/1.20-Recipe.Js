const RecipeApp = (() => {

    /* ================= DATA ================= */
    const recipes = [
        {
            id: 1,
            title: "Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Classic Italian pasta.",
            ingredients: [
                "Spaghetti", "Eggs", "Cheese", "Pancetta", "Pepper"
            ],
            steps: [
                "Boil pasta",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Beat eggs",
                        "Add cheese",
                        {
                            text: "Season",
                            substeps: ["Add pepper", "Mix well"]
                        }
                    ]
                },
                "Mix pasta with sauce",
                "Serve hot"
            ]
        },
        {
            id: 2,
            title: "Veg Sandwich",
            time: 10,
            difficulty: "easy",
            description: "Quick vegetable sandwich.",
            ingredients: ["Bread", "Tomato", "Cucumber", "Butter"],
            steps: [
                "Cut vegetables",
                "Butter bread",
                "Assemble sandwich"
            ]
        }
    ];

    let currentFilter = "all";
    let currentSort = "none";

    const recipeContainer = document.getElementById("recipe-container");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const sortButtons = document.querySelectorAll(".sort-btn");

    /* ================= RECURSION ================= */
    const renderSteps = (steps, level = 0) => {
        const listClass = level === 0 ? "steps-list" : "substeps-list";
        let html = `<ol class="${listClass}">`;

        steps.forEach(step => {
            if (typeof step === "string") {
                html += `<li>${step}</li>`;
            } else {
                html += `<li>${step.text}`;
                if (step.substeps) {
                    html += renderSteps(step.substeps, level + 1);
                }
                html += `</li>`;
            }
        });

        html += "</ol>";
        return html;
    };

    const createStepsHTML = (steps) => {
        if (!steps || steps.length === 0) {
            return "<p>No steps available</p>";
        }
        return renderSteps(steps);
    };

    /* ================= CARD ================= */
    const createRecipeCard = (recipe) => {
        return `
            <div class="recipe-card">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <span>⏱ ${recipe.time} min</span>
                    <span class="difficulty ${recipe.difficulty}">
                        ${recipe.difficulty}
                    </span>
                </div>
                <p>${recipe.description}</p>

                <div class="card-actions">
                    <button class="toggle-btn"
                        data-toggle="ingredients"
                        data-recipe-id="${recipe.id}">
                        Show Ingredients
                    </button>
                    <button class="toggle-btn"
                        data-toggle="steps"
                        data-recipe-id="${recipe.id}">
                        Show Steps
                    </button>
                </div>

                <div class="ingredients-container"
                     data-recipe-id="${recipe.id}">
                    <h4>Ingredients</h4>
                    <ul>
                        ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
                    </ul>
                </div>

                <div class="steps-container"
                     data-recipe-id="${recipe.id}">
                    <h4>Steps</h4>
                    ${createStepsHTML(recipe.steps)}
                </div>
            </div>
        `;
    };

    /* ================= FILTER / SORT ================= */
    const updateDisplay = () => {
        let result = [...recipes];

        if (currentFilter !== "all") {
            result = result.filter(r => r.difficulty === currentFilter);
        }

        if (currentSort === "name") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (currentSort === "time") {
            result.sort((a, b) => a.time - b.time);
        }

        recipeContainer.innerHTML =
            result.map(createRecipeCard).join("");
    };

    /* ================= EVENTS ================= */
    const handleToggleClick = (e) => {
        const btn = e.target.closest(".toggle-btn");
        if (!btn) return;

        const type = btn.dataset.toggle;
        const id = btn.dataset.recipeId;

        const container = document.querySelector(
            `.${type}-container[data-recipe-id="${id}"]`
        );

        container.classList.toggle("visible");

        btn.textContent = container.classList.contains("visible")
            ? `Hide ${type}`
            : `Show ${type}`;
    };

    const handleFilterClick = (e) => {
        currentFilter = e.target.dataset.filter;
        updateDisplay();
    };

    const handleSortClick = (e) => {
        currentSort = e.target.dataset.sort;
        updateDisplay();
    };

    const setupEventListeners = () => {
        filterButtons.forEach(b =>
            b.addEventListener("click", handleFilterClick)
        );
        sortButtons.forEach(b =>
            b.addEventListener("click", handleSortClick)
        );
        recipeContainer.addEventListener("click", handleToggleClick);
    };

    const init = () => {
        setupEventListeners();
        updateDisplay();
        console.log("RecipeApp ready!");
    };

    return { init };

})();

RecipeApp.init();
