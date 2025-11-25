// Script simple para manejar productos y carrito (agregar / quitar / cambiar cantidad)

const productos = [
    { id: 1, nombre: "Taco al Pastor", precio: 2.5, categoria: "tacos" },
    { id: 2, nombre: "Quesadilla", precio: 3.0, categoria: "quesadillas" },
    { id: 3, nombre: "Tequila Shot", precio: 4.5, categoria: "bebidas" },
    { id: 4, nombre: "Taco Dorado", precio: 2.8, categoria: "tacos" },
    { id: 5, nombre: "Enchilada", precio: 3.5, categoria: "platillos" },
    { id: 6, nombre: "Margarita", precio: 5.0, categoria: "bebidas" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosFiltrados = [...productos];

function formatoMoneda(precio) {
    return `€${precio.toFixed(2)}`;
}

function renderProductos() {
    const cont = document.getElementById('lista-productos');
    if (!cont) return;
    
    cont.innerHTML = '';
    
    if (productosFiltrados.length === 0) {
        cont.innerHTML = '<p style="text-align:center;grid-column:1/-1;font-size:1.2rem;color:var(--color-text)">No se encontraron productos 😢</p>';
        return;
    }

    productosFiltrados.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'producto';
        card.setAttribute('data-category', p.categoria);
        card.style.animationDelay = (i * 0.08) + 's';
        card.innerHTML = `
            <h3>${p.nombre}</h3>
            <p>${p.categoria}</p>
            <p style="font-weight:900;font-size:1.6rem;background:linear-gradient(135deg,var(--color-primary),var(--color-accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent">${formatoMoneda(p.precio)}</p>
            <button class="btn agregar" data-id="${p.id}">🛒 Agregar al carrito</button>
        `;
        cont.appendChild(card);
    });

    cont.querySelectorAll('.agregar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(btn.getAttribute('data-id'));
            agregarAlCarrito(id);
            crearConfeti();
            crearToast(`Producto agregado al carrito ✨`);
        });
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const existe = carrito.find(p => p.id === id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
}

function renderCarrito() {
    const cont = document.getElementById('lista-carrito');
    if (!cont) return;

    cont.innerHTML = '';

    if (carrito.length === 0) {
        cont.innerHTML = '<p style="text-align:center;font-size:1.1rem;color:var(--color-text);padding:20px">Tu carrito está vacío 🛒</p>';
        return;
    }

    const ul = document.createElement('ul');
    let total = 0;

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        const li = document.createElement('li');
        li.innerHTML = `
            <div style="flex:1">
                <strong>${p.nombre}</strong>
                <span style="color:rgba(0,0,0,0.5);margin-left:10px">x${p.cantidad}</span>
            </div>
            <span style="font-weight:900;color:var(--color-primary)">${formatoMoneda(subtotal)}</span>
            <button class="remove-btn" data-id="${p.id}">🗑️ Eliminar</button>
        `;
        ul.appendChild(li);
    });

    cont.appendChild(ul);

    const totalDiv = document.createElement('div');
    totalDiv.style.marginTop = '20px';
    totalDiv.style.paddingTop = '20px';
    totalDiv.style.borderTop = '2px solid var(--color-border)';
    totalDiv.style.fontSize = '1.3rem';
    totalDiv.style.fontWeight = '900';
    totalDiv.style.textAlign = 'right';
    totalDiv.style.color = 'var(--color-primary)';
    totalDiv.innerHTML = `Total: ${formatoMoneda(total)}`;
    cont.appendChild(totalDiv);

    cont.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-id'));
            carrito = carrito.filter(p => p.id !== id);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderCarrito();
            crearToast(`Producto eliminado ❌`);
        });
    });
}

function crearConfeti() {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = ['🌮', '🔥', '✨', '🎉'][Math.floor(Math.random() * 4)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.fontSize = Math.random() * 20 + 20 + 'px';
        confetti.style.opacity = Math.random() * 0.7 + 0.3;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

function crearToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('remove');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProductos();
    renderCarrito();

    // Scroll suave a secciones
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Búsqueda en vivo
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            productosFiltrados = productos.filter(p => 
                p.nombre.toLowerCase().includes(query) || 
                p.categoria.toLowerCase().includes(query)
            );
            renderProductos();
        });
    }
});
