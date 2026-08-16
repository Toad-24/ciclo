// ============================================
// 💕 NUESTRO ESPACIO
// ============================================

let currentDate = new Date();

let data =
    JSON.parse(
        localStorage.getItem("loveCalendar")
    ) || {

        periodDate: "",

        periodLength: 5,

        cycleLength: 28,

        relations: []
    };


let selectedProtection = "";


// ============================================
// ELEMENTOS
// ============================================

const calendar =
    document.getElementById("calendar");

const monthTitle =
    document.getElementById("monthTitle");

const periodDateInput =
    document.getElementById("periodDate");

const periodLengthInput =
    document.getElementById("periodLength");

const cycleLengthInput =
    document.getElementById("cycleLength");

const relationDateInput =
    document.getElementById("relationDate");

const today = new Date();


// ============================================
// UTILIDADES
// ============================================

function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function prettyDate(dateString) {

    if (!dateString)
        return "--";

    const date =
        new Date(
            dateString +
            "T12:00:00"
        );

    return date.toLocaleDateString(
        "es-PE",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


function addDays(date, days) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() + days
    );

    return result;
}


function saveData() {

    localStorage.setItem(
        "loveCalendar",
        JSON.stringify(data)
    );
}


// ============================================
// CAMBIAR SECCIONES
// ============================================

function showSection(sectionId) {

    document
        .getElementById(
            "calendarSection"
        )
        .classList.add("hidden");

    document
        .getElementById(
            "memoriesSection"
        )
        .classList.add("hidden");


    document
        .getElementById(
            sectionId
        )
        .classList.remove("hidden");


    if (
        sectionId ===
        "memoriesSection"
    ) {

        loadMemories();
    }
}


// ============================================
// PROTECCIÓN
// ============================================

function selectProtection(type) {

    selectedProtection =
        type;


    document
        .getElementById(
            "protectedBtn"
        )
        .classList.remove(
            "selected"
        );

    document
        .getElementById(
            "unprotectedBtn"
        )
        .classList.remove(
            "selected"
        );


    if (
        type ===
        "protected"
    ) {

        document
            .getElementById(
                "protectedBtn"
            )
            .classList.add(
                "selected"
            );
    }


    if (
        type ===
        "unprotected"
    ) {

        document
            .getElementById(
                "unprotectedBtn"
            )
            .classList.add(
                "selected"
            );
    }
}


// ============================================
// CICLO
// ============================================

function calculateCycle() {

    if (!data.periodDate) {

        document
            .getElementById(
                "nextPeriod"
            )
            .textContent = "--";

        document
            .getElementById(
                "ovulationDate"
            )
            .textContent = "--";

        document
            .getElementById(
                "fertileDates"
            )
            .textContent = "--";

        return;
    }


    const firstPeriod =
        new Date(
            data.periodDate +
            "T12:00:00"
        );


    const nextPeriod =
        addDays(
            firstPeriod,
            Number(
                data.cycleLength
            )
        );


    const ovulation =
        addDays(
            nextPeriod,
            -14
        );


    const fertileStart =
        addDays(
            ovulation,
            -5
        );


    const fertileEnd =
        addDays(
            ovulation,
            1
        );


    document
        .getElementById(
            "nextPeriod"
        )
        .textContent =
        prettyDate(
            formatDate(nextPeriod)
        );


    document
        .getElementById(
            "ovulationDate"
        )
        .textContent =
        prettyDate(
            formatDate(ovulation)
        );


    document
        .getElementById(
            "fertileDates"
        )
        .textContent =
        `${prettyDate(
            formatDate(fertileStart)
        )} - ${prettyDate(
            formatDate(fertileEnd)
        )}`;


    document
        .getElementById(
            "cycleInfo"
        )
        .textContent =
        data.cycleLength;
}


