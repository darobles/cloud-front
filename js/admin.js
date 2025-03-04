// Sample product data - this would normally come from your API/backend
let products = [];
let currentProductId = 1;
let selectedProductId = null;

// Fetch products data from the API
function fetchProducts() {
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched products:', data);
            products = data;
            // Update currentProductId to be one greater than the highest id
            currentProductId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
            displayProducts(document.getElementById('category-filter').value);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            // Optionally, use sample data in case of error
            useSampleData();
            displayProducts(document.getElementById('category-filter').value);
        });
}

// Use sample data if API fails
function useSampleData() {
    products = [
        {
            id: 1,
            name: "Premium Dog Food",
            price: 29.99,
            description: "High-quality premium dog food for all breeds.",
            category: "food",
            image: "https://via.placeholder.com/300?text=Dog+Food",
            stock: 45,
            sku: "DF001",
            featured: true,
            active: true
        },
        {
            id: 2,
            name: "Rope Chew Toy",
            price: 12.99,
            description: "Durable rope toy for hours of play.",
            category: "toys",
            image: "https://via.placeholder.com/300?text=Rope+Toy",
            stock: 78,
            sku: "DT002",
            featured: false,
            active: true
        },
        {
            id: 3,
            name: "Adjustable Collar",
            price: 18.99,
            description: "Comfortable and stylish adjustable collar for all sizes.",
            category: "accessories",
            image: "https://via.placeholder.com/300?text=Dog+Collar",
            stock: 32,
            sku: "DA003",
            featured: true,
            active: true
        },
        {
            id: 4,
            name: "Grain-Free Treats",
            price: 8.99,
            description: "Healthy grain-free treats your dog will love.",
            category: "food",
            image: "https://via.placeholder.com/300?text=Dog+Treats",
            stock: 65,
            sku: "DF004",
            featured: false,
            active: true
        }
    ];
    currentProductId = 5;
}

// Display products in the table
function displayProducts(category = 'all') {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    const filteredProducts = category === 'all' ? 
        products : 
        products.filter(product => product.category === category);
    
    document.getElementById('showing-items').textContent = filteredProducts.length;
    document.getElementById('total-items').textContent = products.length;
    
    if (filteredProducts.length === 0) {
        productList.innerHTML = '<tr><td colspan="7" class="text-center py-3">No products found</td></tr>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" class="product-img-preview" alt="${product.name}"></td>
            <td>
                ${product.name}
                ${product.featured ? '<span class="badge bg-warning ms-1">Featured</span>' : ''}
                ${!product.active ? '<span class="badge bg-secondary ms-1">Inactive</span>' : ''}
            </td>
            <td><span class="badge category-badge">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span></td>
            <td>$${product.price}</td>
            <td>${product.stock} units</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-primary edit-product" data-id="${product.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        productList.appendChild(row);
    });
    
    // Add event listeners to edit/delete buttons
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            openEditModal(productId);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            openDeleteModal(productId);
        });
    });
}

// Filtering by category
document.getElementById('category-filter').addEventListener('change', function() {
    displayProducts(this.value);
});

// Search functionality
document.getElementById('search-products').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayProducts(document.getElementById('category-filter').value);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm))
    );
    
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    document.getElementById('showing-items').textContent = filteredProducts.length;
    
    if (filteredProducts.length === 0) {
        productList.innerHTML = '<tr><td colspan="7" class="text-center py-3">No matching products found</td></tr>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const categoryFilter = document.getElementById('category-filter').value;
        if (categoryFilter === 'all' || product.category === categoryFilter) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" class="product-img-preview" alt="${product.name}"></td>
                <td>
                    ${product.name}
                    ${product.featured ? '<span class="badge bg-warning ms-1">Featured</span>' : ''}
                    ${!product.active ? '<span class="badge bg-secondary ms-1">Inactive</span>' : ''}
                </td>
                <td><span class="badge category-badge">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span></td>
                <td>$${product.price}</td>
                <td>${product.stock} units</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-primary edit-product" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-product" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productList.appendChild(row);
        }
    });
    
    // Re-add event listeners
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            openEditModal(productId);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            openDeleteModal(productId);
        });
    });
});

// Refresh products
document.getElementById('refresh-products').addEventListener('click', function() {
    fetchProducts();
});

// Image preview for add product form
document.getElementById('product-image').addEventListener('change', function(event) {
    const preview = document.getElementById('image-preview');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = 'https://via.placeholder.com/150';
    }
});

