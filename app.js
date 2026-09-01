/**
 * ==============================================================================
 * ShopNest Interactive Application - JavaScript Module End Assignment
 * 
 * Implemented Requirements:
 *  1. Async/await Fetch API to load product data from JSON.
 *  2. Dynamic product rendering using DOM methods.
 *  3. Live search filtering using the 'input' event.
 *  4. Category filter buttons (All, Electronics, Clothing, Footwear, Books)
 *     working simultaneously with live search.
 *  5. Functional Cart: Add to Cart, '+', '–', and 'Remove' operations with
 *     reactive running totals.
 *  6. localStorage persistence to save & restore cart state across refreshes.
 *  7. Live cart badge count in the header.
 *  8. "No products found" message when search/filter yields 0 results.
 *  9. Modular, clean, error-free architecture.
 * ==============================================================================
 */

'use strict';

// =============================================================================
// APP STATE
// =============================================================================
const appState = {
    products: [],           // All products loaded via Fetch
    cart: [],               // Array of { id, quantity }
    activeCategory: 'All',  // Selected category filter
    searchQuery: '',        // Live search string
    storageKey: 'shopnest_cart_items',
    freeShippingThreshold: 300
};

// Resilient fallback dataset if accessed via direct local file:// protocol
const FALLBACK_PRODUCTS_DATA = [
  {
    "id": 1,
    "name": "Structured Linen Blazer",
    "category": "Clothing",
    "price": 495,
    "originalPrice": 590,
    "rating": 4.8,
    "imageUrl": "asset/Blazer.png",
    "isNew": true
  },
  {
    "id": 2,
    "name": "Fluid Silk Blouse",
    "category": "Clothing",
    "price": 280,
    "originalPrice": 350,
    "rating": 4.9,
    "imageUrl": "asset/silk blouse.png",
    "isNew": true
  },
  {
    "id": 3,
    "name": "Wide-Leg Wool Trousers",
    "category": "Clothing",
    "price": 340,
    "originalPrice": 420,
    "rating": 4.7,
    "imageUrl": "asset/trouser.png",
    "isNew": false
  },
  {
    "id": 4,
    "name": "Unstructured Cashmere Coat",
    "category": "Clothing",
    "price": 850,
    "originalPrice": 990,
    "rating": 5.0,
    "imageUrl": "asset/coat.png",
    "isNew": true
  },
  {
    "id": 5,
    "name": "Tailored Slim Jeans",
    "category": "Clothing",
    "price": 210,
    "originalPrice": 260,
    "rating": 4.7,
    "imageUrl": "asset/jeans.png",
    "isNew": false
  },
  {
    "id": 6,
    "name": "Classic Oxford Shirt",
    "category": "Clothing",
    "price": 185,
    "originalPrice": 220,
    "rating": 4.6,
    "imageUrl": "asset/shirt.png",
    "isNew": false
  },
  {
    "id": 7,
    "name": "Wireless Noise-Cancelling Headphones",
    "category": "Electronics",
    "price": 349,
    "originalPrice": 429,
    "rating": 4.9,
    "imageUrl": "asset/headphones.jpg",
    "isNew": true
  },
  {
    "id": 8,
    "name": "Smart Fitness Watch",
    "category": "Electronics",
    "price": 279,
    "originalPrice": 349,
    "rating": 4.8,
    "imageUrl": "asset/smartwatch.jpg",
    "isNew": true
  },
  {
    "id": 9,
    "name": "Minimalist Mechanical Keyboard",
    "category": "Electronics",
    "price": 159,
    "originalPrice": 199,
    "rating": 4.7,
    "imageUrl": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    "isNew": false
  },
  {
    "id": 10,
    "name": "Hi-Fi Studio Bluetooth Speaker",
    "category": "Electronics",
    "price": 199,
    "originalPrice": 249,
    "rating": 4.8,
    "imageUrl": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    "isNew": false
  },
  {
    "id": 11,
    "name": "Minimalist White Leather Sneakers",
    "category": "Footwear",
    "price": 165,
    "originalPrice": 210,
    "rating": 4.9,
    "imageUrl": "asset/sneakers.jpg",
    "isNew": true
  },
  {
    "id": 12,
    "name": "Handcrafted Leather Loafers",
    "category": "Footwear",
    "price": 295,
    "originalPrice": 380,
    "rating": 4.8,
    "imageUrl": "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80",
    "isNew": false
  },
  {
    "id": 13,
    "name": "Classic Suede Chelsea Boots",
    "category": "Footwear",
    "price": 320,
    "originalPrice": 390,
    "rating": 4.7,
    "imageUrl": "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=600&q=80",
    "isNew": false
  },
  {
    "id": 14,
    "name": "Breathable Performance Runners",
    "category": "Footwear",
    "price": 145,
    "originalPrice": 180,
    "rating": 4.6,
    "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    "isNew": false
  },
  {
    "id": 15,
    "name": "Design Systems & Architecture",
    "category": "Books",
    "price": 48,
    "originalPrice": 65,
    "rating": 4.9,
    "imageUrl": "asset/book.jpg",
    "isNew": true
  },
  {
    "id": 16,
    "name": "The Philosophy of Quiet Luxury",
    "category": "Books",
    "price": 38,
    "originalPrice": 50,
    "rating": 4.8,
    "imageUrl": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    "isNew": false
  }
];

