/**
 * ==============================================================================
 * ATELIER Interactive Application — JavaScript Module
 * Clean, modern, high-performance vanilla JavaScript.
 * ==============================================================================
 */

'use strict';

// =============================================================================
// APP STATE
// =============================================================================
const appState = {
    products: [],
    cart: [],
    activeCategory: 'All',
    searchQuery: '',
    discountRate: 0,
    discountCode: '',
    storageKey: 'atelier_cart_items',
    legacyStorageKey: 'shopnest_cart_items',
    freeShippingThreshold: 300
};

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

    // Cart Drawer Elements
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

    // Cart Page Elements
    cartPageSection: document.getElementById('cart-page-section'),
    cartPageSubtitle: document.getElementById('cartPageSubtitle'),
    cartPageEmpty: document.getElementById('cartPageEmpty'),
    cartPageLayout: document.getElementById('cartPageLayout'),
    cartPageItemsList: document.getElementById('cartPageItemsList'),
    btnContinueShopping: document.getElementById('btnContinueShopping'),
    btnCartPageExplore: document.getElementById('btnCartPageExplore'),
    cartDiscountInput: document.getElementById('cartDiscountInput'),
    btnApplyCartDiscount: document.getElementById('btnApplyCartDiscount'),
    appliedDiscountRow: document.getElementById('appliedDiscountRow'),
    appliedDiscountCodeName: document.getElementById('appliedDiscountCodeName'),
    btnRemoveCartDiscount: document.getElementById('btnRemoveCartDiscount'),
    discountFeedbackMsg: document.getElementById('discountFeedbackMsg'),
    summarySubtotalVal: document.getElementById('summarySubtotalVal'),
    summaryDiscountLine: document.getElementById('summaryDiscountLine'),
    summaryDiscountVal: document.getElementById('summaryDiscountVal'),
    summaryShippingVal: document.getElementById('summaryShippingVal'),
    summaryTotalPriceVal: document.getElementById('summaryTotalPriceVal'),
    btnPageCheckout: document.getElementById('btnPageCheckout'),

    // Catalog Sections
    heroSection: document.getElementById('home'),
    shippingBar: document.querySelector('.shipping-bar'),
    categoriesSection: document.getElementById('categories'),
    newArrivalsSection: document.getElementById('new-arrivals'),
    trendingSection: document.getElementById('trending'),

    // Toast Container
    toastContainer: document.getElementById('toast-container')
};

// =============================================================================
// 1. DATA INITIALIZATION (EMBEDDED JSON)
// =============================================================================
function loadProducts() {
    const dataTag = document.getElementById('atelier-products-data');
    if (dataTag && dataTag.textContent.trim()) {
        try {
            appState.products = JSON.parse(dataTag.textContent.trim());
        } catch (e) {
            console.error('Error parsing embedded atelier product catalog:', e);
            appState.products = [];
        }
    }
}

// =============================================================================
// 2. DYNAMIC PRODUCT RENDERING
// =============================================================================
function renderProducts(productList) {
    if (!elements.productsContainer) return;
    elements.productsContainer.innerHTML = '';

    if (!productList || productList.length === 0) {
        elements.productsContainer.style.display = 'none';
        if (elements.noProductsMessage) elements.noProductsMessage.classList.add('show');
        return;
    }

    elements.productsContainer.style.display = 'flex';
    if (elements.noProductsMessage) elements.noProductsMessage.classList.remove('show');

    const fragment = document.createDocumentFragment();

    productList.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 col-6';

        const rating = product.rating || 5;
        const fullStars = Math.floor(rating);
        const hasHalfStar = (rating % 1) >= 0.5;
        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) starsHtml += '<i class="bi bi-star-fill"></i>';
        if (hasHalfStar) starsHtml += '<i class="bi bi-star-half"></i>';

        const newBadge = product.isNew ? '<span class="badge-new">NEW</span>' : '';
        let discountBadge = '';
        if (product.originalPrice && product.originalPrice > product.price) {
            const pct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            discountBadge = `<span class="badge-discount-tag">-${pct}%</span>`;
        }

        col.innerHTML = `
            <article class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                    ${newBadge}
                    ${discountBadge}
                    <div class="product-actions-overlay">
                        <button type="button" class="btn-add-cart" data-id="${product.id}">
                            <i class="bi bi-bag-plus"></i> ADD TO BAG
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category-text">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        ${starsHtml}
                        <span class="rating-num">(${rating})</span>
                    </div>
                    <div class="product-price-box">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="product-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button type="button" class="btn-mobile-add-cart" data-id="${product.id}">
                        <i class="bi bi-bag-plus me-1"></i> ADD TO BAG
                    </button>
                </div>
            </article>
        `;

        col.querySelectorAll('.btn-add-cart, .btn-mobile-add-cart').forEach(btn => {
            btn.addEventListener('click', () => addToCart(product.id));
        });

        fragment.appendChild(col);
    });

    elements.productsContainer.appendChild(fragment);
}

