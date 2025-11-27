import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { 
  Ionicons, 
  Entypo, 
  MaterialCommunityIcons } from '@expo/vector-icons';
import {PaymentCheckout} from '@/src/features/buyer/components/payment-component'; // Importing the PaymentCheckout component
import { SafeAreaView } from 'react-native-safe-area-context';

//AnimatedBox component for smooth transitions of the checkout section
const AnimatedBox = ({ visible = false, children }) => {
  const opacity = useSharedValue(visible ? 1 : 0);
  const translateY = useSharedValue(visible ? 0 : 20);
  const scale = useSharedValue(visible ? 1 : 0.8);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(visible ? 0 : 20, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
    scale.value = withTiming(visible ? 1 : 0.8, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.box, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const initialCart = [
  {
    id: 1,
    name: 'Tomatoes',
    farmer: 'Green Valley Farms',
    location: 'Marrakech',
    qty: '2kg',
    price: 3.5,
    img: 'https://picsum.photos/seed/tomatoes/100',
  },
  {
    id: 2,
    name: 'Carrots',
    farmer: 'SunFresh Organics',
    location: 'Agadir',
    qty: '1kg',
    price: 2.0,
    img: 'https://picsum.photos/seed/carrots1/100',
  },
  {
    id: 3,
    name: 'Onions',
    farmer: 'AgriLand Co.',
    location: 'Casablanca',
    qty: '3kg',
    price: 4.5,
    img: 'https://picsum.photos/seed/onions/100',
  },
  {
    id: 4,
    name: 'Lettuce',
    farmer: 'FreshLeaf',
    location: 'Rabat',
    qty: '1pc',
    price: 1.8,
    img: 'https://picsum.photos/seed/lettuce/100',
  },
];

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price, 0);
};

const CartSectionScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);

  const handleRemove = (id) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setCartItems((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  useEffect(() => {
    // Simulate fetching cart items from an API. API calls would typically be done here.
    // For this example, we will just use the initialCart defined above.
    setCartItems(initialCart);

  }, []);

  const handlePayment = (paymentDetails) => {
    // This function would handle the payment logic.
    // For this example, we'll just log the payment details.
    console.log('Payment Details:', paymentDetails);  
    Alert.alert('Payment Successful', 'Your payment has been processed successfully.');
    setCartItems([]); // Clear cart after payment
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="cart" size={22} color="#007AFF" />
        <Text style={styles.sectionTitle}>Shopping Cart</Text>
      </View>

      {!isCheckoutVisible && (
      <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.img }} style={styles.image} />

              <View style={styles.details}>
                <View style={styles.rowBetween}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                </View>

                <Text style={styles.farmer}>{item.farmer}</Text>

                <View style={styles.metaRow}>
                  <View style={styles.meta}>
                    <Entypo name="location-pin" size={14} color="#666" />
                    <Text style={styles.metaText}>{item.location}</Text>
                  </View>
                  <View style={styles.meta}>
                    <MaterialCommunityIcons
                      name="weight-kilogram"
                      size={14}
                      color="#666"
                    />
                    <Text style={styles.metaText}>{item.qty}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemove(item.id)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>)}

      {cartItems.length > 0 && !isCheckoutVisible && (
        <>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${calculateTotal(cartItems).toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={() => setIsCheckoutVisible(!isCheckoutVisible)}>
            <Ionicons name="cash-outline" size={20} color="#fff" />
            <Text style={styles.checkoutText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </>
      )}
      
      {isCheckoutVisible && <AnimatedBox visible={isCheckoutVisible}>
        <PaymentCheckout onPayment={handlePayment}/>
      </AnimatedBox>}
      {isCheckoutVisible && ( 
      <TouchableOpacity onPress={() => setIsCheckoutVisible(!isCheckoutVisible)}>
        <Text style={{ color: '#392867', textAlign: 'center', marginTop: 10,fontSize: 20, fontWeight: 'bold' }}>
          Hide Payment
        </Text>
      </TouchableOpacity>)}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
    paddingVertical: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    backgroundColor: '#007AFF',
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  farmer: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#444',
  },
  removeBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  removeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF3B30',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#392867',
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  box: {
    backgroundColor: '#392867',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  }
});

export default CartSectionScreen;
