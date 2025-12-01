import { eq, and } from 'drizzle-orm';
import db from '../database/client.js';
import { carts, products } from '../database/schema.js';

// Get cart items for a buyer
export const getCartItems = async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    const cartItems = await db.select({
      cartId: carts.id,
      productId: carts.productId,
      quantity: carts.quantity,
      product: products,
    })
      .from(carts)
      .innerJoin(products, eq(carts.productId, products.id))
      .where(eq(carts.buyerId, parseInt(buyerId)));
    
    res.status(200).json(cartItems);
  } catch (err) {
    console.error('Get cart items error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, buyerId, quantity } = req.body;
    
    // Check if item already in cart
    const existingItem = await db.select()
      .from(carts)
      .where(and(
        eq(carts.productId, parseInt(productId)),
        eq(carts.buyerId, parseInt(buyerId))
      ));
    
    if (existingItem.length > 0) {
      // Update quantity
      await db.update(carts)
        .set({ quantity: existingItem[0].quantity + (parseInt(quantity) || 1) })
        .where(eq(carts.id, existingItem[0].id));
      
      return res.status(200).json({ message: 'Cart item quantity updated' });
    }
    
    // Add new item
    const result = await db.insert(carts).values({
      productId: parseInt(productId),
      buyerId: parseInt(buyerId),
      quantity: parseInt(quantity) || 1,
    }).returning();
    
    res.status(201).json({ message: 'Item added to cart', cartItem: result[0] });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (parseInt(quantity) <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }
    
    await db.update(carts)
      .set({ quantity: parseInt(quantity) })
      .where(eq(carts.id, parseInt(id)));
    
    res.status(200).json({ message: 'Cart item quantity updated' });
  } catch (err) {
    console.error('Update cart item quantity error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.delete(carts).where(eq(carts.id, parseInt(id)));
    
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Clear all cart items for a buyer
export const clearCart = async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    await db.delete(carts).where(eq(carts.buyerId, parseInt(buyerId)));
    
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ error: err.message });
  }
};

