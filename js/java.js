const price = 20000;
const personCountInput = document.getElementById('personCount');
const totalPaymentDisplay = document.getElementById('totalPayment');
const clearButton = document.getElementById('clearButton');
const scheduleButton = document.getElementById('scheduleButton');
const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));

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

