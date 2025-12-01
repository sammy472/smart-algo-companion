import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Ionicons, 
  Entypo, 
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { useApp } from '@/src/hooks/useApp';
import api from '@/src/services/api';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const CartSectionScreen = () => {
  const { cart, user, userType, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCartItems();
  }, [cart]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      
      // Load from context (which syncs with AsyncStorage)
      if (cart && cart.length > 0) {
        setCartItems(cart);
      } else if (user && userType === 'buyer') {
        // Try to load from backend
        try {
          const backendCart = await api.getCartItems(user.id);
          setCartItems(backendCart.map(item => ({
            id: item.product.id,
            ...item.product,
            quantity: item.quantity,
            cartId: item.cartId,
            farmerId: item.product.farmerId,
          })));
        } catch (error) {
          console.error('Failed to load from backend:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = async (item) => {
    const newQuantity = (item.quantity || 1) + 1;
    await updateCartQuantity(item.id, newQuantity, user?.id);
    loadCartItems();
  };

  const handleDecreaseQuantity = async (item) => {
    const currentQuantity = item.quantity || 1;
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      await updateCartQuantity(item.id, newQuantity, user?.id);
      loadCartItems();
    }
  };

  const handleRemoveItem = async (item) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${item.name} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeFromCart(item.id, user?.id);
            loadCartItems();
          },
        },
      ]
    );
  };

  const handleOrderItem = async (item) => {
    if (!user || userType !== 'buyer') {
      Alert.alert('Login Required', 'Please login to place an order');
      router.push('/buyer/authentication/login');
      return;
    }

    Alert.alert(
      'Place Order',
      `Place order for ${item.quantity || 1} x ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Order',
          onPress: async () => {
            try {
              setLoading(true);
              await api.createOrder({
                productId: item.id,
                buyerId: user.id,
                quantity: item.quantity || 1,
                price: item.price,
              });

              // Remove from cart after order
              await removeFromCart(item.id, user.id);
              
              // Remove from AsyncStorage
              try {
                const cartData = await AsyncStorage.getItem(`cart_${user.id}`);
                if (cartData) {
                  const cartItems = JSON.parse(cartData).filter(cartItem => cartItem.id !== item.id);
                  await AsyncStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
                }
              } catch (error) {
                console.error('Failed to update AsyncStorage:', error);
              }

              Alert.alert('Success', 'Order placed successfully!');
              loadCartItems();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to place order');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleContactSeller = (item) => {
    if (!user || userType !== 'buyer') {
      Alert.alert('Login Required', 'Please login to contact seller');
      router.push('/buyer/authentication/login');
      return;
    }

    // Navigate to chat screen with farmer
    router.push({
      pathname: '/buyer/dashboard/chat',
      params: {
        farmerId: item.farmerId,
        productId: item.id,
        productName: item.name,
      },
    });
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            if (user && userType === 'buyer') {
              await clearCart(user.id);
            }
            setCartItems([]);
          },
        },
      ]
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#392867" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="cart" size={22} color="#392867" />
          <Text style={styles.sectionTitle}>Shopping Cart</Text>
          {cartItems.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
              <MaterialIcons name="clear-all" size={20} color="#FF3B30" />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => router.push('/buyer/marketplace')}
              >
                <Text style={styles.browseButtonText}>Browse Products</Text>
              </TouchableOpacity>
            </View>
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image 
                  source={{ uri: Array.isArray(item.avatar) ? item.avatar[0] : item.avatar || 'https://via.placeholder.com/100' }} 
                  style={styles.image} 
                />

                <View style={styles.details}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.price}>GHS {(parseFloat(item.price) || 0).toFixed(2)}</Text>
                  </View>

                  <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleDecreaseQuantity(item)}
                      >
                        <Ionicons name="remove" size={18} color="#392867" />
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>{item.quantity || 1}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleIncreaseQuantity(item)}
                      >
                        <Ionicons name="add" size={18} color="#392867" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.meta}>
                      <Entypo name="location-pin" size={14} color="#666" />
                      <Text style={styles.metaText}>{item.productLocation || 'N/A'}</Text>
                    </View>
                    <View style={styles.meta}>
                      <MaterialCommunityIcons name="weight-kilogram" size={14} color="#666" />
                      <Text style={styles.metaText}>{item.quantity || 1} kg</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.orderButton]}
                      onPress={() => handleOrderItem(item)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                      <Text style={styles.orderButtonText}>Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.contactButton]}
                      onPress={() => handleContactSeller(item)}
                    >
                      <Ionicons name="chatbubble-outline" size={16} color="#392867" />
                      <Text style={styles.contactButtonText}>Contact Seller</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.removeButton]}
                      onPress={() => handleRemoveItem(item)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {cartItems.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>GHS {calculateTotal().toFixed(2)}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    flex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    flex: 1,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearAllText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#392867',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  price: {
    backgroundColor: '#392867',
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 4,
    borderRadius: 4,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  orderButton: {
    backgroundColor: '#392867',
    flex: 1,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: '#f0f0f0',
    flex: 1,
  },
  contactButtonText: {
    color: '#392867',
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#ffe0e0',
    paddingHorizontal: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#392867',
  },
});

export default CartSectionScreen;
