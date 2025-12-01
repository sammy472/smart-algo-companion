import { eq, and, desc, or } from 'drizzle-orm';
import db from '../database/client.js';
import { chats, notifications } from '../database/schema.js';

// Get messages between users
export const getMessages = async (req, res) => {
  try {
    const { farmerId, buyerId, productId } = req.query;
    
    let messages;
    if (productId) {
      messages = await db.select()
        .from(chats)
        .where(and(
          eq(chats.productId, parseInt(productId)),
          and(
            eq(chats.farmerId, parseInt(farmerId)),
            eq(chats.buyerId, parseInt(buyerId))
          )
        ))
        .orderBy(desc(chats.createdAt));
    } else {
      messages = await db.select()
        .from(chats)
        .where(and(
          eq(chats.farmerId, parseInt(farmerId)),
          eq(chats.buyerId, parseInt(buyerId))
        ))
        .orderBy(desc(chats.createdAt));
    }
    
    res.status(200).json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { message, from, to, farmerId, buyerId, productId } = req.body;
    
    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required and cannot be empty' });
    }
    
    if (!farmerId && !buyerId) {
      return res.status(400).json({ error: 'Either farmerId or buyerId is required' });
    }
    
    const newMessage = await db.insert(chats).values({
      message: message.trim(), // Required field, validated above
      from: from || null,
      to: to || null,
      farmerId: farmerId ? parseInt(farmerId) : null,
      buyerId: buyerId ? parseInt(buyerId) : null,
      productId: productId ? parseInt(productId) : null,
      read: false,
    }).returning();
    
    // Create notification for recipient
    const recipientId = from.includes('farmer') ? buyerId : farmerId;
    const recipientRole = from.includes('farmer') ? 'buyer' : 'farmer';
    
    await db.insert(notifications).values({
      title: 'New Message',
      message: `You have a new message from ${from}`,
      type: 'message',
      farmerId: recipientRole === 'farmer' ? parseInt(recipientId) : null,
      buyerId: recipientRole === 'buyer' ? parseInt(recipientId) : null,
      relatedId: newMessage[0].id,
      relatedType: 'message',
    });
    
    res.status(201).json({ message: 'Message sent successfully', chat: newMessage[0] });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { farmerId, buyerId } = req.body;
    
    await db.update(chats)
      .set({ read: true })
      .where(and(
        eq(chats.farmerId, parseInt(farmerId)),
        eq(chats.buyerId, parseInt(buyerId))
      ));
    
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (err) {
    console.error('Mark messages as read error:', err);
    res.status(500).json({ error: err.message });
  }
};

