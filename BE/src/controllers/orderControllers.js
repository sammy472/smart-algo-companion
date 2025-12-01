import { eq, and } from 'drizzle-orm';
import db from '../database/client.js';
import { orders, transactions, products, notifications, farmers, buyers } from '../database/schema.js';
import { transporter } from '../config/nodemailer.js';

// Get all orders for a farmer
export const getFarmerOrders = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const allOrders = await db.select()
      .from(orders)
      .where(eq(orders.farmerId, parseInt(farmerId)))
      .orderBy(orders.createdAt);
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders for a buyer
export const getBuyerOrders = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const allOrders = await db.select()
      .from(orders)
      .where(eq(orders.buyerId, parseInt(buyerId)))
      .orderBy(orders.createdAt);
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.select().from(orders).where(eq(orders.id, parseInt(id)));
    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create order (from buyer)
export const createOrder = async (req, res) => {
  try {
    const { productId, buyerId, quantity, price } = req.body;
    
    // Get product details
    const product = await db.select().from(products).where(eq(products.id, parseInt(productId)));
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productData = product[0];
    const farmerId = productData.farmerId;

    // Create order
    const newOrder = await db.insert(orders).values({
      name: productData.name,
      avatar: productData.avatar?.[0] || null,
      price: price || productData.price,
      quantity: parseInt(quantity),
      status: 'pending',
      productId: parseInt(productId),
      farmerId,
      buyerId: parseInt(buyerId),
    }).returning();

    // Update product order count
    await db.update(products)
      .set({ numberOfOrders: (productData.numberOfOrders || 0) + 1 })
      .where(eq(products.id, parseInt(productId)));

    // Create notification for farmer
    await db.insert(notifications).values({
      title: 'New Order Received',
      message: `You have received a new order for ${productData.name}`,
      type: 'order',
      farmerId,
      relatedId: newOrder[0].id,
      relatedType: 'order',
    });

    // Get buyer email for notification
    const buyer = await db.select().from(buyers).where(eq(buyers.id, parseInt(buyerId)));
    if (buyer.length > 0) {
      // Create notification for buyer
      await db.insert(notifications).values({
        title: 'Order Placed',
        message: `Your order for ${productData.name} has been placed successfully`,
        type: 'order',
        buyerId: parseInt(buyerId),
        relatedId: newOrder[0].id,
        relatedType: 'order',
      });

      // Send email to buyer
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: buyer[0].email,
          subject: 'Order Confirmation - Smart Agro Companion',
          html: `
            <h2>Order Confirmation</h2>
            <p>Your order has been placed successfully!</p>
            <p><strong>Product:</strong> ${productData.name}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Price:</strong> GHS ${price || productData.price}</p>
            <p>You will be notified when the farmer responds to your order.</p>
          `,
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }

      // Get farmer email
      const farmer = await db.select().from(farmers).where(eq(farmers.id, farmerId));
      if (farmer.length > 0) {
        // Send email to farmer
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: farmer[0].email,
            subject: 'New Order Received - Smart Agro Companion',
            html: `
              <h2>New Order Received</h2>
              <p>You have received a new order for your product!</p>
              <p><strong>Product:</strong> ${productData.name}</p>
              <p><strong>Quantity:</strong> ${quantity}</p>
              <p><strong>Price:</strong> GHS ${price || productData.price}</p>
              <p>Please review and respond to this order in your dashboard.</p>
            `,
          });
        } catch (emailErr) {
          console.error('Email send error:', emailErr);
        }
      }
    }

    res.status(201).json({ message: 'Order created successfully', order: newOrder[0] });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Accept order (farmer)
