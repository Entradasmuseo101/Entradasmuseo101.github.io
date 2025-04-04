const personCountInput = document.getElementById('personCount');
const totalPaymentDisplay = document.getElementById('totalPayment');
const hiddenPersonCount = document.getElementById('hiddenPersonCount');
const hiddenTotalPayment = document.getElementById('hiddenTotalPayment');
const displayPersonCount = document.getElementById('displayPersonCount');
const displayTotalPayment = document.getElementById('displayTotalPayment');

const hiddenSchedule = document.getElementById('hiddenSchedule');
const displaySchedule = document.getElementById('displaySchedule');


const price = 20000;

// Actualizar total
function updateTotal() {
    const personCount = parseInt(personCountInput.value) || 0;
    const total = personCount * price;
    totalPaymentDisplay.textContent = `Total a pagar: $${total}`;
}

personCountInput.addEventListener('input', updateTotal);

clearButton.addEventListener('click', () => {
    document.getElementById('ticketForm').reset();
    totalPaymentDisplay.textContent = 'Total a pagar: $0';
});

// Abrir modal para seleccionar horarios
scheduleButton.addEventListener('click', () => {
    scheduleModal.show();
});

// Funciones de horario
const preloader = document.getElementById('preloader');
const horariosSeleccionados = {};
const mesesContainer = document.getElementById('mesesContainer');
const diasContainer = document.getElementById('diasContainer');
const diasGrid = document.getElementById('diasGrid');
const horasContainer = document.getElementById('horasContainer');
const horasGrid = document.getElementById('horasGrid');
const listaSeleccionados = document.getElementById('listaSeleccionados');
const tituloMes = document.getElementById('tituloMes');
const tituloDia = document.getElementById('tituloDia');

function mostrarConPreloader(callback) {
    preloader.classList.remove('oculto');
    setTimeout(() => {
        callback();
        preloader.classList.add('oculto');
    }, 500);
}

function mostrarMeses() {
    mesesContainer.innerHTML = '';
    const hoy = new Date();
    for (let i = 0; i < 2; i++) {
        const mesFecha = new Date(hoy.getFullYear(), hoy.getMonth() + i);
        const mesDiv = document.createElement('div');
        mesDiv.classList.add('item');
        mesDiv.textContent = mesFecha.toLocaleString('es', { month: 'long' });
        mesDiv.addEventListener('click', () => mostrarConPreloader(() => mostrarDias(mesFecha)));
        mesesContainer.appendChild(mesDiv);
    }
}

function mostrarDias(mesFecha) {
    diasContainer.classList.remove('oculto');
    diasGrid.innerHTML = '';
    tituloMes.textContent = `Días de ${mesFecha.toLocaleString('es', { month: 'long' })}`;
    const primerDia = new Date(mesFecha.getFullYear(), mesFecha.getMonth(), 1);
    const ultimoDia = new Date(mesFecha.getFullYear(), mesFecha.getMonth() + 1, 0);

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
        const diaDiv = document.createElement('div');
        diaDiv.classList.add('item');
        diaDiv.textContent = d;
        diaDiv.addEventListener('click', () => mostrarConPreloader(() => mostrarHoras(diaDiv)));
        diasGrid.appendChild(diaDiv);
    }
}

function mostrarHoras(diaDiv) {
    horasContainer.classList.remove('oculto');
    horasGrid.innerHTML = '';
    tituloDia.textContent = `Horas para el día ${diaDiv.textContent}`;
    const horas = generarHoras();

    horas.forEach(hora => {
        const horaDiv = document.createElement('div');
        horaDiv.textContent = hora;
        horaDiv.classList.add('item');
        horaDiv.addEventListener('click', () => seleccionarHora(horaDiv));
        horasGrid.appendChild(horaDiv);
    });
}

function generarHoras() {
    const horas = [];
    for (let h = 8; h < 18; h++) {
        for (let m = 0; m < 60; m += 10) {
            horas.push(`${h}:${m.toString().padStart(2, '0')}`);
        }
    }
    return horas;
}