// ============================================
// CALENDARIO
// ============================================

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    let startDay =
        firstDay.getDay();


    startDay =
        startDay === 0
            ? 6
            : startDay - 1;


    const monthName =
        currentDate.toLocaleDateString(
            "es-PE",
            {
                month: "long",
                year: "numeric"
            }
        );


    monthTitle.textContent =
        monthName
            .charAt(0)
            .toUpperCase() +
        monthName.slice(1);


    for (
        let i = 0;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "day empty";

        calendar.appendChild(
            empty
        );
    }


    for (
        let day = 1;
        day <= lastDay.getDate();
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const dateString =
            formatDate(date);


        const dayElement =
            document.createElement(
                "div"
            );


        dayElement.className =
            "day";


        const number =
            document.createElement(
                "div"
            );


        number.className =
            "day-number";


        number.textContent =
            day;


        dayElement.appendChild(
            number
        );


        // HOY

        if (
            dateString ===
            formatDate(today)
        ) {

            dayElement.classList.add(
                "today"
            );
        }


        // PERIODO

        if (data.periodDate) {

            const periodStart =
                new Date(
                    data.periodDate +
                    "T12:00:00"
                );


            const periodEnd =
                addDays(
                    periodStart,
                    Number(
                        data.periodLength
                    ) - 1
                );


            if (
                date >= periodStart &&
                date <= periodEnd
            ) {

                dayElement.classList.add(
                    "period"
                );
            }


            // FERTILIDAD

            const nextPeriod =
                addDays(
                    periodStart,
                    Number(
                        data.cycleLength
                    )
                );


            const ovulation =
                addDays(
                    nextPeriod,
                    -14
                );


            const fertileStart =
                addDays(
                    ovulation,
                    -5
                );


            const fertileEnd =
                addDays(
                    ovulation,
                    1
                );


            if (
                date >= fertileStart &&
                date <= fertileEnd
            ) {

                dayElement.classList.add(
                    "fertile"
                );
            }


            if (
                dateString ===
                formatDate(ovulation)
            ) {

                dayElement.classList.remove(
                    "fertile"
                );

                dayElement.classList.add(
                    "ovulation"
                );
            }
        }


        // RELACIÓN

        const relations =
            data.relations.filter(
                relation =>
                    relation.date ===
                    dateString
            );


        if (
            relations.length > 0
        ) {

            dayElement.classList.add(
                "relation-day"
            );


            const heart =
                document.createElement(
                    "div"
                );


            heart.className =
                "relation-heart";


            if (
                relations.some(
                    r =>
                        r.protection ===
                        "unprotected"
                )
            ) {

                heart.textContent =
                    "❤️";

            } else {

                heart.textContent =
                    "🛡️";
            }


            dayElement.appendChild(
                heart
            );
        }


        dayElement.addEventListener(
            "click",
            () => {

                relationDateInput.value =
                    dateString;
            }
        );


        calendar.appendChild(
            dayElement
        );
    }
}


// ============================================
// RELACIONES
// ============================================

function renderRelations() {

    const list =
        document.getElementById(
            "relationsList"
        );


    list.innerHTML = "";


    const sorted =
        [...data.relations]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    sorted.forEach(
        relation => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "relation-item";


            const info =
                document.createElement(
                    "div"
                );


            info.className =
                "relation-info";


            const icon =
                relation.protection ===
                "protected"
                    ? "🛡️"
                    : "❤️";


            const text =
                relation.protection ===
                "protected"
                    ? "Con protección"
                    : "Sin protección";


            info.innerHTML = `
                <strong>
                    ${icon}
                    ${prettyDate(
                        relation.date
                    )}
                </strong>

                <small>
                    ${text}
                </small>
            `;


            const remove =
                document.createElement(
                    "button"
                );


            remove.className =
                "remove-relation";


            remove.textContent =
                "Eliminar";


            remove.onclick =
                () => {

                    data.relations =
                        data.relations.filter(
                            r =>
                                r.id !==
                                relation.id
                        );


                    saveData();

                    renderCalendar();

                    renderRelations();

                    updateSummary();
                };


            item.appendChild(info);

            item.appendChild(remove);

            list.appendChild(item);
        }
    );
}


