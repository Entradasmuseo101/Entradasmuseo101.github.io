
    document.addEventListener('DOMContentLoaded', function () {
        const personCountInput = document.getElementById('personCount');
        const totalPaymentDisplay = document.getElementById('totalPayment');
        const hiddenPersonCount = document.getElementById('hiddenPersonCount');
        const hiddenTotalPayment = document.getElementById('hiddenTotalPayment');
        const displayPersonCount = document.getElementById('displayPersonCount');
        const displayTotalPayment = document.getElementById('displayTotalPayment');
        
    const hiddenSchedule = document.getElementById('hiddenSchedule');
    const displaySchedule = document.getElementById('displaySchedule');

        

        
    const config = JSON.parse(localStorage.getItem('configuracionEntradas')) || {};
    const globalConfig = config.global || { precioEntrada: 25000, maxPersonas: 6 };
    
        // Establecer el máximo dinámico
        personCountInput.setAttribute('max', config.maximoPersonas);
    
        // Actualizar total
        function updateTotal() {
            const personCount = parseInt(personCountInput.value) || 0;
            const total = personCount * config.precioEntrada;
            totalPaymentDisplay.textContent = `Total a pagar: $${total}`;
    
            // Actualizar el monto en el modal
            const qrMonto = document.getElementById('qrMonto');
            if (qrMonto) qrMonto.textContent = `$${total}`;
    
            // Actualizar los campos ocultos para envío de formulario
            if (hiddenPersonCount) hiddenPersonCount.value = personCount;
            if (hiddenTotalPayment) hiddenTotalPayment.value = total;
            if (displayPersonCount) displayPersonCount.textContent = personCount;
            if (displayTotalPayment) displayTotalPayment.textContent = `$${total}`;
        }
    
        // Inicial
        updateTotal();
        personCountInput.addEventListener('input', updateTotal);
    
        // Botón de cancelar
        const clearButton = document.getElementById('clearButton');
        clearButton.addEventListener('click', () => {
            document.getElementById('ticketForm').reset();
            totalPaymentDisplay.textContent = 'Total a pagar: $0';
            if (hiddenPersonCount) hiddenPersonCount.value = '';
            if (hiddenTotalPayment) hiddenTotalPayment.value = '';
            if (displayPersonCount) displayPersonCount.textContent = 0;
            if (displayTotalPayment) displayTotalPayment.textContent = '$0';
        });
    });
    
    const emailInput = document.getElementById('email');
const replyToInput = document.getElementById('replyto');

