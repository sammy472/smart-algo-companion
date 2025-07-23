import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const initialOrders = [
  {
    id: '1234',
    name: 'Organic Tomatoes',
    quantity: 3,
    price: '$34.50',
    status: 'Delivered',
    date: 'June 25',
    farm: 'Green Valley Farm',
    image: 'https://picsum.photos/seed/tomato/80',
  },
  {
    id: '1235',
    name: 'Fresh Carrots',
    quantity: 5,
    price: '$48.00',
    status: 'Pending',
    date: 'June 27',
    farm: 'SunFresh Farm',
    image: 'https://picsum.photos/seed/carrots/80',
  },
  {
    id: '1236',
    name: 'Sweet Potatoes',
    quantity: 2,
    price: '$23.00',
    status: 'Cancelled',
    date: 'June 28',
    farm: 'Palm Roots',
    image: 'https://picsum.photos/seed/potatoes/80',
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
  const [orders, setOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleReorder = (order) => {
    Alert.alert('Reordering', `${order.quantity} x ${order.name} from ${order.farm}`);
    // Add to cart logic here
  };

  const handleCancel = (id) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      {
        text: 'Yes',
        onPress: () =>
          setOrders(prev =>
            prev.map(order =>
              order.id === id ? { ...order, status: 'Cancelled' } : order
            )
          ),
      },
      { text: 'No' },
    ]);
  };

  const handleRemove = (id) => {
    Alert.alert('Remove Order', 'Are you sure you want to remove this order?', [
      {
        text: 'Yes',
        onPress: () => setOrders(prev => prev.filter(order => order.id !== id)),
      },
      { text: 'No' },
    ]);
  };

  const handleViewAllOrders = () => {
    Alert.alert('View All Orders', 'This will navigate to the orders page.');
  }

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  useEffect(() => {
    // Fetch orders from API or database here
    setOrders(initialOrders);
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="receipt" size={22} color="#007AFF" />
        <Text style={styles.sectionTitle}>Recent Orders</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <TouchableOpacity key={order.id} style={styles.card} onPress={() => handleOrderDetails(order)}>
            <Image source={{ uri: order.image }} style={styles.image} />

            <View style={styles.info}>
              <View style={styles.rowBetween}>
                <Text style={styles.productName}>{order.name}</Text>
                <Text style={styles.price}>{order.price}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="pricetag-outline" size={14} color="#666" />
                <Text style={styles.subText}>Qty: {order.quantity} kg</Text>
              </View>

              <View style={styles.row2}>
                <View style={styles.row}>
                  <FontAwesome5 name="tractor" size={13} color="#666" />
                  <Text style={styles.subText}>{order.farm}</Text>
                </View>

                <View style={styles.row}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.subText}>{order.date}</Text>
                </View>
              </View>

              <View style={styles.row2}>
                <View style={[styles.statusBadge, getStatusStyle(order.status)]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>

                {order.status === 'Delivered' && (
                  <TouchableOpacity
                    onPress={() => handleReorder(order)}
                    style={styles.reorderBtn}
                  >
                    <Ionicons name="repeat-outline" size={16} color="#007AFF" />
                    <Text style={styles.reorderText}>Reorder</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'Pending' && (
                  <TouchableOpacity
                    onPress={() => handleCancel(order.id)}
                    style={styles.reorderBtn}
                  >
                    <Ionicons name="close-circle-outline" size={16} color="#FF3B30" />
                    <Text style={[styles.reorderText, { color: '#FF3B30' }]}>Cancel</Text>
                  </TouchableOpacity>
                )}

                {order.status === 'Cancelled' && (
                  <TouchableOpacity
                    onPress={() => handleRemove(order.id)}
                    style={styles.reorderBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color="#444" />
                    <Text style={[styles.reorderText, { color: '#444' }]}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.link} onPress={handleViewAllOrders}>
          <Text style={styles.linkText}>See all orders</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            {selectedOrder && (
              <View>
                <Text style={styles.modalSectionTitle}>
                  Order Details #{selectedOrder.id}
                </Text>
                <Image 
                  source={{ uri: selectedOrder.image }} 
                  style={styles.modalImage}
                />
                <Text 
                  style={styles.modalSectionName}
                >
                  {selectedOrder.name}
                </Text>
                <Text 
                  style={styles.modalSectionOrder}
                >
                  Farm: {selectedOrder.farm}
                </Text>
                <Text 
                  style={styles.modalSectionOrder}
                >
                  Quantity: {selectedOrder.quantity} kg
                </Text>
                <Text 
                  style={styles.modalSectionOrder}
                >
                  Price: {selectedOrder.price}
                </Text>
                <Text 
                  style={styles.modalSectionOrder}
                >
                  Status: {selectedOrder.status}
                </Text>
                <Text 
                  style={styles.modalSectionOrder}
                >
                  Date: {selectedOrder.date}
                </Text>
              </View>
            )}
            <TouchableOpacity  
              onPress={() => setModalVisible(false)} 
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalView:{ 
    width: '90%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 5 
  },
  modalSectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  modalImage: { 
    width: '100%', 
    height: 150, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  modalSectionName: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 5 
  },
  modalSectionOrder: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 5
  },
  modalCloseButton: { 
    alignSelf: 'flex-end',
    padding: 10
  },
  modalCloseButtonText: { 
    color: '#007AFF',
    fontWeight: 'bold'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'wheat',
    borderRadius: 4,
    padding: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    gap: 4,
  },
  subText: {
    fontSize: 12,
    color: '#555',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  reorderBtn: {
    marginTop: 6,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  reorderText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#007AFF',
  },
  link: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default OrderSummary;