// Image preview for edit product form
document.getElementById('edit-product-image').addEventListener('change', function(event) {
    const preview = document.getElementById('edit-image-preview');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Save new product using API
document.getElementById('save-product-btn').addEventListener('click', function() {
    const name = document.getElementById('product-name').value.trim();
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value.trim();
    const stock = parseInt(document.getElementById('product-stock').value);
    const sku = document.getElementById('product-sku').value.trim();
    const featured = document.getElementById('product-featured').checked;
    const active = document.getElementById('product-active').checked;
    
    // Validation
    if (!name || !category || isNaN(price) || !description || isNaN(stock)) {
        alert('Please fill in all required fields correctly');
        return;
    }
    
    // Get image data or use placeholder
    let imageUrl = 'https://via.placeholder.com/300?text=' + encodeURIComponent(name);
    const imageInput = document.getElementById('product-image');
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            completeAddProduct();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        completeAddProduct();
    }
    
    function completeAddProduct() {
        const newProduct = {
            name,
            category,
            price,
            description,
            stock,
            sku,
            featured,
            active,
            image: imageUrl
        };
        // POST new product to API
        fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error creating product');
            }
            return response.json();
        })
        .then(data => {
            // Optionally, add the returned product to the local array
            products.push(data);
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();
            document.getElementById('add-product-form').reset();
            document.getElementById('image-preview').src = 'https://via.placeholder.com/150';
            // Refresh products display
            displayProducts(document.getElementById('category-filter').value);
            showToast('Product Added', `${name} has been successfully added.`);
        })
        .catch(error => {
            console.error(error);
            alert('There was an error adding the product.');
        });
    }
});

// Open edit product modal
function openEditModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Populate form fields
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-category').value = product.category_id;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-description').value = product.description;
    document.getElementById('edit-product-stock').value = product.stock || 0;
    document.getElementById('edit-product-sku').value = product.sku || '';
    document.getElementById('edit-product-featured').checked = product.featured || false;
    document.getElementById('edit-product-active').checked = product.active !== false; // Default to true if not specified
    
    // Set image preview
    document.getElementById('edit-image-preview').src = product.image;
    
    // Show modal
    const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    editModal.show();
}

// Update product using API
document.getElementById('update-product-btn').addEventListener('click', function() {
    const id = parseInt(document.getElementById('edit-product-id').value);
    const name = document.getElementById('edit-product-name').value.trim();
    const category_id = parseInt(document.getElementById('edit-product-category').value);
    const price = parseFloat(document.getElementById('edit-product-price').value);
    const description = document.getElementById('edit-product-description').value.trim();
    const stock = parseInt(document.getElementById('edit-product-stock').value);
    const sku = document.getElementById('edit-product-sku').value.trim();
    const featured = document.getElementById('edit-product-featured').checked;
    const active = document.getElementById('edit-product-active').checked;
    let imageUrl = document.getElementById('edit-image-preview').src;
    const imageInput = document.getElementById('edit-product-image');
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageUrl = e.target.result;
            completeUpdateProduct(imageUrl);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        completeUpdateProduct(imageUrl);
    }

    function completeUpdateProduct(updatedImageUrl) {
        const updatedProduct = {
            name,
            category_id,
            price,
            description,
            stock,
            sku,
            featured,
            active,
            image: updatedImageUrl
        };
        // PUT update to API
        fetch(`http://localhost:5000/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error updating product');
            }
            return response.json();
        })
        .then(data => {
            // Update the local products array
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex !== -1) {
                products[productIndex] = data;
            }
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            modal.hide();
            document.getElementById('edit-product-form').reset();
            displayProducts(document.getElementById('category-filter').value);
            showToast('Product Updated', `${name} has been successfully updated.`);
        })
        .catch(error => {
            console.error(error);
            alert('There was an error updating the product.');
        });
    }
});

// Open delete product modal  
function openDeleteModal(productId) {
    selectedProductId = productId;
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('delete-product-name').textContent = product.name;
    
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    deleteModal.show();
}

// Delete product using API – Call DELETE when user confirms deletion
function deleteProduct() {
    if (!selectedProductId) return;
    fetch(`http://localhost:5000/api/products/${selectedProductId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting product');
        }
        return response.json();
    })
    .then(data => {
        // Remove deleted product from local array
        products = products.filter(p => p.id !== selectedProductId);
        // Close delete modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
        modal.hide();
        displayProducts(document.getElementById('category-filter').value);
        showToast('Product Deleted', 'Product has been successfully deleted.');
    })
    .catch(error => {
        console.error(error);
        alert('There was an error deleting the product.');
    });
}

// In your delete modal, bind the deleteProduct() function to the confirm button
document.getElementById('confirm-delete-btn').addEventListener('click', deleteProduct);

function showToast(title, message) {
    // Create a toast container if it doesn't exist
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.top = '1rem';
        container.style.right = '1rem';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
    }
    
    // Create a unique ID for the toast
    const toastId = 'toast-' + Date.now();
    
    // Append the toast element to the container
    container.innerHTML += `
        <div id="${toastId}" class="toast align-items-center text-bg-primary border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${title}</strong><br>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    // Initialize and show the toast using Bootstrap's Toast class
    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement);
    bsToast.show();
}

document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
});
