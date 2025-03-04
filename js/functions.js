let cart = [];
let currentUser = null;
function displayProducts(category = 'all') {
    console.log(products)
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    const filteredProducts = category === 'all' ? 
        products : 
        products.filter(product => product.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-6 col-lg-3';
        productCard.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <span class="badge category-badge mb-2">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <span class="fw-bold">$${product.price}</span>
                        <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus me-1"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });

    // Add event listeners to the new Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            addToCart(parseInt(this.getAttribute('data-id')));
        });
    });
}



// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        updateCartUI();
        
        // Show a quick toast notification
        const toastContainer = document.createElement('div');
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '1000';
        
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">Item Added</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${product.name} has been added to your cart.
            </div>
        `;
        
        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);
        
        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    }
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems === 0) {
        cartItems.innerHTML = '';
        
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }
    } else {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'none';
        }
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }
        
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'card mb-3';
            cartItem.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                    </div>
                    <div class="col-md-10">
                        <div class="card-body py-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="card-title mb-1">${item.name}</h6>
                                <button class="btn btn-sm text-danger remove-item" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="input-group input-group-sm" style="max-width: 120px">
                                    <button class="btn btn-outline-secondary decrease-qty" data-id="${item.id}">-</button>
                                    <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                                    <button class="btn btn-outline-secondary increase-qty" data-id="${item.id}">+</button>
                                </div>
                                <p class="card-text mb-0">$${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Add event listeners for the cart item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                removeFromCart(parseInt(this.getAttribute('data-id')));
            });
        });
        
        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', function() {
                updateQuantity(parseInt(this.getAttribute('data-id')), 1);
            });
        });
        
        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', function() {
                updateQuantity(parseInt(this.getAttribute('data-id')), -1);
            });
        });
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}



// Show payment modal
function showPaymentModal() {
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    const orderSummary = document.getElementById('order-summary');
    const orderTotal = document.getElementById('order-total');
    
    orderSummary.innerHTML = '';
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'd-flex justify-content-between mb-2';
        orderItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderSummary.appendChild(orderItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotal.textContent = `$${total.toFixed(2)}`;
    
    paymentModal.show();
}