function seleccionarHora(horaDiv) {
    const horaSeleccionada = horaDiv.textContent;

    // Verificar si ya está seleccionada
    if (horaDiv.classList.contains('seleccionado')) {
        if (confirm(`¿Deseas quitar la selección de la hora "${horaSeleccionada}"?`)) {
            horaDiv.classList.remove('seleccionado');
            eliminarHoraDeLista(horaSeleccionada);
        }
    } else {
        horaDiv.classList.add('seleccionado');
        agregarHoraALista(horaSeleccionada);
    }
}

// Agregar horario a la lista externa
function agregarHoraALista(hora) {
    if (!horariosSeleccionados[hora]) {
        const li = document.createElement('li');
        li.textContent = hora;
        li.id = `hora-${hora.replace(':', '-')}`; // Crear un ID único para el elemento

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'X';
        btnEliminar.className = 'btn btn-danger btn-sm ms-2';
        btnEliminar.addEventListener('click', () => {
            if (confirm(`¿Deseas eliminar "${hora}" de la lista de seleccionados?`)) {
                eliminarHoraDeLista(hora);
                // Desmarcar en el modal
                const elementosHoras = Array.from(horasGrid.children);
                elementosHoras.forEach(horaDiv => {
                    if (horaDiv.textContent === hora) {
                        horaDiv.classList.remove('seleccionado');
                    }
                });
            }
        });

        li.appendChild(btnEliminar);
        listaSeleccionados.appendChild(li);
        horariosSeleccionados[hora] = true;
    }
}

// Eliminar horario de la lista externa
function eliminarHoraDeLista(hora) {
    delete horariosSeleccionados[hora];
    const li = document.getElementById(`hora-${hora.replace(':', '-')}`);
    if (li) {
        listaSeleccionados.removeChild(li);
    }
}

mostrarMeses();

// Actualizar cantidad de personas y total a pagar
function updateTotal() {
    const personCount = parseInt(personCountInput.value) || 0;
    const total = personCount * price;

    hiddenPersonCount.value = personCount;
    hiddenTotalPayment.value = total;
    displayPersonCount.textContent = personCount;
    displayTotalPayment.textContent = total;
}

personCountInput.addEventListener('input', updateTotal);
updateTotal(); // Ejecutar para inicializar los valores

// Función para actualizar el horario seleccionado
function actualizarHorarioSeleccionado() {
    let horarios = [];
    const items = listaSeleccionados.querySelectorAll('li');
    items.forEach(item => {
        horarios.push(item.textContent.replace(' X', ''));
    });

    const horarioTexto = horarios.length > 0 ? horarios.join(', ') : 'No seleccionado';
    hiddenSchedule.value = horarioTexto;
    displaySchedule.textContent = horarioTexto;
}

// Observador de cambios en la lista de horarios seleccionados
const observer = new MutationObserver(actualizarHorarioSeleccionado);
observer.observe(listaSeleccionados, { childList: true });

actualizarHorarioSeleccionado(); // Ejecutar inicialmente para capturar cambios previos