// ============================================
// RESUMEN
// ============================================

function updateSummary() {

    document
        .getElementById(
            "relationCount"
        )
        .textContent =
        data.relations.length;


    document
        .getElementById(
            "cycleInfo"
        )
        .textContent =
        data.cycleLength;


    calculateCycle();
}


// ============================================
// CALCULAR CICLO
// ============================================

document
    .getElementById(
        "calculateBtn"
    )
    .addEventListener(
        "click",
        () => {

            if (
                !periodDateInput.value
            ) {

                alert(
                    "Selecciona el primer día del periodo."
                );

                return;
            }


            data.periodDate =
                periodDateInput.value;


            data.periodLength =
                Number(
                    periodLengthInput.value
                );


            data.cycleLength =
                Number(
                    cycleLengthInput.value
                );


            saveData();

            calculateCycle();

            renderCalendar();


            alert(
                "💕 Ciclo actualizado"
            );
        }
    );


// ============================================
// AGREGAR RELACIÓN
// ============================================

document
    .getElementById(
        "addRelation"
    )
    .addEventListener(
        "click",
        () => {

            if (
                !relationDateInput.value
            ) {

                alert(
                    "Selecciona una fecha."
                );

                return;
            }


            if (
                !selectedProtection
            ) {

                alert(
                    "Selecciona con o sin protección."
                );

                return;
            }


            data.relations.push({

                id: Date.now(),

                date:
                    relationDateInput.value,

                protection:
                    selectedProtection
            });


            saveData();


            selectedProtection =
                "";


            document
                .getElementById(
                    "protectedBtn"
                )
                .classList.remove(
                    "selected"
                );


            document
                .getElementById(
                    "unprotectedBtn"
                )
                .classList.remove(
                    "selected"
                );


            renderCalendar();

            renderRelations();

            updateSummary();


            alert(
                "❤️ Guardado"
            );
        }
    );


// ============================================
// CAMBIAR MES
// ============================================

document
    .getElementById(
        "prevMonth"
    )
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
    .getElementById(
        "nextMonth"
    )
    .addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );

            renderCalendar();
        }
    );


// ============================================
// BORRAR CALENDARIO
// ============================================

document
    .getElementById(
        "clearData"
    )
    .addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "¿Seguro que quieres borrar los datos del calendario?"
                )
            ) {

                return;
            }


            data = {

                periodDate: "",

                periodLength: 5,

                cycleLength: 28,

                relations: []
            };


            saveData();


            periodDateInput.value =
                "";

            periodLengthInput.value =
                5;

            cycleLengthInput.value =
                28;


            renderCalendar();

            renderRelations();

            updateSummary();
        }
    );


// ============================================
// ============================================
// 📸 SISTEMA DE RECUERDOS
// ============================================
// ============================================

let memories = [];


// Cargar recuerdos

function loadMemories() {

    const saved =
        localStorage.getItem(
            "loveMemories"
        );


    memories =
        saved
            ? JSON.parse(saved)
            : [];


    renderMemories();
}


// Guardar recuerdos

function saveMemories() {

    localStorage.setItem(
        "loveMemories",
        JSON.stringify(memories)
    );
}


// ============================================
// PREVISUALIZACIÓN
// ============================================

document
    .getElementById(
        "photoInput"
    )
    .addEventListener(
        "change",
        function () {

            const file =
                this.files[0];


            if (!file)
                return;


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Selecciona una imagen."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const preview =
                        document.getElementById(
                            "previewImage"
                        );


                    preview.src =
                        event.target.result;


                    document
                        .getElementById(
                            "imagePreview"
                        )
                        .classList.remove(
                            "hidden"
                        );
                };


            reader.readAsDataURL(file);
        }
    );


