import { eq, and, desc } from 'drizzle-orm';
import db from '../database/client.js';
import { notifications } from '../database/schema.js';

// Get notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const { userId, role } = req.query; // role: 'farmer' or 'buyer'
    
    let userNotifications;
    if (role === 'farmer') {
      userNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.farmerId, parseInt(userId)))
        .orderBy(desc(notifications.createdAt));
    } else {
      userNotifications = await db.select()
        .from(notifications)
        .where(eq(notifications.buyerId, parseInt(userId)))
        .orderBy(desc(notifications.createdAt));
    }
    
    res.status(200).json(userNotifications);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, parseInt(id)));
    
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Mark notification as read error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    if (role === 'farmer') {
      await db.update(notifications)
        .set({ read: true })
        .where(eq(notifications.farmerId, parseInt(userId)));
    } else {
      await db.update(notifications)
        .set({ read: true })
        .where(eq(notifications.buyerId, parseInt(userId)));
    }
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all notifications as read error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.delete(notifications)
      .where(eq(notifications.id, parseInt(id)));
    
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('Delete notification error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const { userId, role } = req.query;
    
    let unreadNotifications;
    if (role === 'farmer') {
      unreadNotifications = await db.select()
        .from(notifications)
        .where(and(
          eq(notifications.farmerId, parseInt(userId)),
          eq(notifications.read, false)
        ));
    } else {
      unreadNotifications = await db.select()
        .from(notifications)
        .where(and(
          eq(notifications.buyerId, parseInt(userId)),
          eq(notifications.read, false)
        ));
    }
    
    res.status(200).json({ count: unreadNotifications.length });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ error: err.message });
  }
};