// =============================================================================
// DOM ELEMENT SELECTORS
// =============================================================================
const elements = {
    productsContainer: document.getElementById('products-container'),
    noProductsMessage: document.getElementById('no-products-message'),
    categoryButtons: document.querySelectorAll('#category-filter-group .cat-btn'),
    liveSearchInput: document.getElementById('live-search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    btnResetFilters: document.getElementById('btn-reset-filters'),
    btnViewAll: document.getElementById('btn-view-all'),
    navSearchIcon: document.getElementById('nav-search-icon'),

    // Cart Elements
    cartDrawer: document.getElementById('cart-drawer'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    cartTriggerBtns: document.querySelectorAll('.cart-trigger-btn'),
    btnCloseCart: document.getElementById('btn-close-cart'),
    cartBadgeCount: document.getElementById('cart-badge-count'),
    mobileCartBadgeCount: document.getElementById('mobile-cart-badge-count'),
    cartItemCountText: document.getElementById('cart-item-count-text'),
    cartItemsList: document.getElementById('cart-items-list'),
    cartEmptyState: document.getElementById('cart-empty-state'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartShipping: document.getElementById('cart-shipping'),
    cartTotalAmount: document.getElementById('cart-total-amount'),
    cartShippingMsg: document.getElementById('cart-shipping-msg'),
    btnCheckout: document.getElementById('btn-checkout'),
    btnClearCart: document.getElementById('btn-clear-cart'),
    btnCartShop: document.getElementById('btn-cart-shop'),

    // Toast Container
    toastContainer: document.getElementById('toast-container')
};

// =============================================================================
// 1. FETCH API WITH ASYNC/AWAIT
// =============================================================================
/**
 * Asynchronously loads product data from products.json.
 */
async function fetchProducts() {
    try {
        const response = await fetch('./products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        appState.products = Array.isArray(data) && data.length > 0 ? data : FALLBACK_PRODUCTS_DATA;
    } catch (error) {
        console.warn('Loading products via fallback dataset:', error);
        appState.products = FALLBACK_PRODUCTS_DATA;
    }
}

// =============================================================================
// 2. DYNAMIC DOM PRODUCT RENDERING
// =============================================================================
/**
 * Renders product cards into the DOM dynamically.
 * @param {Array} productList - Array of product objects
 */
function renderProducts(productList) {
    if (!elements.productsContainer) return;

    elements.productsContainer.innerHTML = '';

    if (!productList || productList.length === 0) {
        elements.productsContainer.style.display = 'none';
        elements.noProductsMessage.classList.add('show');
        return;
    }

    elements.productsContainer.style.display = 'flex';
    elements.noProductsMessage.classList.remove('show');

    const fragment = document.createDocumentFragment();

    productList.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 col-6';

        // Star rating generator
        const rating = product.rating || 5;
        const fullStars = Math.floor(rating);
        const hasHalfStar = (rating % 1) >= 0.5;
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += '<i class="bi bi-star-fill"></i>';
        if (hasHalfStar) starsHtml += '<i class="bi bi-star-half"></i>';

        // Badge tags
        const newBadge = product.isNew ? '<span class="badge-new">NEW</span>' : '';
        let discountBadge = '';
        if (product.originalPrice && product.originalPrice > product.price) {
            const pct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            discountBadge = `<span class="badge-discount-tag">-${pct}%</span>`;
        }

        col.innerHTML = `
            <article class="product-card" data-id="${product.id}">
                <div class="product-image">
                    ${newBadge}
                    ${discountBadge}
                    <img src="${product.imageUrl}" class="img-fluid" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'">
                    <div class="product-actions-overlay">
                        <button type="button" class="btn-add-cart" data-id="${product.id}">
                            <i class="bi bi-bag-plus"></i> ADD TO BAG
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category-text">${product.category}</span>
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-rating">
                        ${starsHtml}
                        <span class="rating-num">${rating.toFixed(1)}</span>
                    </div>
                    <div class="product-price-box">
                        <p class="product-price">$${product.price}</p>
                        ${product.originalPrice ? `<p class="product-original-price">$${product.originalPrice}</p>` : ''}
                    </div>
                    <button type="button" class="btn-mobile-add-cart" data-id="${product.id}">
                        <i class="bi bi-bag-plus"></i> ADD TO BAG
                    </button>
                </div>
            </article>
        `;

        fragment.appendChild(col);
    });

    elements.productsContainer.appendChild(fragment);
}

// =============================================================================
// 3. LIVE SEARCH & SIMULTANEOUS CATEGORY FILTERING
// =============================================================================
/**
 * Intersects live search keyword + category filter and updates DOM.
 */
function applyFilters() {
    let filtered = [...appState.products];

    // 1. Category Filter
    if (appState.activeCategory && appState.activeCategory !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === appState.activeCategory.toLowerCase());
    }

    // 2. Live Search Keyword Filter (Case-insensitive by name)
    if (appState.searchQuery && appState.searchQuery.trim() !== '') {
        const term = appState.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    renderProducts(filtered);
}

/**
 * Handles input event on the search box.
 */
function handleSearchInput(e) {
    appState.searchQuery = e.target.value;
    
    if (elements.clearSearchBtn) {
        elements.clearSearchBtn.style.display = appState.searchQuery.trim().length > 0 ? 'block' : 'none';
    }

    applyFilters();
}

/**
 * Handles category button click.
 */
function handleCategoryClick(category) {
    appState.activeCategory = category;

    elements.categoryButtons.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    applyFilters();
}

/**
 * Resets all filters to default.
 */
function resetAllFilters() {
    appState.searchQuery = '';
    appState.activeCategory = 'All';

    if (elements.liveSearchInput) elements.liveSearchInput.value = '';
    if (elements.clearSearchBtn) elements.clearSearchBtn.style.display = 'none';

    elements.categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === 'All');
    });

    applyFilters();
    showToast('Filters reset to show all items.', 'info');
}

