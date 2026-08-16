// ==========================================
// 💕 NUESTRO CALENDARIO
// ==========================================

let currentDate = new Date();

let data = JSON.parse(localStorage.getItem("loveCalendar")) || {
    periodDate: "",
    periodLength: 5,
    cycleLength: 28,
    relations: []
};

// ------------------------------------------
// ELEMENTOS
// ------------------------------------------

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");

const periodDateInput = document.getElementById("periodDate");
const periodLengthInput = document.getElementById("periodLength");
const cycleLengthInput = document.getElementById("cycleLength");

const relationDateInput = document.getElementById("relationDate");
const relationNoteInput = document.getElementById("relationNote");

const nextPeriodElement = document.getElementById("nextPeriod");
const ovulationElement = document.getElementById("ovulationDate");
const fertileElement = document.getElementById("fertileDates");

const relationCountElement = document.getElementById("relationCount");
const cycleInfoElement = document.getElementById("cycleInfo");


// ------------------------------------------
// FECHA ACTUAL
// ------------------------------------------

const today = new Date();

function formatDate(date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ------------------------------------------
// FORMATO BONITO DE FECHA
// ------------------------------------------

function prettyDate(dateString) {

    if (!dateString) return "--";

    const date = new Date(dateString + "T12:00:00");

    return date.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// ------------------------------------------
// SUMAR DÍAS
// ------------------------------------------

function addDays(date, days) {

    const result = new Date(date);

    result.setDate(result.getDate() + days);

    return result;
}


// ------------------------------------------
// GUARDAR DATOS
// ------------------------------------------

function saveData() {

    localStorage.setItem(
        "loveCalendar",
        JSON.stringify(data)
    );
}


// ------------------------------------------
// CALCULAR CICLO
// ------------------------------------------

function calculateCycle() {

    if (!data.periodDate) {
        nextPeriodElement.textContent = "--";
        ovulationElement.textContent = "--";
        fertileElement.textContent = "--";
        return;
    }

    const firstPeriod = new Date(
        data.periodDate + "T12:00:00"
    );

    // Próximo periodo
    const nextPeriod = addDays(
        firstPeriod,
        Number(data.cycleLength)
    );

    // Ovulación estimada:
    // aproximadamente 14 días antes del siguiente periodo
    const ovulation = addDays(
        nextPeriod,
        -14
    );

    // Ventana fértil aproximada:
    // 5 días antes + día de ovulación + 1 día después
    const fertileStart = addDays(
        ovulation,
        -5
    );

    const fertileEnd = addDays(
        ovulation,
        1
    );

    nextPeriodElement.textContent =
        prettyDate(formatDate(nextPeriod));

    ovulationElement.textContent =
        prettyDate(formatDate(ovulation));

    fertileElement.textContent =
        `${prettyDate(formatDate(fertileStart))} - ${prettyDate(formatDate(fertileEnd))}`;

    cycleInfoElement.textContent =
        data.cycleLength;
}


// ------------------------------------------
// CALENDARIO
// ------------------------------------------

function renderCalendar() {

    calendar.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay();

    // Convertir domingo = 0 a lunes = 0
    startDay = startDay === 0 ? 6 : startDay - 1;

    const monthName = currentDate.toLocaleDateString(
        "es-PE",
        {
            month: "long",
            year: "numeric"
        }
    );

    monthTitle.textContent =
        monthName.charAt(0).toUpperCase() +
        monthName.slice(1);


    // Días vacíos
    for (let i = 0; i < startDay; i++) {

        const empty = document.createElement("div");

        empty.className = "day empty";

        calendar.appendChild(empty);
    }


    // Días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {

        const date = new Date(year, month, day);

        const dateString = formatDate(date);

        const dayElement = document.createElement("div");

        dayElement.className = "day";


        // Número
        const number = document.createElement("div");

        number.className = "day-number";

        number.textContent = day;

        dayElement.appendChild(number);


        // Hoy
        if (dateString === formatDate(today)) {

            dayElement.classList.add("today");

            const todayLabel = document.createElement("span");

            todayLabel.className = "day-label";

            todayLabel.textContent = "Hoy";

            dayElement.appendChild(todayLabel);
        }


        // ----------------------------------
        // PERIODO
        // ----------------------------------

        if (data.periodDate) {

            const periodStart =
                new Date(data.periodDate + "T12:00:00");

            const periodEnd =
                addDays(
                    periodStart,
                    Number(data.periodLength) - 1
                );

            if (
                date >= periodStart &&
                date <= periodEnd
            ) {

                dayElement.classList.add("period");

                const label =
                    document.createElement("span");

                label.className = "day-label";

                label.textContent = "🩸 Periodo";

                dayElement.appendChild(label);
            }


            // ----------------------------------
            // FERTILIDAD
            // ----------------------------------

            const nextPeriod =
                addDays(
                    periodStart,
                    Number(data.cycleLength)
                );

            const ovulation =
                addDays(nextPeriod, -14);

            const fertileStart =
                addDays(ovulation, -5);

            const fertileEnd =
                addDays(ovulation, 1);


            if (
                date >= fertileStart &&
                date <= fertileEnd
            ) {

                dayElement.classList.add("fertile");

                const label =
                    document.createElement("span");

                label.className = "day-label";

                label.textContent = "🌸 Fértil";

                dayElement.appendChild(label);
            }


            // Ovulación
            if (
                dateString === formatDate(ovulation)
            ) {

                dayElement.classList.remove("fertile");

                dayElement.classList.add("ovulation");

                const label =
                    document.createElement("span");

                label.className = "day-label";

                label.textContent = "🌸 Ovulación";

                dayElement.appendChild(label);
            }
        }


        // ----------------------------------
        // RELACIONES ❤️
        // ----------------------------------

        const relationsThisDay =
            data.relations.filter(
                relation =>
                    relation.date === dateString
            );

        if (relationsThisDay.length > 0) {

            dayElement.classList.add("relation-day");

            const heart =
                document.createElement("div");

            heart.className = "relation-heart";

            heart.textContent = "♥";

            dayElement.appendChild(heart);
        }


        // ----------------------------------
        // CLICK EN DÍA
        // ----------------------------------

        dayElement.addEventListener(
            "click",
            () => {

                relationDateInput.value =
                    dateString;

                relationNoteInput.focus();

                window.scrollTo({
                    top:
                        document.querySelector(
                            ".relation-btn"
                        ).offsetTop - 250,
                    behavior: "smooth"
                });
            }
        );


        calendar.appendChild(dayElement);
    }
}


// ------------------------------------------
// LISTA DE RELACIONES
// ------------------------------------------

function renderRelations() {

    const list =
        document.getElementById("relationsList");

    list.innerHTML = "";

    const sorted =
        [...data.relations].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    sorted.forEach((relation, index) => {

        const item =
            document.createElement("div");

        item.className =
            "relation-item";


        const info =
            document.createElement("div");

        info.className =
            "relation-info";

        info.innerHTML = `
            <strong>
                ❤️ ${prettyDate(relation.date)}
            </strong>
            <small>
                ${relation.note || "Sin nota"}
            </small>
        `;


        const button =
            document.createElement("button");

        button.className =
            "remove-relation";

        button.textContent =
            "Eliminar";


        button.addEventListener(
            "click",
            () => {

                const realIndex =
                    data.relations.findIndex(
                        r =>
                            r.id === relation.id
                    );

                if (realIndex !== -1) {

                    data.relations.splice(
                        realIndex,
                        1
                    );

                    saveData();

                    renderCalendar();
                    renderRelations();
                    updateSummary();
                }
            }
        );


        item.appendChild(info);

        item.appendChild(button);

        list.appendChild(item);
    });
}


// ------------------------------------------
// RESUMEN
// ------------------------------------------

function updateSummary() {

    relationCountElement.textContent =
        data.relations.length;

    cycleInfoElement.textContent =
        data.cycleLength;

    calculateCycle();
}


// ------------------------------------------
// BOTÓN CALCULAR
// ------------------------------------------

document
    .getElementById("calculateBtn")
    .addEventListener(
        "click",
        () => {

            if (!periodDateInput.value) {

                alert(
                    "Selecciona el primer día del periodo."
                );

                return;
            }

            data.periodDate =
                periodDateInput.value;

            data.periodLength =
                Number(periodLengthInput.value);

            data.cycleLength =
                Number(cycleLengthInput.value);

            saveData();

            calculateCycle();

            renderCalendar();

            alert(
                "💕 ¡Ciclo actualizado correctamente!"
            );
        }
    );


// ------------------------------------------
// AGREGAR RELACIÓN
// ------------------------------------------

document
    .getElementById("addRelation")
    .addEventListener(
        "click",
        () => {

            const date =
                relationDateInput.value;

            if (!date) {

                alert(
                    "Selecciona una fecha."
                );

                return;
            }


            const note =
                relationNoteInput.value.trim();


            const alreadyExists =
                data.relations.some(
                    relation =>
                        relation.date === date
                );


            // Permitir varias relaciones
            // el mismo día
            data.relations.push({

                id:
                    Date.now(),

                date:
                    date,

                note:
                    note
            });


            saveData();

            relationNoteInput.value = "";

            renderCalendar();

            renderRelations();

            updateSummary();

            alert(
                "❤️ Relación registrada."
            );
        }
    );


// ------------------------------------------
// CAMBIAR MES
// ------------------------------------------

document
    .getElementById("prevMonth")
    .addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() - 1
            );

            renderCalendar();
        }
    );


