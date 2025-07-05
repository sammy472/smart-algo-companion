import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const orders = [
{ 
    id: '1234', 
    status: 'Delivered', 
    date: 'June 25', 
    total: '$34.50' 
},
{ 
    id: '1235', 
    status: 'Pending', 
    date: 'June 27', 
    total: '$48.00' 
},
{ 
    id: '1236', 
    status: 'Cancelled', 
    date: 'June 28', 
    total: '$23.00' 
},
];

const getStatusStyle = (status) => {
  switch (status) {
    case 'Delivered':
      return { backgroundColor: '#4CAF50' };
    case 'Pending':
      return { backgroundColor: '#FFA000' };
    case 'Cancelled':
      return { backgroundColor: '#F44336' };
    default:
      return { backgroundColor: '#9E9E9E' };
  }
};

const OrderSummary = () => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="receipt" size={22} color="#007AFF" />
        <Text style={styles.sectionTitle}>Recent Orders</Text>
      </View>

      {orders.map((order) => (
        <View key={order.id} style={styles.orderRow}>
          <View>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={styles.rightSide}>
            <Text style={styles.orderTotal}>{order.total}</Text>
            <Text style={[styles.statusBadge, getStatusStyle(order.status)]}>
              {order.status}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.link}>
        <Text style={styles.linkText}>See all orders</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusBadge: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default OrderSummary;