// =============================================================================
// 4. FUNCTIONAL CART & REACTIVE CALCULATIONS
// =============================================================================
/**
 * Adds an item to the shopping cart.
 */
function addToCart(productId) {
    const id = Number(productId);
    const product = appState.products.find(p => p.id === id);
    if (!product) return;

    const existing = appState.cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        appState.cart.push({ id: id, quantity: 1 });
    }

    saveCart();
    renderCart();
    updateCartBadge();
    showToast(`Added "${product.name}" to your bag.`, 'success');
}

/**
 * Updates item quantity (+1 or -1).
 */
function updateQuantity(productId, delta) {
    const id = Number(productId);
    const itemIndex = appState.cart.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    appState.cart[itemIndex].quantity += delta;

    if (appState.cart[itemIndex].quantity <= 0) {
        removeFromCart(id, false);
    } else {
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

/**
 * Removes an item from the cart.
 */
function removeFromCart(productId, showNotification = true) {
    const id = Number(productId);
    const product = appState.products.find(p => p.id === id);

    appState.cart = appState.cart.filter(item => item.id !== id);

    saveCart();
    renderCart();
    updateCartBadge();

    if (showNotification && product) {
        showToast(`Removed "${product.name}" from your bag.`, 'info');
    }
}

/**
 * Clears the shopping bag.
 */
function clearCart() {
    if (appState.cart.length === 0) return;
    appState.cart = [];
    saveCart();
    renderCart();
    updateCartBadge();
    showToast('Shopping bag cleared.', 'info');
}

/**
 * Calculates cart subtotal, shipping, and grand total.
 */
function calculateTotals() {
    let subtotal = 0;
    let totalItems = 0;

    appState.cart.forEach(item => {
        const p = appState.products.find(prod => prod.id === item.id);
        if (p) {
            subtotal += p.price * item.quantity;
            totalItems += item.quantity;
        }
    });

    const isFreeShipping = subtotal >= appState.freeShippingThreshold || totalItems === 0;
    const shipping = totalItems === 0 ? 0 : (isFreeShipping ? 0 : 25);
    const grandTotal = subtotal + shipping;

    return { subtotal, shipping, grandTotal, totalItems, isFreeShipping };
}

/**
 * Dynamically renders the cart drawer.
 */
function renderCart() {
    if (!elements.cartItemsList) return;

    elements.cartItemsList.innerHTML = '';
    const totals = calculateTotals();

    // Toggle Empty State
    if (appState.cart.length === 0) {
        elements.cartEmptyState.classList.add('show');
        elements.cartItemsList.style.display = 'none';
        elements.cartItemCountText.textContent = '(0 items)';
        elements.cartShippingMsg.textContent = 'Complimentary shipping on orders over $300';
    } else {
        elements.cartEmptyState.classList.remove('show');
        elements.cartItemsList.style.display = 'flex';
        elements.cartItemCountText.textContent = `(${totals.totalItems} ${totals.totalItems === 1 ? 'item' : 'items'})`;

        if (totals.isFreeShipping) {
            elements.cartShippingMsg.innerHTML = '<span class="text-success fw-bold">✓ Qualified for Free Global Shipping!</span>';
        } else {
            const diff = appState.freeShippingThreshold - totals.subtotal;
            elements.cartShippingMsg.innerHTML = `Add <strong>$${diff.toFixed(2)}</strong> more for Free Shipping!`;
        }

        const fragment = document.createDocumentFragment();

        appState.cart.forEach(item => {
            const p = appState.products.find(prod => prod.id === item.id);
            if (!p) return;

            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.innerHTML = `
                <div class="cart-item-img">
                    <img src="${p.imageUrl}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'">
                </div>
                <div class="cart-item-info">
                    <h6>${p.name}</h6>
                    <span class="item-cat">${p.category}</span>
                    <span class="item-price">$${p.price}</span>
                    <div class="cart-qty-control">
                        <button type="button" class="qty-btn btn-qty-dec" data-id="${p.id}" aria-label="Decrease">&minus;</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button type="button" class="qty-btn btn-qty-inc" data-id="${p.id}" aria-label="Increase">&plus;</button>
                    </div>
                </div>
                <div class="cart-item-side">
                    <button type="button" class="btn-remove-cart-item" data-id="${p.id}" aria-label="Remove item">
                        <i class="bi bi-trash3"></i>
                    </button>
                    <span class="item-line-total">$${(p.price * item.quantity).toFixed(2)}</span>
                </div>
            `;

            fragment.appendChild(row);
        });

        elements.cartItemsList.appendChild(fragment);
    }

    // Update Totals
    elements.cartSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
    elements.cartShipping.textContent = totals.shipping === 0 ? (totals.totalItems === 0 ? '$0.00' : 'FREE') : `$${totals.shipping.toFixed(2)}`;
    elements.cartTotalAmount.textContent = `$${totals.grandTotal.toFixed(2)}`;
}

/**
 * Updates header badge count.
 */
function updateCartBadge() {
    const totalCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);

    const updateBadge = (badgeEl) => {
        if (!badgeEl) return;
        badgeEl.textContent = totalCount;
        badgeEl.classList.add('bump');
        setTimeout(() => badgeEl.classList.remove('bump'), 200);
    };

    updateBadge(elements.cartBadgeCount);
    updateBadge(elements.mobileCartBadgeCount);
}

// =============================================================================
// 5. LOCALSTORAGE PERSISTENCE
// =============================================================================
function saveCart() {
    try {
        localStorage.setItem(appState.storageKey, JSON.stringify(appState.cart));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function loadCart() {
    try {
        const saved = localStorage.getItem(appState.storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) appState.cart = parsed;
        }
    } catch (e) {
        console.warn('Could not restore from localStorage:', e);
        appState.cart = [];
    }
}

// =============================================================================
// 6. UI HELPERS (DRAWER & TOAST NOTIFICATIONS)
// =============================================================================
function toggleCartDrawer(open) {
    if (open) {
        elements.cartDrawer.classList.add('open');
        elements.cartBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        elements.cartDrawer.classList.remove('open');
        elements.cartBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function showToast(message, type = 'success') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-custom toast-${type}`;
    toast.innerHTML = `
        <i class="bi bi-check-circle-fill"></i>
        <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 2400);
}

// =============================================================================
// 7. EVENT LISTENERS
// =============================================================================
function setupEventListeners() {
    // 1. Live Search Input
    if (elements.liveSearchInput) {
        elements.liveSearchInput.addEventListener('input', handleSearchInput);
    }

    if (elements.clearSearchBtn) {
        elements.clearSearchBtn.addEventListener('click', () => {
            appState.searchQuery = '';
            elements.liveSearchInput.value = '';
            elements.clearSearchBtn.style.display = 'none';
            applyFilters();
        });
    }

    // 2. Category Filter Buttons
    elements.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-category');
            handleCategoryClick(cat);
        });
    });

    // 3. Category shortcuts in Featured Cards & Nav
    document.querySelectorAll('[data-category-filter]').forEach(el => {
        el.addEventListener('click', (e) => {
            const cat = el.getAttribute('data-category-filter');
            if (cat) handleCategoryClick(cat);
        });
    });

    // 4. View All & Reset Buttons
    if (elements.btnViewAll) {
        elements.btnViewAll.addEventListener('click', (e) => {
            e.preventDefault();
            resetAllFilters();
        });
    }

    if (elements.btnResetFilters) {
        elements.btnResetFilters.addEventListener('click', resetAllFilters);
    }

    // 5. Header Search Shortcut
    if (elements.navSearchIcon) {
        elements.navSearchIcon.addEventListener('click', (e) => {
            if (elements.liveSearchInput) {
                elements.liveSearchInput.focus();
            }
        });
    }

    // 6. Product Grid Quick-Add Click Delegation
    if (elements.productsContainer) {
        elements.productsContainer.addEventListener('click', (e) => {
            const addBtn = e.target.closest('.btn-add-cart, .btn-mobile-add-cart');
            if (addBtn) {
                const id = addBtn.getAttribute('data-id');
                if (id) addToCart(id);
            }
        });
    }

    // 7. Cart Drawer Open / Close
    elements.cartTriggerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCartDrawer(true);
        });
    });

    if (elements.btnCloseCart) {
        elements.btnCloseCart.addEventListener('click', () => toggleCartDrawer(false));
    }
    if (elements.cartBackdrop) {
        elements.cartBackdrop.addEventListener('click', () => toggleCartDrawer(false));
    }
    if (elements.btnCartShop) {
        elements.btnCartShop.addEventListener('click', () => {
            toggleCartDrawer(false);
            const section = document.getElementById('new-arrivals');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 8. Cart Items Actions Delegation (+, -, Remove)
    if (elements.cartItemsList) {
        elements.cartItemsList.addEventListener('click', (e) => {
            const incBtn = e.target.closest('.btn-qty-inc');
            const decBtn = e.target.closest('.btn-qty-dec');
            const removeBtn = e.target.closest('.btn-remove-cart-item');

            if (incBtn) {
                updateQuantity(incBtn.getAttribute('data-id'), 1);
            } else if (decBtn) {
                updateQuantity(decBtn.getAttribute('data-id'), -1);
            } else if (removeBtn) {
                removeFromCart(removeBtn.getAttribute('data-id'));
            }
        });
    }

    // 9. Clear Cart & Checkout
    if (elements.btnClearCart) {
        elements.btnClearCart.addEventListener('click', clearCart);
    }

    if (elements.btnCheckout) {
        elements.btnCheckout.addEventListener('click', () => {
            if (appState.cart.length === 0) {
                showToast('Your shopping bag is empty.', 'warn');
                return;
            }
            const totals = calculateTotals();
            showToast(`Order placed for $${totals.grandTotal.toFixed(2)}! Thank you for shopping with ShopNest.`, 'success');
        });
    }

    // ESC to close drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.cartDrawer.classList.contains('open')) {
            toggleCartDrawer(false);
        }
    });
}

// =============================================================================
// 8. INITIALIZE APPLICATION
// =============================================================================
async function init() {
    loadCart();
    setupEventListeners();
    await fetchProducts();
    applyFilters();
    renderCart();
    updateCartBadge();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
