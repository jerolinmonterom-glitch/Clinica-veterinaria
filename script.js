document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    const cartCountEl = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name') || e.target.closest('button').getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price') || e.target.closest('button').getAttribute('data-price'));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            updateCartUI();
        });
    });

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-muted my-5">Tu carrito está vacío actualmente.</p>';
            cartTotalEl.textContent = 'RD$ 0';
            checkoutBtn.classList.add('disabled');
            return;
        }

        checkoutBtn.classList.remove('disabled');
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemEl = document.createElement('div');
            itemEl.className = 'd-flex justify-content-between align-items-center mb-3 pb-3 border-bottom';
            itemEl.innerHTML = `
                <div>
                    <h6 class="mb-0 fw-bold text-dark">${item.name}</h6>
                    <small class="text-muted">RD$ ${item.price.toLocaleString()} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="fw-bold text-success">RD$ ${itemTotal.toLocaleString()}</span>
                    <button class="btn btn-sm btn-outline-danger rounded-circle btn-remove" data-index="${index}" style="width: 28px; height: 28px; padding:0;">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalEl.textContent = `RD$ ${total.toLocaleString()}`;

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        let message = "Hola Montero Vet, deseo realizar la siguiente compra:\n\n";
        let total = 0;

        cart.forEach(item => {
            const sub = item.price * item.quantity;
            total += sub;
            message += `• ${item.name} (x${item.quantity}) - RD$ ${sub.toLocaleString()}\n`;
        });

        message += `\n*Total a pagar: RD$ ${total.toLocaleString()}*`;
        window.open(`https://wa.me/18095550199?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Filtros
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            productItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Temporizador
    let hours = 5, minutes = 42, seconds = 18;
    const countdownEl = document.getElementById('countdown');
    setInterval(() => {
        if (seconds > 0) { seconds--; } 
        else {
            seconds = 59;
            if (minutes > 0) { minutes--; } 
            else { minutes = 59; if (hours > 0) hours--; }
        }
        if (countdownEl) {
            countdownEl.textContent = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
        }
    }, 1000);

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const confirmModalElement = document.getElementById('confirmModal');
    const confirmModal = new bootstrap.Modal(confirmModalElement);

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            const emailInput = document.getElementById('email');
            if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
                event.preventDefault();
                emailInput.classList.add('is-invalid');
                return;
            } else {
                emailInput.classList.remove('is-invalid');
            }
            window.addEventListener('blur', function onBlur() {
                confirmModal.show();
                window.removeEventListener('blur', onBlur);
            });
        });
    }
});