document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias de los elementos
    const scheduleButton = document.getElementById('scheduleButton');
    const scheduleModalElement = document.getElementById('scheduleModal');

    if (!scheduleButton || !scheduleModalElement) {
        console.error("No se encontró el botón o el modal de horarios.");
        return;
    }

    // Inicializar el modal de Bootstrap correctamente
    const scheduleModal = new bootstrap.Modal(scheduleModalElement);

    // Evento de clic para abrir el modal
    scheduleButton.addEventListener('click', () => {
        scheduleModal.show();
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const listaSeleccionados = document.getElementById('listaSeleccionados');

    if (!listaSeleccionados) {
        console.error("El elemento #listaSeleccionados no se encontró en el DOM.");
        return;
    }

    // Variables para almacenar selección
    let mesSeleccionado = "";
    let diaSeleccionado = "";

    function mostrarMeses() {
        mesesContainer.innerHTML = '';
        const hoy = new Date();
        for (let i = 0; i < 2; i++) {
            const mesFecha = new Date(hoy.getFullYear(), hoy.getMonth() + i);
            const mesDiv = document.createElement('div');
            mesDiv.classList.add('item');
            mesDiv.textContent = mesFecha.toLocaleString('es', { month: 'long' });
            mesDiv.addEventListener('click', () => {
                mesSeleccionado = mesFecha.toLocaleString('es', { month: 'long' });
                mostrarConPreloader(() => mostrarDias(mesFecha));
            });
            mesesContainer.appendChild(mesDiv);
        }
    }

    function mostrarDias(mesFecha) {
        diasContainer.classList.remove('oculto');
        diasGrid.innerHTML = '';
        tituloMes.textContent = `Días de ${mesFecha.toLocaleString('es', { month: 'long' })}`;
        const primerDia = new Date(mesFecha.getFullYear(), mesFecha.getMonth(), 1);
        const ultimoDia = new Date(mesFecha.getFullYear(), mesFecha.getMonth() + 1, 0);

        for (let d = 1; d <= ultimoDia.getDate(); d++) {
            const diaDiv = document.createElement('div');
            diaDiv.classList.add('item');
            diaDiv.textContent = d;
            diaDiv.addEventListener('click', () => {
                diaSeleccionado = d;
                mostrarConPreloader(() => mostrarHoras(diaDiv));
            });
            diasGrid.appendChild(diaDiv);
        }
    }

    function mostrarHoras(diaDiv) {
        horasContainer.classList.remove('oculto');
        horasGrid.innerHTML = '';
        tituloDia.textContent = `Horas para el día ${diaDiv.textContent} de ${mesSeleccionado}`;
        const horas = generarHoras();

        horas.forEach(hora => {
            const horaDiv = document.createElement('div');
            horaDiv.textContent = hora;
            horaDiv.classList.add('item');
            horaDiv.addEventListener('click', () => seleccionarHora(horaDiv));
            horasGrid.appendChild(horaDiv);
        });
    }

    function seleccionarHora(horaDiv) {
        const horaSeleccionada = horaDiv.textContent;
        const horarioCompleto = `${diaSeleccionado} de ${mesSeleccionado} - ${horaSeleccionada}`;

        // Verificar si ya está seleccionada
        if (horaDiv.classList.contains('seleccionado')) {
            if (confirm(`¿Deseas quitar la selección de "${horarioCompleto}"?`)) {
                horaDiv.classList.remove('seleccionado');
                eliminarHoraDeLista(horarioCompleto);
            }
        } else {
            horaDiv.classList.add('seleccionado');
            agregarHoraALista(horarioCompleto);
        }
    }

    // Agregar horario a la lista externa con día y mes
    function agregarHoraALista(horario) {
        if (!horariosSeleccionados[horario]) {
            const li = document.createElement('li');
            li.textContent = horario;
            li.id = `hora-${horario.replace(/\s+/g, '-')}`;

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'X';
            btnEliminar.className = 'btn btn-danger btn-sm ms-2';
            btnEliminar.addEventListener('click', () => {
                if (confirm(`¿Deseas eliminar "${horario}" de la lista de seleccionados?`)) {
                    eliminarHoraDeLista(horario);
                    // Desmarcar en el modal
                    const elementosHoras = Array.from(horasGrid.children);
                    elementosHoras.forEach(horaDiv => {
                        if (horaDiv.textContent === horario.split(' - ')[1]) {
                            horaDiv.classList.remove('seleccionado');
                        }
                    });
                }
            });

            li.appendChild(btnEliminar);
            listaSeleccionados.appendChild(li);
            horariosSeleccionados[horario] = true;
        }
    }

    // Eliminar horario de la lista externa
    function eliminarHoraDeLista(horario) {
        delete horariosSeleccionados[horario];
        const li = document.getElementById(`hora-${horario.replace(/\s+/g, '-')}`);
        if (li) {
            listaSeleccionados.removeChild(li);
        }
    }

    mostrarMeses();
});


