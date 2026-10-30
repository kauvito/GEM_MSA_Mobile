const params = new URLSearchParams(window.location.search);
const selectedIds = new Set(params.get("items")?.split(",").filter(Boolean) || []);
const questionsContainer = document.getElementById("exam-questions");
const title = params.get("type") || "Atividade Complementar";
document.title = `${title} · GEM MSA`;
document.getElementById("exam-title").textContent = title;

let number = 0;
sections.forEach((section, sectionIndex) => {
    section.questions.forEach((question, questionIndex) => {
        const id = `${sectionIndex}:${questionIndex}`;
        if (!selectedIds.has(id)) return;

        const item = document.createElement("section");
        item.className = "exam-question";

        const text = document.createElement("p");
        text.textContent = `${++number}. ${question}`;
        item.append(text);

        for (const file of visualMap[id] || []) {
            const path = visualAssets[file];
            if (!path) {
                console.error(`Não foi encontrado o arquivo de imagem para ${file}.`);
                continue;
            }

            const image = document.createElement("img");
            image.src = path;
            image.alt = "Figura original do exercício";
            image.className = "music-figure";
            item.append(image);
        }

        questionsContainer.append(item);
    });
});

if (!number) {
    questionsContainer.textContent = "Nenhum exercício foi selecionado. Volte ao catálogo para montar a prova.";
}

document.getElementById("print-btn").addEventListener("click", () => {
    if (window.AndroidBridge && typeof window.AndroidBridge.printExam === "function") {
        window.AndroidBridge.printExam(title);
    } else {
        window.print();
    }
});
