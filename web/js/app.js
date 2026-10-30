const chosen = new Set();
const period = document.getElementById("period");
const lesson = document.getElementById("lesson");
const catalog = document.getElementById("catalog-list");
const search = document.getElementById("search");

for (const value of [...new Set(sections.map(section => section.period))]) {
    period.add(new Option(`Período ${value}`, value));
}

function updateLessons() {
    lesson.replaceChildren(new Option("Todas as aulas", ""));
    sections
        .filter(section => !period.value || section.period === period.value)
        .forEach(section => lesson.add(new Option(section.title, section.title)));
}

function addVisual(container, id) {
    for (const file of visualMap[id] || []) {
        const path = visualAssets[file];
        if (!path) {
            console.error(`Não foi encontrado o arquivo de imagem para ${file}.`);
            continue;
        }

        const img = document.createElement("img");
        img.src = path;
        img.alt = "Figura original do exercício";
        img.className = "music-figure";
        img.loading = "lazy";
        container.append(img);
    }
}

function render() {
    catalog.replaceChildren();
    const query = search.value.trim().toLocaleLowerCase("pt-BR");
    let visibleQuestions = 0;

    sections.forEach((section, sectionIndex) => {
        if (period.value && section.period !== period.value) return;
        if (lesson.value && section.title !== lesson.value) return;

        const matchingQuestions = section.questions
            .map((question, questionIndex) => ({ question, questionIndex }))
            .filter(({ question }) => !query || question.toLocaleLowerCase("pt-BR").includes(query));
        if (!matchingQuestions.length) return;

        const sectionCard = document.createElement("section");
        sectionCard.className = "section-card";

        const heading = document.createElement("h3");
        heading.className = "section-heading";
        const marker = document.createElement("span");
        marker.className = "section-marker";
        marker.textContent = section.period;
        const title = document.createElement("span");
        title.textContent = section.title;
        heading.append(marker, title);
        sectionCard.append(heading);

        matchingQuestions.forEach(({ question, questionIndex }) => {
            const id = `${sectionIndex}:${questionIndex}`;
            const item = document.createElement("article");
            item.className = "exercise";

            const label = document.createElement("label");
            label.className = "check-wrap";
            label.setAttribute("aria-label", "Selecionar exercício");

            const checkbox = document.createElement("input");
            checkbox.className = "exercise-check";
            checkbox.type = "checkbox";
            checkbox.checked = chosen.has(id);
            checkbox.addEventListener("change", () => {
                checkbox.checked ? chosen.add(id) : chosen.delete(id);
                updateCount();
            });

            const checkmark = document.createElement("span");
            checkmark.className = "checkmark";
            checkmark.setAttribute("aria-hidden", "true");
            checkmark.textContent = "✓";
            label.append(checkbox, checkmark);

            const content = document.createElement("div");
            content.className = "exercise-content";
            const text = document.createElement("p");
            text.textContent = question;
            content.append(text);
            addVisual(content, id);

            item.append(label, content);
            sectionCard.append(item);
            visibleQuestions += 1;
        });

        catalog.append(sectionCard);
    });

    document.getElementById("empty-state").hidden = visibleQuestions > 0;
}

function updateCount() {
    const count = chosen.size;
    document.getElementById("count").textContent = count;
    document.getElementById("mobile-count").textContent = count;
    document.getElementById("selection-total").textContent = count;
    document.getElementById("selection-label").textContent = count === 1
        ? "exercício selecionado"
        : "exercícios selecionados";
    const url = new URL("prova.html", window.location.href);
    url.searchParams.set("items", [...chosen].join(","));
    url.searchParams.set("type", document.getElementById("type").value);
    document.getElementById("generate-link").href = url.href;
    document.getElementById("mobile-build-link").href = url.href;
    document.getElementById("selection-generate-link").href = url.href;
    renderSelection();
}

function renderSelection() {
    const selectionList = document.getElementById("selection-list");
    selectionList.replaceChildren();

    sections.forEach((section, sectionIndex) => {
        const selectedQuestions = section.questions
            .map((question, questionIndex) => ({ question, id: `${sectionIndex}:${questionIndex}` }))
            .filter(({ id }) => chosen.has(id));
        if (!selectedQuestions.length) return;

        const sectionCard = document.createElement("section");
        sectionCard.className = "section-card";

        const heading = document.createElement("h3");
        heading.className = "section-heading";
        const marker = document.createElement("span");
        marker.className = "section-marker";
        marker.textContent = section.period;
        const title = document.createElement("span");
        title.textContent = section.title;
        heading.append(marker, title);
        sectionCard.append(heading);

        selectedQuestions.forEach(({ question, id }) => {
            const item = document.createElement("article");
            item.className = "exercise";

            const label = document.createElement("label");
            label.className = "check-wrap selection-remove";
            label.setAttribute("aria-label", "Remover exercício da seleção");

            const checkbox = document.createElement("input");
            checkbox.className = "exercise-check";
            checkbox.type = "checkbox";
            checkbox.checked = true;
            checkbox.setAttribute("aria-label", "Remover exercício da seleção");
            checkbox.addEventListener("change", () => {
                chosen.delete(id);
                updateCount();
                render();
            });

            const checkmark = document.createElement("span");
            checkmark.className = "checkmark";
            checkmark.setAttribute("aria-hidden", "true");
            checkmark.textContent = "✓";
            label.append(checkbox, checkmark);

            const content = document.createElement("div");
            content.className = "exercise-content";
            const text = document.createElement("p");
            text.textContent = question;
            content.append(text);
            addVisual(content, id);

            item.append(label, content);
            sectionCard.append(item);
        });

        selectionList.append(sectionCard);
    });

    document.getElementById("selection-empty").hidden = chosen.size > 0;
}

function clearAll() {
    chosen.clear();
    updateCount();
    render();
}

function validateExamLink(event) {
    if (!chosen.size) {
        event.preventDefault();
        alert("Selecione ao menos um exercício para gerar a prova.");
    }
}

period.addEventListener("change", () => {
    updateLessons();
    render();
});
lesson.addEventListener("change", render);
search.addEventListener("input", render);
document.getElementById("clear-btn").addEventListener("click", clearAll);
document.getElementById("generate-link").addEventListener("click", validateExamLink);
document.getElementById("mobile-build-link").addEventListener("click", validateExamLink);
document.getElementById("selection-generate-link").addEventListener("click", validateExamLink);
document.getElementById("type").addEventListener("change", updateCount);

function showView(hash, updateHistory = true) {
    const selectionView = hash === "#selection-summary";
    document.body.classList.toggle("selection-view", selectionView);
    document.getElementById("selection-summary").hidden = !selectionView;

    document.querySelectorAll(".nav-link").forEach(link => {
        const active = link.hash === hash;
        link.classList.toggle("active", active);
        if (active) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    if (updateHistory && window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
    }

    const target = document.getElementById(selectionView ? "selection-summary" : hash.slice(1));
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        showView(link.hash);
    });
});

document.querySelector(".brand").addEventListener("click", event => {
    event.preventDefault();
    showView("#inicio");
});

document.getElementById("new-selection-link").addEventListener("click", event => {
    event.preventDefault();
    showView("#catalog");
});

window.addEventListener("popstate", () => {
    showView(window.location.hash || "#inicio", false);
});

updateLessons();
render();
updateCount();
if (window.location.hash === "#selection-summary") {
    showView("#selection-summary", false);
}