export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get order
    const order = await db.select().from(orders).where(eq(orders.id, parseInt(id)));
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = order[0];

    // Update order status
    await db.update(orders)
      .set({ 
        status: 'accepted',
        farmerConfirmed: true 
      })
      .where(eq(orders.id, parseInt(id)));

    // Create transaction (48 hours termination)
    const terminationAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const transaction = await db.insert(transactions).values({
      orderId: parseInt(id),
      status: 'pending',
      terminationAt,
    }).returning();

    // Create notification for buyer
    await db.insert(notifications).values({
      title: 'Order Accepted',
      message: `Your order for ${orderData.name} has been accepted by the farmer`,
      type: 'order',
      buyerId: orderData.buyerId,
      relatedId: parseInt(id),
      relatedType: 'order',
    });

    // Send email to buyer
    const buyer = await db.select().from(buyers).where(eq(buyers.id, orderData.buyerId));
    if (buyer.length > 0) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: buyer[0].email,
          subject: 'Order Accepted - Smart Agro Companion',
          html: `
            <h2>Order Accepted</h2>
            <p>Great news! Your order has been accepted by the farmer.</p>
            <p><strong>Product:</strong> ${orderData.name}</p>
            <p><strong>Quantity:</strong> ${orderData.quantity}</p>
            <p>The transaction will be completed within 48 hours.</p>
          `,
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    res.status(200).json({ 
      message: 'Order accepted successfully', 
      transaction: transaction[0] 
    });
  } catch (err) {
    console.error('Accept order error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Decline order (farmer)
export const declineOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { declineReason } = req.body;
    
    // Get order
    const order = await db.select().from(orders).where(eq(orders.id, parseInt(id)));
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = order[0];

    // Update order status
    await db.update(orders)
      .set({ 
        status: 'declined',
        declineReason: declineReason || 'No reason provided'
      })
      .where(eq(orders.id, parseInt(id)));

    // Create notification for buyer
    await db.insert(notifications).values({
      title: 'Order Declined',
      message: `Your order for ${orderData.name} has been declined. ${declineReason ? `Reason: ${declineReason}` : ''}`,
      type: 'order',
      buyerId: orderData.buyerId,
      relatedId: parseInt(id),
      relatedType: 'order',
    });

    // Send email to buyer
    const buyer = await db.select().from(buyers).where(eq(buyers.id, orderData.buyerId));
    if (buyer.length > 0) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: buyer[0].email,
          subject: 'Order Declined - Smart Agro Companion',
          html: `
            <h2>Order Declined</h2>
            <p>Unfortunately, your order has been declined by the farmer.</p>
            <p><strong>Product:</strong> ${orderData.name}</p>
            ${declineReason ? `<p><strong>Reason:</strong> ${declineReason}</p>` : ''}
          `,
        });
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    res.status(200).json({ message: 'Order declined successfully' });
  } catch (err) {
    console.error('Decline order error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Confirm transaction (both parties)
export const confirmTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { role, userId } = req.body; // role: 'farmer' or 'buyer'

    // Get transaction
    const transaction = await db.select()
      .from(transactions)
      .where(eq(transactions.id, parseInt(transactionId)));
    
    if (transaction.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transactionData = transaction[0];

    // Get order to verify user
    const order = await db.select()
      .from(orders)
      .where(eq(orders.id, transactionData.orderId));
    
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = order[0];

    // Verify user has permission
    if (role === 'farmer' && orderData.farmerId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (role === 'buyer' && orderData.buyerId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update confirmation
    const updateData = role === 'farmer' 
      ? { farmerConfirmed: true }
      : { buyerConfirmed: true };

    await db.update(transactions)
      .set(updateData)
      .where(eq(transactions.id, parseInt(transactionId)));

    // Check if both confirmed
    const updatedTransaction = await db.select()
      .from(transactions)
      .where(eq(transactions.id, parseInt(transactionId)));

    const updated = updatedTransaction[0];
    if (updated.farmerConfirmed && updated.buyerConfirmed) {
      await db.update(transactions)
        .set({ completed: true, status: 'completed' })
        .where(eq(transactions.id, parseInt(transactionId)));

      await db.update(orders)
        .set({ status: 'completed' })
        .where(eq(orders.id, transactionData.orderId));

      // Notify both parties
      await db.insert(notifications).values({
        title: 'Transaction Completed',
        message: `Transaction for order ${orderData.name} has been completed`,
        type: 'order',
        farmerId: orderData.farmerId,
        relatedId: transactionData.orderId,
        relatedType: 'transaction',
      });

      await db.insert(notifications).values({
        title: 'Transaction Completed',
        message: `Transaction for order ${orderData.name} has been completed`,
        type: 'order',
        buyerId: orderData.buyerId,
        relatedId: transactionData.orderId,
        relatedType: 'transaction',
      });
    }

    res.status(200).json({ message: 'Transaction confirmed successfully' });
  } catch (err) {
    console.error('Confirm transaction error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.body;

    // Get order
    const order = await db.select().from(orders).where(eq(orders.id, parseInt(id)));
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderData = order[0];

    // Verify user has permission
    if (role === 'farmer' && orderData.farmerId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (role === 'buyer' && orderData.buyerId !== parseInt(userId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update order status
    await db.update(orders)
      .set({ status: 'cancelled' })
      .where(eq(orders.id, parseInt(id)));

    // Update transaction if exists
    const transaction = await db.select()
      .from(transactions)
      .where(eq(transactions.orderId, parseInt(id)));
    
    if (transaction.length > 0) {
      await db.update(transactions)
        .set({ status: 'cancelled' })
        .where(eq(transactions.orderId, parseInt(id)));
    }

    // Notify both parties
    await db.insert(notifications).values({
      title: 'Order Cancelled',
      message: `Order for ${orderData.name} has been cancelled`,
      type: 'order',
      farmerId: orderData.farmerId,
      relatedId: parseInt(id),
      relatedType: 'order',
    });

    await db.insert(notifications).values({
      title: 'Order Cancelled',
      message: `Order for ${orderData.name} has been cancelled`,
      type: 'order',
      buyerId: orderData.buyerId,
      relatedId: parseInt(id),
      relatedType: 'order',
    });

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({ error: err.message });
  }
};

