// Configuration
const BACKEND_URL = 'http://localhost:3000';
let currentProduct = null;
let currentQuantity = 1;
let cart = [];
let products = [];

// Get product ID from URL or localStorage
function getProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('id');
    if (urlId) return parseInt(urlId);
    
    const storageId = localStorage.getItem('selectedProduct');
    return storageId ? parseInt(storageId) : null;
}

const productId = getProductId();

// Helper functions
function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key}:`, error);
        return defaultValue;
    }
}

function setToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
    }
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function checkLoginRequired() {
    return getFromStorage('currentUser') !== null;
}

// Cart functions
function initializeCart() {
    const currentUser = getFromStorage('currentUser');
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    cart = getFromStorage(cartKey, []);
}

function saveCart() {
    const currentUser = getFromStorage('currentUser');
    const cartKey = currentUser ? `cart_of_${currentUser.name}` : 'cart_guest';
    setToStorage(cartKey, cart);
}

function updateCartBadge() {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const existingBadge = cartIcon.querySelector('.cart-badge');
    if (existingBadge) existingBadge.remove();
    
    if (totalItems > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = totalItems;
        badge.style.cssText = `
            position: absolute;
            top: -2px;
            right: -8px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 18px;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
    }
}

// Navigation functions
function goToCartPage() {
    if (!checkLoginRequired()) {
        showNotification('Please login to view your cart', 'warning');
        setTimeout(() => {
            window.location.href = '../LoginPage/login-page.html';
        }, 1500);
        return;
    }
    window.location.href = '../CartPage/cart-page.html';
}

// Quantity controls
function changeQuantity(change) {
    const input = document.getElementById('quantity');
    if (!input) return;
    
    currentQuantity = Math.max(1, currentQuantity + change);
    input.value = currentQuantity;
}

// Cart actions
function addToCart() {
    if (!checkLoginRequired()) {
        showNotification('Please login to add items to cart', 'warning');
        setTimeout(() => {
            window.location.href = '../LoginPage/login-page.html';
        }, 1500);
        return;
    }

    if (!currentProduct) {
        showNotification('Product not found', 'error');
        return;
    }

    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput?.value) || 1;
    const existingItem = cart.find(item => item.productId === currentProduct.product_id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        showNotification(`Updated ${currentProduct.product_name} quantity!`, 'success');
    } else {
        cart.push({
            productId: currentProduct.product_id,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
        showNotification(`Added ${quantity} ${currentProduct.product_name} to cart!`, 'success');
    }

    saveCart();
    updateCartBadge();
}

function buyNow() {
    if (!checkLoginRequired()) {
        showNotification('Please login to proceed', 'warning');
        setTimeout(() => {
            window.location.href = '../LoginPage/login-page.html';
        }, 1500);
        return;
    }

    if (!currentProduct) {
        showNotification('Product not found', 'error');
        return;
    }

    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput?.value) || 1;
    const existingItem = cart.find(item => item.productId === currentProduct.product_id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: currentProduct.product_id,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }

    saveCart();
    showNotification(`Proceeding to checkout...`, 'info');
    
    setTimeout(() => {
        window.location.href = '../CartPage/cart-page.html';
    }, 1500);
}

