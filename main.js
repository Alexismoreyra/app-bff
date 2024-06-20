const form = document.getElementById('tareaForm');
let isEditing = false;
let editingTaskId = null;

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const completada = document.getElementById('completada').checked;

    const tarea = {
        titulo: titulo,
        completada: completada,
    };

    try {
        if (tarea.titulo === 'Programar') {
            throw new Error('No se puede programar');
        }

        let response;
        if (isEditing) {
            response = await fetch(`http://localhost:3000/tareas/${editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tarea),
            });
            isEditing = false;
            editingTaskId = null;
        } else {
            response = await fetch('http://localhost:3000/tareas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tarea),
            });
        }

        if (response.ok) {
            form.reset();
            console.log('Tarea enviada/modificada');
            cargarTareas();
        }
    } catch (error) {
        console.log('ERROR!!!');
    }
});

async function cargarTareas() {
    try {
        const response = await fetch('http://localhost:3000/tareas');
        if (response.ok) {
            const tareas = await response.json();
            renderTareas(tareas);
        }
    } catch (error) {
        console.log('Error al cargar tareas:', error);
    }
}

function renderTareas(tareas) {
    const tareasTableBody = document.getElementById('tareasTableBody');
    tareasTableBody.innerHTML = ''; // Limpiar tabla antes de renderizar

    tareas.forEach(tarea => {
        const row = document.createElement('tr');

        const tituloCell = document.createElement('td');
        tituloCell.textContent = tarea.titulo;
        row.appendChild(tituloCell);

        const completadaCell = document.createElement('td');
        completadaCell.textContent = tarea.completada ? 'Sí' : 'No';
        row.appendChild(completadaCell);

        const accionesCell = document.createElement('td');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('eliminar');
        deleteButton.addEventListener('click', () => eliminarTarea(tarea.id));
        accionesCell.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Modificar';
        editButton.addEventListener('click', () => editarTarea(tarea));
        accionesCell.appendChild(editButton);

        row.appendChild(accionesCell);

        tareasTableBody.appendChild(row);
    });
}

async function eliminarTarea(id) {
    try {
        const response = await fetch(`http://localhost:3000/tareas/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Tarea eliminada');
            cargarTareas();
        }
    } catch (error) {
        console.log('Error al eliminar tarea:', error);
    }
}

function editarTarea(tarea) {
    document.getElementById('titulo').value = tarea.titulo;
    document.getElementById('completada').checked = tarea.completada;
    isEditing = true;
    editingTaskId = tarea.id;
}

// Cargar tareas al inicio
cargarTareas();
