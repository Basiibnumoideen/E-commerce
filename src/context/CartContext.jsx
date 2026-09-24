import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const FREE_SHIPPING_THRESHOLD = 300;
export const TAX_RATE = 0.085; // 8.5% estimated tax

export function CartProvider({ children }) {
  // Load initial cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('atelier_react_cart') || 
                    localStorage.getItem('atelier_cart_items') || 
                    localStorage.getItem('shopnest_cart_items');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    }
    return [];
  });

  // Discount / Promo Code State
  const [discountCode, setDiscountCode] = useState(() => {
    return localStorage.getItem('atelier_discount_code') || '';
  });
  const [discountRate, setDiscountRate] = useState(() => {
    const rate = localStorage.getItem('atelier_discount_rate');
    return rate ? parseFloat(rate) : 0;
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('atelier_react_cart', JSON.stringify(cart));
      localStorage.setItem('atelier_cart_items', JSON.stringify(cart)); // compatibility
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [cart]);

  // Sync discount state
  useEffect(() => {
    if (discountCode) {
      localStorage.setItem('atelier_discount_code', discountCode);
      localStorage.setItem('atelier_discount_rate', discountRate.toString());
    } else {
      localStorage.removeItem('atelier_discount_code');
      localStorage.removeItem('atelier_discount_rate');
    }
  }, [discountCode, discountRate]);

  // Sync wishlist
  useEffect(() => {
    try {
      localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [wishlist]);

  // Toast trigger helper
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(current => (current && current.message === message ? null : current));
    }, 3200);
  };

  const closeToast = () => setToast(null);

  // Add product to cart with optional color and size
  const addToCart = (product, quantity = 1, options = {}) => {
    const selectedColor = options.color || (product.colors && product.colors[0]?.name) || 'Default';
    const selectedSize = options.size || (product.sizes && product.sizes[0]?.size) || 'Standard';

    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (itemIndex > -1) {
        const updated = [...prevCart];
        updated[itemIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            imageUrl: product.imageUrl,
            selectedColor,
            selectedSize,
            quantity
          }
        ];
      }
    });

    showToast(`Added "${product.name}" (${selectedSize}) to your bag.`, 'success');
  };

  // Update item quantity (+/- delta)
  const updateQuantity = (itemId, delta, selectedSize = null, selectedColor = null) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          const matches =
            item.id === itemId &&
            (selectedSize === null || item.selectedSize === selectedSize) &&
            (selectedColor === null || item.selectedColor === selectedColor);

          if (matches) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Remove specific item from cart
  const removeFromCart = (itemId, selectedSize = null, selectedColor = null) => {
    const removedItem = cart.find(
      item =>
        item.id === itemId &&
        (selectedSize === null || item.selectedSize === selectedSize) &&
        (selectedColor === null || item.selectedColor === selectedColor)
    );

    setCart(prevCart =>
      prevCart.filter(
        item =>
          !(
            item.id === itemId &&
            (selectedSize === null || item.selectedSize === selectedSize) &&
            (selectedColor === null || item.selectedColor === selectedColor)
          )
      )
    );

    if (removedItem) {
      showToast(`Removed "${removedItem.name}" from shopping bag.`, 'info');
    }
  };

  // Clear entire cart
  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    setDiscountRate(0);
    setDiscountCode('');
    showToast('Shopping bag cleared.', 'info');
  };

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Item removed from wishlist.', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Item saved to your wishlist.', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Apply promo code (e.g. LUXE10 or ATELIER10 for 10% off)
  const applyDiscount = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'LUXE10' || cleanCode === 'ATELIER10') {
      setDiscountRate(0.10);
      setDiscountCode(cleanCode);
      showToast(`Promo code "${cleanCode}" applied (10% discount).`, 'success');
      return { success: true, message: `10% discount applied with ${cleanCode}!` };
    }
    if (!cleanCode) {
      return { success: false, message: 'Please enter a valid discount code.' };
    }
    return { success: false, message: 'Invalid code. Try LUXE10 or ATELIER10.' };
  };

  const removeDiscount = () => {
    setDiscountRate(0);
    setDiscountCode('');
    showToast('Discount removed.', 'info');
  };

  // Compute calculated financial totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount = subtotal * discountRate;
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 25;
  const taxEstimate = discountedSubtotal * TAX_RATE;
  const total = discountedSubtotal + shipping + (subtotal > 0 ? taxEstimate : 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    discountCode,
    discountRate,
    discountAmount,
    discountedSubtotal,
    shipping,
    taxEstimate,
    total,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    applyDiscount,
    removeDiscount,
    wishlist,
    toggleWishlist,
    isWishlisted,
    toast,
    showToast,
    closeToast
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