// =============================================================================
// 3. SEARCH & CATEGORY FILTERING
// =============================================================================
function applyFilters() {
    const query = appState.searchQuery.toLowerCase().trim();
    const category = appState.activeCategory;

    const filtered = appState.products.filter(p => {
        const matchesCategory = (category === 'All') || (p.category === category);
        const matchesSearch = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
}

function handleSearchInput(e) {
    appState.searchQuery = e.target.value;
    if (elements.clearSearchBtn) {
        elements.clearSearchBtn.style.display = appState.searchQuery.length > 0 ? 'block' : 'none';
    }
    applyFilters();
}

function handleCategoryClick(category) {
    appState.activeCategory = category;
    elements.categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === category);
    });
    applyFilters();
}

function resetAllFilters() {
    appState.searchQuery = '';
    appState.activeCategory = 'All';
    if (elements.liveSearchInput) elements.liveSearchInput.value = '';
    if (elements.clearSearchBtn) elements.clearSearchBtn.style.display = 'none';
    elements.categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === 'All');
    });
    applyFilters();
}

// =============================================================================
// 4. CART OPERATIONS & STATE MANAGEMENT
// =============================================================================
function addToCart(productId) {
    const product = appState.products.find(p => p.id === Number(productId));
    if (!product) return;

    const existingItem = appState.cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({ id: product.id, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`Added "${product.name}" to shopping bag.`, 'success');
}

function updateQuantity(productId, delta) {
    const itemIndex = appState.cart.findIndex(i => i.id === Number(productId));
    if (itemIndex === -1) return;

    appState.cart[itemIndex].quantity += delta;
    if (appState.cart[itemIndex].quantity <= 0) {
        const removed = appState.products.find(p => p.id === Number(productId));
        appState.cart.splice(itemIndex, 1);
        if (removed) showToast(`Removed "${removed.name}" from shopping bag.`, 'info');
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(productId, showNotification = true) {
    const itemIndex = appState.cart.findIndex(i => i.id === Number(productId));
    if (itemIndex === -1) return;

    const product = appState.products.find(p => p.id === Number(productId));
    appState.cart.splice(itemIndex, 1);

    saveCart();
    updateCartUI();
    if (showNotification && product) {
        showToast(`Removed "${product.name}" from shopping bag.`, 'info');
    }
}

function clearCart() {
    if (appState.cart.length === 0) return;
    appState.cart = [];
    appState.discountRate = 0;
    appState.discountCode = '';
    saveCart();
    updateCartUI();
    showToast('Shopping bag cleared.', 'info');
}

function calculateTotals() {
    let subtotal = 0;
    let itemCount = 0;

    appState.cart.forEach(item => {
        const product = appState.products.find(p => p.id === item.id);
        if (product) {
            subtotal += product.price * item.quantity;
            itemCount += item.quantity;
        }
    });

    const discountAmount = subtotal * appState.discountRate;
    const discountedSubtotal = subtotal - discountAmount;
    const shipping = (subtotal === 0 || subtotal >= appState.freeShippingThreshold) ? 0 : 25;
    const total = discountedSubtotal + shipping;

    return { subtotal, discountAmount, discountedSubtotal, shipping, total, itemCount };
}

function updateCartUI() {
    updateCartBadge();
    renderCartDrawer();
    renderCartPage();
}

function updateCartBadge() {
    const { itemCount } = calculateTotals();
    [elements.cartBadgeCount, elements.mobileCartBadgeCount].forEach(badge => {
        if (!badge) return;
        badge.textContent = itemCount;
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
    });
}

function saveCart() {
    try {
        localStorage.setItem(appState.storageKey, JSON.stringify(appState.cart));
    } catch (e) {
        console.warn('LocalStorage error:', e);
    }
}

function loadCart() {
    try {
        const saved = localStorage.getItem(appState.storageKey) || localStorage.getItem(appState.legacyStorageKey);
        if (saved) appState.cart = JSON.parse(saved);
    } catch (e) {
        appState.cart = [];
    }
}

// =============================================================================
// 5. SLIDE-OUT DRAWER RENDERING
// =============================================================================
function renderCartDrawer() {
    if (!elements.cartItemsList) return;
    const { subtotal, shipping, total, itemCount } = calculateTotals();

    if (elements.cartItemCountText) {
        elements.cartItemCountText.textContent = `(${itemCount} ${itemCount === 1 ? 'item' : 'items'})`;
    }

    if (appState.cart.length === 0) {
        elements.cartItemsList.innerHTML = '';
        if (elements.cartEmptyState) elements.cartEmptyState.classList.add('show');
        if (elements.cartSubtotal) elements.cartSubtotal.textContent = '$0.00';
        if (elements.cartShipping) elements.cartShipping.textContent = '$0.00';
        if (elements.cartTotalAmount) elements.cartTotalAmount.textContent = '$0.00';
        if (elements.cartShippingMsg) {
            elements.cartShippingMsg.textContent = `Complimentary shipping on orders over $${appState.freeShippingThreshold}`;
        }
        return;
    }

    if (elements.cartEmptyState) elements.cartEmptyState.classList.remove('show');
    elements.cartItemsList.innerHTML = '';

    const fragment = document.createDocumentFragment();

    appState.cart.forEach(item => {
        const product = appState.products.find(p => p.id === item.id);
        if (!product) return;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-item-img">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <h6>${product.name}</h6>
                <span class="item-cat">${product.category}</span>
                <span class="item-price">$${product.price.toFixed(2)}</span>
                <div class="cart-qty-control">
                    <button type="button" class="qty-btn btn-minus" data-id="${product.id}" aria-label="Decrease">–</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button type="button" class="qty-btn btn-plus" data-id="${product.id}" aria-label="Increase">+</button>
                </div>
            </div>
            <div class="cart-item-side d-flex flex-column align-items-end justify-content-between h-100">
                <button type="button" class="btn-remove-cart-item" data-id="${product.id}" aria-label="Remove item">
                    <i class="bi bi-trash3"></i>
                </button>
                <span class="item-line-total fw-bold">$${(product.price * item.quantity).toFixed(2)}</span>
            </div>
        `;

        row.querySelector('.btn-minus').addEventListener('click', () => updateQuantity(product.id, -1));
        row.querySelector('.btn-plus').addEventListener('click', () => updateQuantity(product.id, 1));
        row.querySelector('.btn-remove-cart-item').addEventListener('click', () => removeFromCart(product.id));

        fragment.appendChild(row);
    });

    elements.cartItemsList.appendChild(fragment);

    if (elements.cartSubtotal) elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.cartShipping) elements.cartShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (elements.cartTotalAmount) elements.cartTotalAmount.textContent = `$${total.toFixed(2)}`;

    if (elements.cartShippingMsg) {
        if (subtotal >= appState.freeShippingThreshold) {
            elements.cartShippingMsg.textContent = 'You have earned complimentary shipping!';
        } else {
            const needed = (appState.freeShippingThreshold - subtotal).toFixed(2);
            elements.cartShippingMsg.textContent = `Add $${needed} more to unlock complimentary shipping.`;
        }
    }
}

function toggleCartDrawer(open) {
    if (!elements.cartDrawer || !elements.cartBackdrop) return;
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

// =============================================================================
// 6. FULL-WIDTH CART PAGE RENDERING
// =============================================================================
function renderCartPage() {
    if (!elements.cartPageSection) return;
    const { subtotal, discountAmount, discountedSubtotal, shipping, total, itemCount } = calculateTotals();

    if (elements.cartPageSubtitle) {
        elements.cartPageSubtitle.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for checkout.`;
    }

    if (appState.cart.length === 0) {
        if (elements.cartPageEmpty) elements.cartPageEmpty.style.display = 'block';
        if (elements.cartPageLayout) elements.cartPageLayout.style.display = 'none';
        return;
    }

    if (elements.cartPageEmpty) elements.cartPageEmpty.style.display = 'none';
    if (elements.cartPageLayout) elements.cartPageLayout.style.display = 'flex';

    if (elements.cartPageItemsList) {
        elements.cartPageItemsList.innerHTML = '';
        const fragment = document.createDocumentFragment();

        appState.cart.forEach(item => {
            const product = appState.products.find(p => p.id === item.id);
            if (!product) return;

            const row = document.createElement('div');
            row.className = 'cart-page-item-row';
            row.innerHTML = `
                <div class="cart-page-item-thumb">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="cart-page-item-body">
                    <div class="cart-page-item-top">
                        <div>
                            <h3 class="cart-page-item-name">${product.name}</h3>
                            <div class="cart-page-item-meta">${product.category} &bull; Signature Piece</div>
                        </div>
                        <button type="button" class="btn-remove-page-item" data-id="${product.id}" aria-label="Remove item">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div class="cart-page-item-bottom">
                        <div class="cart-page-qty-box">
                            <button type="button" class="cart-page-qty-btn btn-page-minus" data-id="${product.id}">–</button>
                            <span class="cart-page-qty-num">${item.quantity}</span>
                            <button type="button" class="cart-page-qty-btn btn-page-plus" data-id="${product.id}">+</button>
                        </div>
                        <span class="cart-page-item-price">$${(product.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            `;

            row.querySelector('.btn-page-minus').addEventListener('click', () => updateQuantity(product.id, -1));
            row.querySelector('.btn-page-plus').addEventListener('click', () => updateQuantity(product.id, 1));
            row.querySelector('.btn-remove-page-item').addEventListener('click', () => removeFromCart(product.id));

            fragment.appendChild(row);
        });

        elements.cartPageItemsList.appendChild(fragment);
    }

    // Order Summary Updates
    if (elements.summarySubtotalVal) elements.summarySubtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.summaryShippingVal) elements.summaryShippingVal.textContent = shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`;
    if (elements.summaryTotalPriceVal) elements.summaryTotalPriceVal.textContent = `$${total.toFixed(2)}`;

    if (elements.summaryDiscountLine) {
        if (appState.discountRate > 0) {
            elements.summaryDiscountLine.style.display = 'flex';
            if (elements.summaryDiscountVal) elements.summaryDiscountVal.textContent = `-$${discountAmount.toFixed(2)}`;
            if (elements.appliedDiscountRow) elements.appliedDiscountRow.style.display = 'flex';
            if (elements.appliedDiscountCodeName) elements.appliedDiscountCodeName.textContent = appState.discountCode;
        } else {
            elements.summaryDiscountLine.style.display = 'none';
            if (elements.appliedDiscountRow) elements.appliedDiscountRow.style.display = 'none';
        }
    }
}

function showCartView() {
    toggleCartDrawer(false);
    [elements.heroSection, elements.shippingBar, elements.categoriesSection, elements.newArrivalsSection, elements.trendingSection].forEach(sec => {
        if (sec) sec.style.display = 'none';
    });
    if (elements.cartPageSection) elements.cartPageSection.style.display = 'block';
    renderCartPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCatalogView(targetAnchor = null) {
    if (elements.cartPageSection) elements.cartPageSection.style.display = 'none';
    [elements.heroSection, elements.shippingBar, elements.categoriesSection, elements.newArrivalsSection, elements.trendingSection].forEach(sec => {
        if (sec) sec.style.display = '';
    });

    if (targetAnchor) {
        const target = document.querySelector(targetAnchor);
        if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 50);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// =============================================================================
// 7. TOAST NOTIFICATIONS
// =============================================================================
function showToast(message, type = 'success') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-custom ${type === 'info' ? 'toast-info' : ''}`;
    const icon = type === 'info' ? 'bi-info-circle' : 'bi-check-circle-fill';

    toast.innerHTML = `<i class="bi ${icon}"></i> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 320);
    }, 2800);
}

// =============================================================================
// 8. ATELIER ACCOUNT AUTHENTICATION MODAL CONTROLLER
// =============================================================================
function initAtelierAuth() {
    const STORAGE_KEY = 'atelier_auth_user';
    const legacyStorageKey = 'shopnest_auth_user';
    const modalBackdrop = document.getElementById('snAuthModal');
    const modalCloseBtn = document.getElementById('snModalCloseBtn');
    const accountBtn = document.getElementById('accountBtn');
    const tabSignIn = document.getElementById('snTabSignIn');
    const tabRegister = document.getElementById('snTabRegister');
    const modalSubtitle = document.getElementById('snModalSubtitle');
    const authForm = document.getElementById('snAuthForm');
    const formAlert = document.getElementById('snFormAlert');
    const nameRow = document.getElementById('snNameRow');
    const firstNameInput = document.getElementById('snFirstNameInput');
    const lastNameInput = document.getElementById('snLastNameInput');
    const emailInput = document.getElementById('snEmailInput');
    const emailLabel = document.getElementById('snEmailLabel');
    const passwordInput = document.getElementById('snPasswordInput');
    const passwordLabel = document.getElementById('snPasswordLabel');
    const formControlsRow = document.getElementById('snFormControlsRow');
    const registerCheckboxes = document.getElementById('snRegisterCheckboxes');
    const submitBtn = document.getElementById('snSubmitBtn');
    const googleBtn = document.getElementById('snGoogleBtn');
    const forgotPwdBtn = document.getElementById('snForgotPwdBtn');
    const agreeTermsCheckbox = document.getElementById('snAgreeTerms');

    let currentMode = 'signin';

    function openModal() {
        if (!modalBackdrop) return;
        setAuthMode('signin');
        modalBackdrop.classList.add('sn-modal-open');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        clearFeedback();
        setTimeout(() => {
            if (emailInput) emailInput.focus();
        }, 150);
    }

    function closeModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('sn-modal-open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        clearFeedback();
        if (authForm) authForm.reset();
    }

    function setAuthMode(mode) {
        currentMode = mode;
        clearFeedback();
        if (authForm) authForm.reset();

        if (mode === 'signin') {
            tabSignIn.classList.add('active');
            tabSignIn.setAttribute('aria-selected', 'true');
            tabRegister.classList.remove('active');
            tabRegister.setAttribute('aria-selected', 'false');
            modalSubtitle.textContent = 'Sign in to your account';
            authForm.classList.remove('sn-mode-register');
            if (nameRow) nameRow.style.setProperty('display', 'none', 'important');
            if (formControlsRow) formControlsRow.style.setProperty('display', 'flex', 'important');
            if (registerCheckboxes) registerCheckboxes.style.setProperty('display', 'none', 'important');
            submitBtn.querySelector('.sn-btn-text').textContent = 'SIGN IN';
            emailLabel.style.display = 'block';
            passwordLabel.style.display = 'block';
            emailInput.placeholder = 'your@email.com';
            passwordInput.placeholder = '••••••••';
            if (firstNameInput) firstNameInput.required = false;
            if (lastNameInput) lastNameInput.required = false;
            if (agreeTermsCheckbox) agreeTermsCheckbox.required = false;
        } else {
            tabRegister.classList.add('active');
            tabRegister.setAttribute('aria-selected', 'true');
            tabSignIn.classList.remove('active');
            tabSignIn.setAttribute('aria-selected', 'false');
            modalSubtitle.textContent = 'Create your account';
            authForm.classList.add('sn-mode-register');
            if (nameRow) nameRow.style.setProperty('display', 'flex', 'important');
            if (formControlsRow) formControlsRow.style.setProperty('display', 'none', 'important');
            if (registerCheckboxes) registerCheckboxes.style.setProperty('display', 'flex', 'important');
            submitBtn.querySelector('.sn-btn-text').textContent = 'CREATE ACCOUNT';
            emailLabel.style.display = 'none';
            passwordLabel.style.display = 'none';
            emailInput.placeholder = 'Email Address *';
            passwordInput.placeholder = 'Create Password *';
            if (firstNameInput) firstNameInput.required = true;
            if (lastNameInput) lastNameInput.required = true;
            if (agreeTermsCheckbox) agreeTermsCheckbox.required = true;
        }
    }

    function showFeedback(message, type = 'error') {
        if (!formAlert) return;
        formAlert.textContent = message;
        formAlert.className = `sn-form-alert sn-alert-${type}`;
    }

    function clearFeedback() {
        if (!formAlert) return;
        formAlert.textContent = '';
        formAlert.className = 'sn-form-alert';
        if (authForm) {
            authForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        }
    }

    function handleAuthSubmit(e) {
        e.preventDefault();
        clearFeedback();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (currentMode === 'signin') {
            if (!email) {
                showFeedback('Please enter your email address.', 'error');
                emailInput.classList.add('is-invalid');
                emailInput.focus();
                return;
            }
            if (!emailRegex.test(email)) {
                showFeedback('Please enter a valid email address.', 'error');
                emailInput.classList.add('is-invalid');
                emailInput.focus();
                return;
            }
            if (!password) {
                showFeedback('Please enter your password.', 'error');
                passwordInput.classList.add('is-invalid');
                passwordInput.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.querySelector('.sn-btn-text').textContent = 'AUTHENTICATING...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('.sn-btn-text').textContent = 'SIGN IN';
                const user = { email, loggedInAt: new Date().toISOString() };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                showFeedback('Welcome back to ATELIER.', 'success');
                showToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
                setTimeout(closeModal, 1000);
            }, 600);

        } else {
            const firstName = firstNameInput.value.trim();
            const lastName = lastNameInput.value.trim();

            if (!firstName) {
                showFeedback('Please enter your first name.', 'error');
                firstNameInput.classList.add('is-invalid');
                firstNameInput.focus();
                return;
            }
            if (!lastName) {
                showFeedback('Please enter your last name.', 'error');
                lastNameInput.classList.add('is-invalid');
                lastNameInput.focus();
                return;
            }
            if (!email || !emailRegex.test(email)) {
                showFeedback('Please enter a valid email address.', 'error');
                emailInput.classList.add('is-invalid');
                emailInput.focus();
                return;
            }
            if (!password || password.length < 6) {
                showFeedback('Password must be at least 6 characters.', 'error');
                passwordInput.classList.add('is-invalid');
                passwordInput.focus();
                return;
            }
            if (agreeTermsCheckbox && !agreeTermsCheckbox.checked) {
                showFeedback('You must agree to the Terms and Conditions.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.querySelector('.sn-btn-text').textContent = 'CREATING ACCOUNT...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector('.sn-btn-text').textContent = 'CREATE ACCOUNT';
                const user = { firstName, lastName, email, registeredAt: new Date().toISOString() };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                showFeedback('Your ATELIER account has been created.', 'success');
                showToast(`Welcome to ATELIER, ${firstName}!`, 'success');
                setTimeout(closeModal, 1100);
            }, 700);
        }
    }

    if (accountBtn) accountBtn.addEventListener('click', e => { e.preventDefault(); openModal(); });
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', e => {
            if (e.target === modalBackdrop) closeModal();
        });
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('sn-modal-open')) closeModal();
    });

    if (tabSignIn) tabSignIn.addEventListener('click', () => setAuthMode('signin'));
    if (tabRegister) tabRegister.addEventListener('click', () => setAuthMode('register'));
    if (authForm) authForm.addEventListener('submit', handleAuthSubmit);

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showFeedback('Connecting to Google...', 'success');
            setTimeout(() => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ email: 'client@atelier.luxury', provider: 'google' }));
                showFeedback('Signed in with Google successfully.', 'success');
                showToast('Signed in with Google.', 'success');
                setTimeout(closeModal, 1000);
            }, 600);
        });
    }

    if (forgotPwdBtn) {
        forgotPwdBtn.addEventListener('click', e => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (!email) {
                showFeedback('Enter your email to receive reset instructions.', 'error');
                emailInput.focus();
            } else {
                showFeedback(`Password reset instructions dispatched to ${email}.`, 'success');
            }
        });
    }
}

// =============================================================================
// 9. EVENT LISTENERS INITIALIZATION
// =============================================================================
function setupEventListeners() {
    // Search
    if (elements.liveSearchInput) elements.liveSearchInput.addEventListener('input', handleSearchInput);
    if (elements.clearSearchBtn) {
        elements.clearSearchBtn.addEventListener('click', () => {
            elements.liveSearchInput.value = '';
            elements.clearSearchBtn.style.display = 'none';
            appState.searchQuery = '';
            applyFilters();
            elements.liveSearchInput.focus();
        });
    }

    // Category Buttons
    elements.categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => handleCategoryClick(btn.getAttribute('data-category')));
    });

    // Reset & View All
    if (elements.btnResetFilters) elements.btnResetFilters.addEventListener('click', resetAllFilters);
    if (elements.btnViewAll) {
        elements.btnViewAll.addEventListener('click', e => {
            e.preventDefault();
            resetAllFilters();
            showCatalogView('#new-arrivals');
        });
    }

    // Category Card Links
    document.querySelectorAll('[data-category-filter]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            const cat = el.getAttribute('data-category-filter') || 'Clothing';
            showCatalogView('#new-arrivals');
            handleCategoryClick(cat);
        });
    });

    // Navigation Search Icon
    if (elements.navSearchIcon) {
        elements.navSearchIcon.addEventListener('click', e => {
            e.preventDefault();
            showCatalogView('#new-arrivals');
            setTimeout(() => {
                if (elements.liveSearchInput) elements.liveSearchInput.focus();
            }, 200);
        });
    }

    // Cart Trigger Buttons -> Open Cart Page View
    elements.cartTriggerBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            showCartView();
        });
    });

    // Cart Drawer Controls
    if (elements.btnCloseCart) elements.btnCloseCart.addEventListener('click', () => toggleCartDrawer(false));
    if (elements.cartBackdrop) elements.cartBackdrop.addEventListener('click', () => toggleCartDrawer(false));
    if (elements.btnCartShop) {
        elements.btnCartShop.addEventListener('click', () => {
            toggleCartDrawer(false);
            showCatalogView('#new-arrivals');
        });
    }
    if (elements.btnClearCart) elements.btnClearCart.addEventListener('click', clearCart);
    if (elements.btnCheckout) {
        elements.btnCheckout.addEventListener('click', () => {
            showCartView();
        });
    }

    // Cart Page Navigation & Promo Code
    if (elements.btnContinueShopping) {
        elements.btnContinueShopping.addEventListener('click', e => {
            e.preventDefault();
            showCatalogView('#new-arrivals');
        });
    }
    if (elements.btnCartPageExplore) {
        elements.btnCartPageExplore.addEventListener('click', e => {
            e.preventDefault();
            showCatalogView('#new-arrivals');
        });
    }

    // Promo Code Handler
    if (elements.btnApplyCartDiscount) {
        elements.btnApplyCartDiscount.addEventListener('click', () => {
            const code = elements.cartDiscountInput ? elements.cartDiscountInput.value.trim().toUpperCase() : '';
            if (code === 'LUXE10' || code === 'ATELIER10') {
                appState.discountRate = 0.10;
                appState.discountCode = code;
                if (elements.discountFeedbackMsg) {
                    elements.discountFeedbackMsg.className = 'discount-feedback-msg success';
                    elements.discountFeedbackMsg.textContent = `${code} applied (10% discount).`;
                }
                renderCartPage();
            } else if (!code) {
                if (elements.discountFeedbackMsg) {
                    elements.discountFeedbackMsg.className = 'discount-feedback-msg error';
                    elements.discountFeedbackMsg.textContent = 'Please enter a discount code.';
                }
            } else {
                if (elements.discountFeedbackMsg) {
                    elements.discountFeedbackMsg.className = 'discount-feedback-msg error';
                    elements.discountFeedbackMsg.textContent = 'Invalid promo code. Try LUXE10 or ATELIER10.';
                }
            }
        });
    }

    if (elements.btnRemoveCartDiscount) {
        elements.btnRemoveCartDiscount.addEventListener('click', () => {
            appState.discountRate = 0;
            appState.discountCode = '';
            if (elements.cartDiscountInput) elements.cartDiscountInput.value = '';
            if (elements.discountFeedbackMsg) {
                elements.discountFeedbackMsg.className = 'discount-feedback-msg';
                elements.discountFeedbackMsg.textContent = '';
            }
            renderCartPage();
            showToast('Discount removed.', 'info');
        });
    }

    if (elements.btnPageCheckout) {
        elements.btnPageCheckout.addEventListener('click', () => {
            const { total } = calculateTotals();
            showToast(`Proceeding to checkout with total $${total.toFixed(2)}.`, 'success');
        });
    }

    // Global navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#cart') return;
            if (href === '#' || href === '#forgot-password' || href === '#terms' || href === '#privacy') return;

            if (elements.cartPageSection && elements.cartPageSection.style.display !== 'none') {
                e.preventDefault();
                showCatalogView(href);
            }
        });
    });
}

// =============================================================================
// 10. DOM READY INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
    renderProducts(appState.products);
    updateCartUI();
    setupEventListeners();
    initAtelierAuth();
});
