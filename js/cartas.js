// Función para cargar los datos desde la URL
async function cargarDatos() {
    try {

        const datosEnLocal = localStorage.getItem('cartasTabla');
        if (datosEnLocal) {
            cargarTablaDesdeLocalStorage();
            console.log('Datos encontrados en localStorage. No se carga JSON.');
            return; // Evita cargar desde el JSON si ya hay datos
        }

        // Hacer la solicitud fetch a la URL del JSON
        const response = await fetch('https://carlosreneas.github.io/endpoints/cartas.json');
        
        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }

        // Parsear el JSON
        const data = await response.json();

        // Obtener el contenedor de la tabla
        const listado = document.getElementById('listado');

        // Limpiar cualquier dato previo en la tabla (por si acaso)
        listado.innerHTML = '';

        // Iterar sobre los datos y agregar filas a la tabla
        data.data.forEach(item => {
            const row = document.createElement('tr');
            
            // Crear las celdas de la fila
            const numeroCell = document.createElement('td');
            numeroCell.textContent = item.numero;
            
            const cartaCell = document.createElement('td');
            cartaCell.textContent = item.carta;
            
            const valorCell = document.createElement('td');
            valorCell.textContent = item.valor;

            // Agregar las celdas a la fila
            row.appendChild(numeroCell);
            row.appendChild(cartaCell);
            row.appendChild(valorCell);

            // Agregar la fila al cuerpo de la tabla
            listado.appendChild(row);
        });

    } catch (error) {
        console.error('Error cargando los datos:', error);
    }
}

// Cargar los datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarDatos);

// Función para agregar una nueva fila a la tabla
function agregarFila(numero, carta, valor) {
    const listado = document.getElementById('listado');

    // Crear una nueva fila
    const row = document.createElement('tr');

    // Crear celdas de la fila
    const numeroCell = document.createElement('td');
    numeroCell.textContent = numero;
    
    const cartaCell = document.createElement('td');
    cartaCell.textContent = carta;
    
    const valorCell = document.createElement('td');
    valorCell.textContent = valor;

    // Agregar las celdas a la fila
    row.appendChild(numeroCell);
    row.appendChild(cartaCell);
    row.appendChild(valorCell);

    // Agregar la fila al cuerpo de la tabla
    listado.appendChild(row);
}

// Función para manejar el registro
document.getElementById('registrar').addEventListener('click', function () {
    const numero = document.getElementById('numero').value.trim();
    const carta = document.getElementById('carta').value.trim();

    // Validar el numero
    if (!numero || isNaN(numero) || numero < 1 || numero > 13) {
        alert('Por favor ingrese un numero válido entre 1 y 13.');
        return;
    }

    // Validar la carta
    if (!carta) {
        alert('Por favor ingrese una carta.');
        return;
    }

    // Validar si ya existe una fila con el mismo número
    const filas = document.querySelectorAll('#listado tr');
    const numeroExiste = Array.from(filas).some(fila => {
        return fila.children[0].textContent.trim() === numero;
    });

    if (numeroExiste) {
        alert('No seas así, la quieres embarrar');
        return;
    }

    // Agregar la fila a la tabla
    agregarFila(numero, carta, 0); // El valor "0" es la cantidad por defecto
    guardarTablaEnLocalStorage();

    // Limpiar los campos del formulario después de guardar
    document.getElementById('numero').value = '';
    document.getElementById('carta').value = '';
});


document.addEventListener('DOMContentLoaded', function () {

    // Agregar evento de clic a todas las cartas
    document.querySelectorAll('.btncarta').forEach(carta => {
        carta.addEventListener('click', () => {
            const cartaNum = carta.dataset.carta; // Obtener el número de la carta (como string)
            
            // Buscar la fila en la tabla que coincida con ese número
            const filas = document.querySelectorAll('#listado tr');
            filas.forEach(fila => {
                const celdaNumero = fila.children[0].textContent.trim();
                
                if (celdaNumero === cartaNum) {
                    const celdaCant = fila.children[2]; // Tercera columna: Cant
                    let cantidad = parseInt(celdaCant.textContent);
                    celdaCant.textContent = cantidad + 1;
                    guardarTablaEnLocalStorage();
                }
            });
        });
    });
});







// FUNCIONES PARA LA GESTIÓN CON EL LOCALSTORAGE

function guardarTablaEnLocalStorage() {
    const filas = document.querySelectorAll('#listado tr');
    const datos = [];

    filas.forEach(fila => {
        const numero = fila.children[0].textContent.trim();
        const carta = fila.children[1].textContent.trim();
        const cantidad = fila.children[2].textContent.trim();
        datos.push({ numero, carta, valor: cantidad });
    });

    localStorage.setItem('cartasTabla', JSON.stringify(datos));
}

function cargarTablaDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem('cartasTabla');
    if (datosGuardados) {
        const cartas = JSON.parse(datosGuardados);
        cartas.forEach(carta => {
            agregarFila(carta.numero, carta.carta, carta.valor);
        });
    }
}