document
    .getElementById("nextMonth")
    .addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );

            renderCalendar();
        }
    );


// ------------------------------------------
// CARGAR DATOS
// ------------------------------------------

function loadData() {

    if (data.periodDate) {

        periodDateInput.value =
            data.periodDate;

        periodLengthInput.value =
            data.periodLength;

        cycleLengthInput.value =
            data.cycleLength;
    }

    relationDateInput.value =
        formatDate(today);

    renderCalendar();

    renderRelations();

    updateSummary();
}


// ------------------------------------------
// BORRAR TODO
// ------------------------------------------

document
    .getElementById("clearData")
    .addEventListener(
        "click",
        () => {

            const confirmation =
                confirm(
                    "⚠️ ¿Seguro que quieres borrar TODOS los datos?"
                );

            if (!confirmation) return;

            localStorage.removeItem(
                "loveCalendar"
            );

            data = {

                periodDate: "",

                periodLength: 5,

                cycleLength: 28,

                relations: []
            };

            periodDateInput.value = "";

            periodLengthInput.value = 5;

            cycleLengthInput.value = 28;

            relationDateInput.value =
                formatDate(today);

            relationNoteInput.value = "";

            renderCalendar();

            renderRelations();

            updateSummary();
        }
    );


// ------------------------------------------
// INICIAR
// ------------------------------------------

loadData();
