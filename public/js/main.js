// Mostrar modal al hacer clic en el botón de "Agregar Nuevo Cliente"
document.getElementById('openModalBtn').addEventListener('click', function() {
    var myModal = new bootstrap.Modal(document.getElementById('clientModal'), {
        keyboard: false
    });
    myModal.show();
});

// Validación del formulario de cliente y envío mediante fetch
document.getElementById('saveClientBtn').addEventListener('click', function() {
    var form = document.getElementById('createClientForm');
    if (form.checkValidity()) {
        var formData = new FormData(form);

        fetch('/clients/create', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            var newClient = data.client;

            var table = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
            var row = table.insertRow();
            row.innerHTML = `
                <td>${newClient.codigo}</td>
                <td>${newClient.nombre_comercial}</td>
                <td>${newClient.cedula}</td>
                <td>${newClient.estado}</td>
                <td>
                    <a href="/clients/edit/${newClient.id}" class="btn btn-warning btn-sm">Editar</a>
                    <a href="/clients/delete/${newClient.id}" class="btn btn-danger btn-sm">Eliminar</a>
                </td>
            `;

            var myModal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
            myModal.hide();
        })
        .catch(error => {
            alert('Hubo un error al crear el cliente');
        });
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Ocultar/mostrar mensajes de éxito o error
window.addEventListener('load', function() {
    const successMessage = document.querySelector('.alert-success');
    const errorMessage = document.querySelector('.alert-danger');

    if (successMessage) {
        setTimeout(() => successMessage.style.display = 'none', 5000);
    }

    if (errorMessage) {
        setTimeout(() => errorMessage.style.display = 'none', 5000);
    }
});