// ============================================
// GUARDAR RECUERDO
// ============================================

document
    .getElementById(
        "saveMemory"
    )
    .addEventListener(
        "click",
        function () {

            const file =
                document.getElementById(
                    "photoInput"
                ).files[0];


            const title =
                document.getElementById(
                    "memoryTitle"
                ).value.trim();


            const description =
                document.getElementById(
                    "memoryDescription"
                ).value.trim();


            const date =
                document.getElementById(
                    "memoryDate"
                ).value;


            if (!file) {

                alert(
                    "Selecciona una foto."
                );

                return;
            }


            if (!title) {

                alert(
                    "Ponle un título al recuerdo."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const memory = {

                        id: Date.now(),

                        image:
                            event.target.result,

                        title:
                            title,

                        description:
                            description,

                        date:
                            date ||
                            formatDate(
                                new Date()
                            )
                    };


                    memories.unshift(
                        memory
                    );


                    saveMemories();

                    renderMemories();


                    // LIMPIAR

                    document
                        .getElementById(
                            "photoInput"
                        )
                        .value = "";


                    document
                        .getElementById(
                            "memoryTitle"
                        )
                        .value = "";


                    document
                        .getElementById(
                            "memoryDescription"
                        )
                        .value = "";


                    document
                        .getElementById(
                            "memoryDate"
                        )
                        .value = "";


                    document
                        .getElementById(
                            "imagePreview"
                        )
                        .classList.add(
                            "hidden"
                        );


                    document
                        .getElementById(
                            "previewImage"
                        )
                        .src = "";


                    alert(
                        "📸 ¡Recuerdo guardado!"
                    );
                };


            reader.readAsDataURL(file);
        }
    );


// ============================================
// MOSTRAR RECUERDOS
// ============================================

function renderMemories() {

    const gallery =
        document.getElementById(
            "memoriesGallery"
        );


    const empty =
        document.getElementById(
            "emptyMemories"
        );


    const count =
        document.getElementById(
            "memoryCount"
        );


    gallery.innerHTML = "";


    count.textContent =
        `${memories.length} ${
            memories.length === 1
                ? "recuerdo"
                : "recuerdos"
        }`;


    if (
        memories.length === 0
    ) {

        empty.classList.remove(
            "hidden"
        );

        return;
    }


    empty.classList.add(
        "hidden"
    );


    memories.forEach(
        memory => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "memory-card";


            const image =
                document.createElement(
                    "img"
                );


            image.className =
                "memory-image";


            image.src =
                memory.image;


            image.alt =
                memory.title;


            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "memory-content";


            const title =
                document.createElement(
                    "h3"
                );


            title.className =
                "memory-title";


            title.textContent =
                memory.title;


            const description =
                document.createElement(
                    "p"
                );


            description.className =
                "memory-description";


            description.textContent =
                memory.description ||
                "Sin descripción";


            const date =
                document.createElement(
                    "small"
                );


            date.className =
                "memory-date";


            date.textContent =
                "📅 " +
                prettyDate(
                    memory.date
                );


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-memory";


            deleteButton.textContent =
                "🗑️ Eliminar";


            deleteButton.onclick =
                () => {

                    if (
                        !confirm(
                            "¿Eliminar este recuerdo?"
                        )
                    ) {

                        return;
                    }


                    memories =
                        memories.filter(
                            m =>
                                m.id !==
                                memory.id
                        );


                    saveMemories();

                    renderMemories();
                };


            content.appendChild(
                title
            );

            content.appendChild(
                description
            );

            content.appendChild(
                date
            );

            content.appendChild(
                deleteButton
            );


            card.appendChild(
                image
            );

            card.appendChild(
                content
            );


            gallery.appendChild(
                card
            );
        }
    );
}


// ============================================
// INICIAR
// ============================================

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
        formatDate(
            new Date()
        );


    renderCalendar();

    renderRelations();

    updateSummary();

    loadMemories();
}


loadData();