// Notification system
function showNotification(message, type = 'success') {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Get proper image URL
function getImageUrl(product) {
    // If product has images from backend
    if (product.productImages && product.productImages.length > 0) {
        const imageLink = product.productImages[0].product_image_link;
        
        // If it's already a full URL (http/https), use it directly
        if (imageLink.startsWith('http')) {
            return imageLink;
        }
        
        // If it's a relative path from backend, prepend BACKEND_URL
        if (imageLink.startsWith('/uploads')) {
            return `${BACKEND_URL}${imageLink}`;
        }
        
        return imageLink;
    }
    
    // Fallback to placeholder
    return 'https://via.placeholder.com/400x400?text=No+Image';
}

// Fetch products from API
async function fetchProducts() {
    try {
        console.log('Fetching from:', `${BACKEND_URL}/api/productImage`);
        const response = await fetch(`${BACKEND_URL}/api/productImage`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched:', data.length, 'products');
        
        products = data.map(product => ({
            id: product.product_id,
            product_id: product.product_id,
            name: product.product_name,
            product_name: product.product_name,
            price: formatPrice(product.product_price),
            product_price: product.product_price,
            description: product.product_description || 'No description available',
            category: product.category?.category_name || 'Uncategorized',
            category_id: product.category_id,
            image: getImageUrl(product),
            productImages: product.productImages
        }));
        
        console.log('Processed products:', products);
        return products;
    } catch (error) {
        console.error('Fetch error:', error);
        showNotification('Failed to load products. Using sample data.', 'warning');
        return createMockProducts();
    }
}

// Mock products as fallback
function createMockProducts() {
    console.warn('Using mock data - API failed');
    return [
        {
            id: 111,
            product_id: 111,
            name: 'Naruto Figure',
            product_name: 'Naruto Figure',
            price: formatPrice(2990000),
            product_price: 2990000,
            description: 'High-quality Naruto figure with detailed craftsmanship.',
            category: 'Naruto Figure',
            category_id: 1,
            image: 'https://images-na.ssl-images-amazon.com/images/I/71lKAaO0kjL.jpg'
        },
        {
            id: 112,
            product_id: 112,
            name: 'Sasuke Figure',
            product_name: 'Sasuke Figure',
            price: formatPrice(3590000),
            product_price: 3590000,
            description: 'Premium Sasuke Uchiha figure.',
            category: 'Naruto Figure',
            category_id: 1,
            image: 'https://product.hstatic.net/200000740923/product/375230918_4333024960256194_5745521659294105170_n_4df8cd6b8c3b423391d4a723724142a7_master.jpg'
        }
    ];
}

// Load and display product
async function loadProduct(productId) {
    const container = document.getElementById('product-container');
    
    if (!container) {
        console.error('Container not found!');
        return;
    }

    if (!productId) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h3 style="color: #e74c3c;">No Product Selected</h3>
                <p style="color: #666; margin: 1rem 0;">Please select a product from the shop.</p>
                <a href="../ShopPage/shop-page.html" style="color: #667eea; text-decoration: underline; font-weight: 600;">← Return to Shop</a>
            </div>
        `;
        return;
    }

    // Show loading
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            <p style="margin-top: 1rem; color: #666;">Loading product...</p>
        </div>
    `;

    try {
        // Fetch products
        await fetchProducts();
        
        // Find product
        currentProduct = products.find(p => p.id === productId);
        console.log('Current product:', currentProduct);
        
        if (!currentProduct) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h3 style="color: #e74c3c;">Product Not Found</h3>
                    <p style="color: #666; margin: 1rem 0;">The product with ID ${productId} could not be found.</p>
                    <a href="../ShopPage/shop-page.html" style="color: #667eea; text-decoration: underline; font-weight: 600;">← Return to Shop</a>
                </div>
            `;
            return;
        }

        // Update breadcrumb
        const breadcrumb = document.getElementById('breadcrumb-product');
        if (breadcrumb) breadcrumb.textContent = currentProduct.name;

        // Render product
        container.innerHTML = `
            <div class="product-layout">
                <div class="image-section">
                    <img src="${currentProduct.image}" 
                         alt="${currentProduct.name}" 
                         class="main-image"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/400x400?text=Image+Not+Available';">
                    <div class="image-badge">NEW</div>
                </div>
                <div class="details-section">
                    <div class="product-category">${currentProduct.category}</div>
                    <h1 class="product-title">${currentProduct.name}</h1>
                    <div class="product-price">${currentProduct.price}</div>
                    
                    <div class="product-meta">
                        <div class="meta-item">
                            <i class="fa-solid fa-truck"></i>
                            <span>Free Shipping</span>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-shield-halved"></i>
                            <span>2 Year Warranty</span>
                        </div>
                        <div class="meta-item status-available">
                            <i class="fa-solid fa-check-circle"></i>
                            <span>In Stock</span>
                        </div>
                    </div>
                    
                    <div class="rating">
                        <div class="stars">★★★★★</div>
                        <span>5.0 (${Math.floor(Math.random() * 50) + 10} reviews)</span>
                    </div>
                    
                    <p class="product-description">${currentProduct.description}</p>
                    
                    <div class="purchase-section">
                        <div class="quantity-selector">
                            <span class="quantity-label">Quantity:</span>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                                <input type="number" id="quantity" class="quantity-input" value="1" min="1">
                                <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="addToCart()">
                                <i class="fa-solid fa-cart-plus"></i>
                                Add to Cart
                            </button>
                            <button class="btn btn-secondary" onclick="buyNow()">
                                <i class="fa-solid fa-bolt"></i>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        loadRelatedProducts();
        
    } catch (error) {
        console.error('Load error:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h3 style="color: #e74c3c;">Error Loading Product</h3>
                <p style="color: #666; margin: 1rem 0;">Please try again later.</p>
                <a href="../ShopPage/shop-page.html" style="color: #667eea; text-decoration: underline; font-weight: 600;">← Return to Shop</a>
            </div>
        `;
    }
}

// Load related products
function loadRelatedProducts() {
    const relatedGrid = document.getElementById('related-grid');
    if (!relatedGrid || !currentProduct) return;
    
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    if (relatedProducts.length === 0) {
        relatedGrid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">No related products found</p>';
        return;
    }

    relatedGrid.innerHTML = relatedProducts.map(product => `
        <div class="related-card" onclick="selectProduct(${product.id})">
            <img src="${product.image}" 
                 alt="${product.name}"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/200x200?text=No+Image';">
            <div class="related-card-info">
                <h4>${product.name}</h4>
                <div class="price">${product.price}</div>
            </div>
        </div>
    `).join('');
}

// Select product
function selectProduct(productId) {
    localStorage.setItem('selectedProduct', productId);
    window.location.href = `products-page.html?id=${productId}`;
}

// Profile functions
function updateProfileImage() {
    const currentUser = getFromStorage('currentUser');
    const profileImg = document.querySelector('.profile-img');
    if (!profileImg) return;
    
    profileImg.src = currentUser?.profileImg || "https://www.svgrepo.com/show/343494/profile-user-account.svg";
    profileImg.alt = currentUser ? `${currentUser.name}'s profile` : "Default profile";
}

function updateProfileDropdown() {
    const currentUser = getFromStorage('currentUser');
    const dropdown = document.getElementById('profile-dropdown');
    if (!dropdown) return;

    if (currentUser) {
        dropdown.innerHTML = `
            <ul>
                <li class="user-greeting">
                    <a href="#" onclick="goToProfile()" style="color: #ffd700; font-weight: 600; font-size: 0.95rem; padding: 12px 20px; display: block; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                        ${currentUser.name}
                    </a>
                </li>
                <li><a href="../index.html">HOME</a></li>
                <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
                <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
                <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
                <li><a href="#" class="logout-btn" onclick="handleLogout()">LOGOUT</a></li>
            </ul>
        `;
    } else {
        dropdown.innerHTML = `
            <ul>
                <li><a href="../index.html">HOME</a></li>
                <li><a href="../AboutPage/about-page.html">ABOUT</a></li>
                <li><a href="../ShopPage/shop-page.html">SHOP</a></li>
                <li><a href="../ContactPage/contact-page.html">CONTACT</a></li>
                <li><a href="../LoginPage/login-page.html" class="sign-in">SIGN IN</a></li>
            </ul>
        `;
    }
}

function goToProfile() {
    if (!checkLoginRequired()) {
        window.location.href = '../LoginPage/login-page.html';
        return;
    }
    window.location.href = '../ProfileInfo/profile-info.html';
}

function handleLogout() {
    const currentUser = getFromStorage('currentUser');
    if (currentUser) {
        localStorage.removeItem(`cart_of_${currentUser.name}`);
    }
    localStorage.removeItem('currentUser');
    cart = [];
    updateProfileImage();
    updateProfileDropdown();
    updateCartBadge();
    showNotification('Successfully logged out', 'info');
}

function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

// Add spinner animation
const style = document.createElement('style');
style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Product Page Loaded ===');
    console.log('Product ID:', productId);
    
    initializeCart();
    updateProfileImage();
    updateProfileDropdown();
    updateCartBadge();
    
    if (productId) {
        loadProduct(productId);
    } else {
        const container = document.getElementById('product-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <h3 style="color: #e74c3c;">No Product Selected</h3>
                    <p style="color: #666; margin: 1rem 0;">Please select a product from the shop.</p>
                    <a href="../ShopPage/shop-page.html" style="color: #667eea; text-decoration: underline; font-weight: 600;">← Return to Shop</a>
                </div>
            `;
        }
    }
});

// Global functions
window.changeQuantity = changeQuantity;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.selectProduct = selectProduct;
window.goToProfile = goToProfile;
window.handleLogout = handleLogout;
window.toggleDropdown = toggleDropdown;
window.goToCartPage = goToCartPage;