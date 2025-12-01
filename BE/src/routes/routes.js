import express from 'express';
import { 
  addFarmer, 
  deleteFarmer, 
  modifyFarmer,
  getFarmer,
  getFarmers,
  addBuyer,
  deleteBuyer,
  modifyBuyer,
  getBuyer,
  getBuyers,
  addProduct,
  deleteProduct,
  modifyProduct,
  getProduct,
  getProducts,
  installDevice,
  modifyDevice,
  uninstallDevice,
  getDevice,
  getDevices,
} from '../controllers/controller.js';

import {
  createOrder,
  getOrder,
  getFarmerOrders,
  getBuyerOrders,
  acceptOrder,
  declineOrder,
  confirmTransaction,
  cancelOrder,
} from '../controllers/orderControllers.js';

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notificationControllers.js';

import {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cartControllers.js';

import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteProfile,
} from '../controllers/profileControllers.js';

import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from '../controllers/chatControllers.js';

import {
  detectCropDisease,
  getDetectionHistory,
  getDetection,
} from '../controllers/aiControllers.js';

const router = express.Router();

// Farmer Routes
router.post('/farmers', addFarmer);
router.get('/farmers', getFarmers);
router.get('/farmers/:id', getFarmer);
router.put('/farmers/:id', modifyFarmer);
router.delete('/farmers/:id', deleteFarmer);

// Buyer Routes
router.post('/buyers', addBuyer);
router.get('/buyers', getBuyers);
router.get('/buyers/:id', getBuyer);
router.put('/buyers/:id', modifyBuyer);
router.delete('/buyers/:id', deleteBuyer);

// Product Routes
router.post('/products', addProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.put('/products/:id', modifyProduct);
router.delete('/products/:id', deleteProduct);

// Order Routes
router.post('/orders', createOrder);
router.get('/orders/farmer/:farmerId', getFarmerOrders);
router.get('/orders/buyer/:buyerId', getBuyerOrders);
router.get('/orders/:id', getOrder);
router.post('/orders/:id/accept', acceptOrder);
router.post('/orders/:id/decline', declineOrder);
router.post('/orders/:id/cancel', cancelOrder);

// Transaction Routes
router.post('/transactions/:transactionId/confirm', confirmTransaction);

// Cart Routes
router.get('/carts/:buyerId', getCartItems);
router.post('/carts', addToCart);
router.put('/carts/:id', updateCartItemQuantity);
router.delete('/carts/:id', removeFromCart);
router.delete('/carts/clear/:buyerId', clearCart);

// Notification Routes
router.get('/notifications', getNotifications);
router.get('/notifications/unread-count', getUnreadCount);
router.put('/notifications/:id/read', markNotificationAsRead);
router.put('/notifications/read-all', markAllNotificationsAsRead);
router.delete('/notifications/:id', deleteNotification);

// Profile Routes
router.get('/profile/:role/:userId', getProfile);
router.put('/profile/:role/:userId', updateProfile);
router.put('/profile/:role/:userId/password', updatePassword);
router.delete('/profile/:role/:userId', deleteProfile);

// Chat Routes
router.get('/chats', getMessages);
router.post('/chats', sendMessage);
router.put('/chats/read', markMessagesAsRead);

// AI Crop Detection Routes
router.post('/ai/detect', detectCropDisease);
router.get('/ai/detections/:farmerId', getDetectionHistory);
router.get('/ai/detections/single/:id', getDetection);

// Device Routes
router.post('/devices', installDevice);
router.get('/devices', getDevices);
router.get('/devices/:id', getDevice);
router.put('/devices/:id', modifyDevice);
router.delete('/devices/:id', uninstallDevice);

export default router;
