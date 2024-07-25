document.addEventListener('DOMContentLoaded', function() {
    const listaProductos = document.getElementById('lista-productos');
    const contenedorItemsCarrito = document.getElementById('items-carrito');
    const cantidadTotalCarrito = document.getElementById('cantidad-total-carrito');
    const botonVaciarCarrito = document.getElementById('vaciar-carrito');
    const botonComprarCarrito = document.getElementById('comprar-carrito');
    const contenedorMensajesCarrito = document.getElementById('mensajes-carrito');
    const toggleModoOscuro = document.getElementById('toggle-modo-oscuro');

    let carrito = [];

    function renderizarProductos(productos) {
        listaProductos.innerHTML = '';
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <h2>${producto.nombre}</h2>
                <p>Precio: ${producto.precio} $</p>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <input type="number" class="input-cantidad" value="1" min="1">
                <button class="agregar-al-carrito">Agregar al Carrito</button>
            `;

            const botonAgregarAlCarrito = productoDiv.querySelector('.agregar-al-carrito');
            botonAgregarAlCarrito.addEventListener('click', () => {
                const cantidad = parseInt(productoDiv.querySelector('.input-cantidad').value, 10);
                agregarAlCarrito(producto, cantidad);
            });

            listaProductos.appendChild(productoDiv);
        });
    }

    function agregarAlCarrito(producto, cantidad) {
        const itemCarrito = carrito.find(item => item.id === producto.id);
        if (itemCarrito) {
            itemCarrito.cantidad += cantidad;
        } else {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: cantidad
            });
        }
        renderizarCarrito();
    }

    function renderizarCarrito() {
        contenedorItemsCarrito.innerHTML = '';
        carrito.forEach(item => {
            const elementoCarrito = document.createElement('li');
            elementoCarrito.textContent = `${item.nombre} - Cantidad: ${item.cantidad} - Total: ${item.cantidad * item.precio} $`;
            contenedorItemsCarrito.appendChild(elementoCarrito);
        });
        const total = carrito.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
        cantidadTotalCarrito.textContent = total.toFixed(2);
    }

    botonVaciarCarrito.addEventListener('click', () => {
        if (carrito.length === 0) {
            mostrarMensajeEnCarrito('El carrito ya está vacío.', 'advertencia');
            return;
        }
        carrito = [];
        renderizarCarrito();
        mostrarMensajeEnCarrito('El carrito se ha vaciado correctamente.', 'exito');
    });

    botonComprarCarrito.addEventListener('click', () => {
        if (carrito.length === 0) {
            mostrarMensajeEnCarrito('No hay productos en el carrito para comprar.', 'advertencia');
            return;
        }
        carrito = [];
        renderizarCarrito();
        mostrarMensajeEnCarrito('¡Gracias por tu compra! Tu pedido está en camino.', 'exito');
    });

    toggleModoOscuro.addEventListener('click', () => {
        document.body.classList.toggle('modo-oscuro');
        toggleModoOscuro.textContent = document.body.classList.contains('modo-oscuro') ? 'Modo Claro' : 'Modo Oscuro';
    });

    function mostrarMensajeEnCarrito(mensaje, tipo) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.textContent = mensaje;
        mensajeDiv.classList.add('mensaje', tipo);
        contenedorMensajesCarrito.innerHTML = '';
        contenedorMensajesCarrito.appendChild(mensajeDiv);
        setTimeout(() => mensajeDiv.remove(), 5000);
    }

    fetch('../js/productos.json')
        .then(response => response.json())
        .then(productos => renderizarProductos(productos))
        .catch(error => console.error('Error al cargar los productos:', error));
});