if (emailInput && replyToInput) {
    emailInput.addEventListener('input', () => {
        replyToInput.value = emailInput.value;
    });

    document.getElementById('loginModalButton').addEventListener('click', function() {
        // Obtener los valores dinámicos
        const totalPago = document.getElementById('totalPago').textContent;
        const cantidadEntradas = document.getElementById('cantidadEntradas').value;
    
        // Actualizar los campos ocultos con los valores
        document.getElementById('hiddenPersonCount').value = cantidadEntradas;
        document.getElementById('hiddenTotalPayment').value = totalPago;
    
        // Si deseas también enviar la fecha y hora seleccionada, actualiza el campo correspondiente
        const selectedSchedule = document.getElementById('displaySchedule').textContent;
        document.getElementById('hiddenSchedule').value = selectedSchedule;
    });
    
}




    // Abrir modal para seleccionar horarios
    const scheduleButton = document.getElementById('scheduleButton');
    const scheduleModal = new bootstrap.Modal(document.getElementById('scheduleModal'));

    const preloader = document.getElementById('preloader');
    const mesesContainer = document.getElementById('mesesContainer');
    const diasContainer = document.getElementById('diasContainer');
    const diasGrid = document.getElementById('diasGrid');
    const horasContainer = document.getElementById('horasContainer');
    const horasGrid = document.getElementById('horasGrid');
    const listaSeleccionados = document.getElementById('listaSeleccionados');
    const tituloMes = document.getElementById('tituloMes');
    const tituloDia = document.getElementById('tituloDia');

    let fechaSeleccionada = null;

    scheduleButton.addEventListener('click', () => {
        mostrarMeses();
        scheduleModal.show();
    });

    function mostrarMeses() {
        limpiarSeleccionesExpiradas();
        mesesContainer.innerHTML = '';
        diasContainer.classList.add('oculto');
        horasContainer.classList.add('oculto');

        const hoy = new Date();
        for (let i = 0; i <= 2; i++) {
            const mesFecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
            const mesDiv = document.createElement('div');
            mesDiv.classList.add('item');
            mesDiv.textContent = mesFecha.toLocaleString('es', { month: 'long' });

            mesDiv.addEventListener('click', () => {
                mostrarDias(mesFecha);
            });

            mesesContainer.appendChild(mesDiv);
        }
    }

    function mostrarDias(mesFecha) {
        diasGrid.innerHTML = '';
        diasContainer.classList.remove('oculto');
        horasContainer.classList.add('oculto');

        const anio = mesFecha.getFullYear();
        const mes = mesFecha.getMonth();
        const ultimoDia = new Date(anio, mes + 1, 0).getDate();

        tituloMes.textContent = `Días de ${mesFecha.toLocaleString('es', { month: 'long' })}`;

        const configuraciones = JSON.parse(localStorage.getItem("configuracion") || "{}");
        const fechaInicio = new Date(configuraciones.fechaInicio || "2000-01-01");
        const fechaFin = new Date(configuraciones.fechaFin || "2100-12-31");

        for (let dia = 1; dia <= ultimoDia; dia++) {
            const fecha = new Date(anio, mes, dia);
            if (fecha < fechaInicio || fecha > fechaFin) continue;

            const diaDiv = document.createElement('div');
            diaDiv.classList.add('item');
            diaDiv.textContent = dia;

            diaDiv.addEventListener('click', () => {
                fechaSeleccionada = fecha;
                mostrarHorasParaDia(fechaSeleccionada);
            });

            diasGrid.appendChild(diaDiv);
        }
    }

    function mostrarHorasParaDia(fecha) {
        horasGrid.innerHTML = '';
        horasContainer.classList.remove('oculto');
        const fechaKey = fecha.toISOString().split('T')[0];
        tituloDia.textContent = `Horas disponibles para ${fechaKey}`;
    
        const configuraciones = JSON.parse(localStorage.getItem("configuracion") || "{}");
        const configDia = {
            apertura: (configuraciones[fechaKey]?.apertura) || configuraciones.apertura || "08:00",
            cierre: (configuraciones[fechaKey]?.cierre) || configuraciones.cierre || "18:00",
            intervalo: parseInt(configuraciones[fechaKey]?.intervalo || configuraciones.intervalo) || 10
        };
    
        const horas = generarHoras(configDia.apertura, configDia.cierre, configDia.intervalo);
        let selecciones = JSON.parse(localStorage.getItem('seleccionesHorarios') || '{}');
        const ahora = new Date().getTime();
const seleccionadas = (selecciones[fechaKey] || []).filter(item => {
    return ahora - item.timestamp < 24 * 60 * 60 * 1000; // solo las que no han caducado
});

    
        // Limpiar selecciones caducadas si las había
        if (selecciones[fechaKey]?.length !== seleccionadas.length) {
            selecciones[fechaKey] = seleccionadas;
            if (selecciones[fechaKey].length === 0) delete selecciones[fechaKey];
            localStorage.setItem('seleccionesHorarios', JSON.stringify(selecciones));
        }
    
        horas.forEach(hora => {
            const horaDiv = document.createElement('div');
            horaDiv.classList.add('item');
            horaDiv.textContent = hora;
    
            if (seleccionadas.some(sel => sel.hora === hora)) {
                horaDiv.classList.add('seleccionado');
            }
    
            horaDiv.addEventListener('click', () => {
                alternarSeleccion(horaDiv, fechaKey);
            });
    
            horasGrid.appendChild(horaDiv);

            if (seleccionadas.some(sel => sel.hora === hora)) {
                horaDiv.classList.add('seleccionado');
            }
            
        });
    }
    

    function generarHoras(inicio, fin, intervaloMin) {
        const horarios = [];
        let [h, m] = inicio.split(":").map(Number);
        const [hf, mf] = fin.split(":").map(Number);

        while (h < hf || (h === hf && m < mf)) {
            horarios.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
            m += intervaloMin;
            if (m >= 60) {
                h += Math.floor(m / 60);
                m = m % 60;
            }
        }

        return horarios;
    }
    function alternarSeleccion(horaDiv, fechaKey) {
        const hora = horaDiv.textContent;
        const selecciones = JSON.parse(localStorage.getItem('seleccionesHorarios') || '{}');
    
        // Inicializar el array si no existe
        if (!selecciones[fechaKey]) selecciones[fechaKey] = [];
    
        // Verificar si ya se había seleccionado esta hora
        const yaSeleccionada = selecciones[fechaKey].some(item => item.hora === hora);
    
        if (!yaSeleccionada) {
            // Agregar nueva selección con marca de tiempo actual
            selecciones[fechaKey].push({
                hora: hora,
                timestamp: new Date().getTime()
            });
    
            // Marcar visualmente como seleccionado
            horaDiv.classList.add('seleccionado');
    
            // Guardar cambios
            localStorage.setItem('seleccionesHorarios', JSON.stringify(selecciones));
        }
    
        actualizarListaSeleccionados();
    }
    
    

    function actualizarListaSeleccionados() {
        const listaSeleccionados = document.getElementById('listaSeleccionados');
        const displaySchedule = document.getElementById('displaySchedule');
        const hiddenSchedule = document.getElementById('hiddenSchedule');
    
        if (listaSeleccionados) listaSeleccionados.innerHTML = '';
    
        const selecciones = JSON.parse(localStorage.getItem('seleccionesHorarios') || '{}');
        let resumen = [];
    
        Object.keys(selecciones).forEach(fecha => {
            selecciones[fecha].forEach(hora => {
                const texto = `${fecha} - ${hora}`;
                resumen.push(texto);
    
                if (listaSeleccionados) {
                    const li = document.createElement('li');
                    li.textContent = texto;
    
                    const btn = document.createElement('button');
                    btn.textContent = 'X';
                    btn.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-2');
                    btn.addEventListener('click', () => eliminarSeleccion(fecha, hora));
    
                    li.appendChild(btn);
                    listaSeleccionados.appendChild(li);
                }
            });
        });
    
        // Mostrar el último horario seleccionado en el resumen y actualizar input hidden
        if (resumen.length > 0) {
            const ultimo = resumen[resumen.length - 1];
            if (displaySchedule) displaySchedule.textContent = ultimo;
            if (hiddenSchedule) hiddenSchedule.value = ultimo;
        } else {
            if (displaySchedule) displaySchedule.textContent = 'No seleccionado';
            if (hiddenSchedule) hiddenSchedule.value = '';
        }
    }
    

    function eliminarSeleccion(fecha, hora) {
        const selecciones = JSON.parse(localStorage.getItem('seleccionesHorarios') || '{}');
        selecciones[fecha] = selecciones[fecha].filter(h => h !== hora);
        if (selecciones[fecha].length === 0) delete selecciones[fecha];

        localStorage.setItem('seleccionesHorarios', JSON.stringify(selecciones));
        actualizarListaSeleccionados();

        if (fechaSeleccionada && fechaSeleccionada.toISOString().split('T')[0] === fecha) {
            mostrarHorasParaDia(fechaSeleccionada);
        }
    }

    function limpiarSeleccionesExpiradas() {
        const selecciones = JSON.parse(localStorage.getItem('seleccionesHorarios') || '{}');
        const ahora = new Date().getTime();
        let huboCambios = false;
    
        for (let fecha in selecciones) {
            selecciones[fecha] = selecciones[fecha].filter(item => {
                const valido = ahora - item.timestamp < 24 * 60 * 60 * 1000;
                if (!valido) huboCambios = true;
                return valido;
            });
            if (selecciones[fecha].length === 0) {
                delete selecciones[fecha];
                huboCambios = true;
            }
        }
    
        if (huboCambios) {
            localStorage.setItem('seleccionesHorarios', JSON.stringify(selecciones));
        }
    }
    


