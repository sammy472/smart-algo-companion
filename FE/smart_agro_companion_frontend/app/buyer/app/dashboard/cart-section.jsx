import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert 
} from 'react-native';
import { 
  Ionicons, 
  Entypo 
} from '@expo/vector-icons';

const initialCart = [
  {
    id: 1,
    name: 'Tomatoes',
    farmer: 'Green Valley Farms',
    location: 'Marrakech',
    qty: '2kg',
    price: 3.5,
    img: 'https://via.placeholder.com/60',
  },
  {
    id: 2,
    name: 'Carrots',
    farmer: 'SunFresh Organics',
    location: 'Agadir',
    qty: '1kg',
    price: 2.0,
    img: 'https://via.placeholder.com/60',
  },
];

const CartSection = () => {
  const [cartItems, setCartItems] = useState(initialCart);

  const handleRemove = (id) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setCartItems(cartItems.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="cart-outline" size={22} color="#007AFF" />
        <Text style={styles.sectionTitle}>Your Cart</Text>
      </View>

      {cartItems.length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center', marginVertical: 20 }}>
          Your cart is empty.
        </Text>
      ) : (
        cartItems.map((item) => (
          <View key={item.id} style={styles.cartRow}>
            <Image source={{ uri: item.img }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.farmerName}>{item.farmer}</Text>
              <View style={styles.locationRow}>
                <Entypo name="location-pin" size={14} color="#888" />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
              <Text style={styles.itemQty}>{item.qty}</Text>
            </View>
            <View style={styles.rightSide}>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Ionicons name="close-circle" size={22} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {cartItems.length > 0 && (
        <>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}
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
  cartRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  farmerName: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 2,
  },
  itemQty: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  itemPrice: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  rightSide: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CartSection;
