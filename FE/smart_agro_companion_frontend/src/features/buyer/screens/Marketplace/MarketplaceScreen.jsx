import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useApp } from '@/src/hooks/useApp';
import api from '@/src/services/api';

const allProducts = [
  { id: '1', name: 'Organic Tomatoes', price: 3.5, location: 'Accra', type: 'Vegetable', image: 'https://picsum.photos/seed/tomatoes/400' },
  { id: '2', name: 'Sweet Potatoes', price: 4.2, location: 'Kumasi', type: 'Root', image: 'https://picsum.photos/seed/potatoes/400' },
  { id: '3', name: 'Fresh Lettuce', price: 2.0, location: 'Cape Coast', type: 'Leafy', image: 'https://picsum.photos/seed/lettuce/400' },
  { id: '4', name: 'Green Peppers', price: 2.8, location: 'Tamale', type: 'Vegetable', image: 'https://picsum.photos/seed/peppers/400' },
  { id: '5', name: 'Mangoes', price: 3.0, location: 'Takoradi', type: 'Fruit', image: 'https://picsum.photos/seed/mangoes/400' },
  { id: '6', name: 'Cabbage', price: 2.5, location: 'Accra', type: 'Leafy', image: 'https://picsum.photos/seed/cabbage/400' },
  { id: '7', name: 'Bananas', price: 2.2, location: 'Kumasi', type: 'Fruit', image: 'https://picsum.photos/seed/bananas/400' },
  { id: '8', name: 'Carrots', price: 3.2, location: 'Cape Coast', type: 'Root', image: 'https://picsum.photos/seed/carrots/400' },
  { id: '9', name: 'Spinach', price: 1.8, location: 'Tamale', type: 'Leafy', image: 'https://picsum.photos/seed/spinach/400' },
  { id: '10', name: 'Pineapple', price: 4.5, location: 'Takoradi', type: 'Fruit', image: 'https://picsum.photos/seed/pineapple/400' },
];

const types = ['All', 'Fruit', 'Vegetable', 'Leafy', 'Root'];
const locations = ['All', 'Accra', 'Kumasi', 'Cape Coast', 'Tamale', 'Takoradi'];
const ITEMS_PER_PAGE = 4;

export default function MarketplaceScreen() {
  const { user, userType, addToCart } = useApp();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [page, setPage] = useState(1);
  const [orderQuantity, setOrderQuantity] = useState('1');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    // Type filter: if product has a type field, filter by it; otherwise show when "All" is selected
    const typeMatch = selectedType === 'All' || !product.type || product.type === selectedType;
    const locationMatch = selectedLocation === 'All' || product.productLocation === selectedLocation;
    const priceMatch = maxPrice === '' || parseFloat(product.price) <= parseFloat(maxPrice);
    return typeMatch && locationMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleViewMore = (item) => {
    setModalItem(item);
    setShowModal(true);
  };

  const handleAddToCart = async (product) => {
    if (!user || userType !== 'buyer') {
      Alert.alert('Login Required', 'Please login to add items to cart');
      router.push('/buyer/authentication/login');
      return;
    }

    try {
      await addToCart(product, user.id);
      Alert.alert('Success', 'Product added to cart!');
      setShowModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  const handleOrder = async (product) => {
    if (!user || userType !== 'buyer') {
      Alert.alert('Login Required', 'Please login to place an order');
      router.push('/buyer/authentication/login');
      return;
    }

    Alert.alert(
      'Place Order',
      `Place order for ${orderQuantity} kg of ${product.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Order',
          onPress: async () => {
            try {
              await api.createOrder({
                productId: product.id,
                buyerId: user.id,
                quantity: parseInt(orderQuantity),
                price: product.price,
              });
              Alert.alert('Success', 'Order placed successfully!');
              setShowModal(false);
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to place order');
            }
          },
        },
      ]
    );
  };

  const handleContactSeller = (product) => {
    if (!user || userType !== 'buyer') {
      Alert.alert('Login Required', 'Please login to contact seller');
      router.push('/buyer/authentication/login');
      return;
    }

    router.push({
      pathname: '/buyer/dashboard/chat',
      params: {
        farmerId: product.farmerId,
        productId: product.id,
        productName: product.name,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.heading}>Fresh Marketplace</Text>

        {/* Filters */}
        <View style={styles.filters}>
          <View style={styles.filterRow}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.filterLabel}>Type</Text>
              <Picker selectedValue={selectedType} onValueChange={setSelectedType} style={styles.picker}>
                {types.map((type) => <Picker.Item key={type} label={type} value={type} />)}
              </Picker>
            </View>
            <View style={styles.pickerWrapper}>
              <Text style={styles.filterLabel}>Location</Text>
              <Picker selectedValue={selectedLocation} onValueChange={setSelectedLocation} style={styles.picker}>
                {locations.map((loc) => <Picker.Item key={loc} label={loc} value={loc} />)}
              </Picker>
            </View>
          </View>

          <View style={styles.priceWrapper}>
            <Text style={styles.filterLabel}>Max Price</Text>
            <View style={styles.priceInputContainer}>
              <Ionicons name="pricetag-outline" size={16} color="#555" />
              <TextInput
                placeholder="e.g. 3.50"
                keyboardType="numeric"
                style={styles.priceInput}
                value={maxPrice}
                onChangeText={setMaxPrice}
              />
            </View>
          </View>
        </View>

        {/* Product Grid */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#392867" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={paginatedProducts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const imageUri = Array.isArray(item.avatar) 
                ? item.avatar[0] 
                : item.avatar || 'https://via.placeholder.com/200';
              
              return (
                <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => handleViewMore(item)}>
                  <Image source={{ uri: imageUri }} style={styles.image} />
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status || 'in stock'}</Text>
                  </View>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.price}>GHS {parseFloat(item.price || 0).toFixed(2)} / kg</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.location} numberOfLines={1}>
                      <Ionicons name="location-outline" size={14} color="#777" /> {item.productLocation || 'N/A'}
                    </Text>
                    <TouchableOpacity 
                      style={styles.addCartBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      <Ionicons name="cart-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="basket-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            }
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              disabled={page === 1}
              style={[styles.pageBtn, page === 1 && styles.disabledBtn]}
              onPress={() => setPage(page - 1)}
            >
              <Text style={styles.pageBtnText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>{page} / {totalPages}</Text>
            <TouchableOpacity
              disabled={page === totalPages}
              style={[styles.pageBtn, page === totalPages && styles.disabledBtn]}
              onPress={() => setPage(page + 1)}
            >
              <Text style={styles.pageBtnText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal */}
        <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {modalItem && (
                <>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                  
                  <Image 
                    source={{ 
                      uri: Array.isArray(modalItem.avatar) 
                        ? modalItem.avatar[0] 
                        : modalItem.avatar || 'https://via.placeholder.com/300'
                    }} 
                    style={styles.modalImage} 
                  />
                  <Text style={styles.modalName}>{modalItem.name}</Text>
                  <Text style={styles.modalPrice}>GHS {parseFloat(modalItem.price || 0).toFixed(2)} / kg</Text>
                  <Text style={styles.modalLocation}>
                    <Ionicons name="location-outline" size={16} color="#666" /> {modalItem.productLocation || 'N/A'}
                  </Text>
                  <Text style={styles.modalQuantity}>
                    <Ionicons name="cube-outline" size={16} color="#666" /> Available: {modalItem.quantity || 0} kg
                  </Text>
                  <Text style={styles.modalDelivery}>
                    <Ionicons name="truck-outline" size={16} color="#666" /> {modalItem.deliveryOptions || 'Pick up'}
                  </Text>
                  <Text style={styles.modalStatus}>
                    Status: <Text style={{ fontWeight: 'bold' }}>{modalItem.status || 'in stock'}</Text>
                  </Text>

                  <View style={styles.quantityInput}>
                    <Text style={styles.quantityLabel}>Quantity (kg):</Text>
                    <TextInput
                      style={styles.quantityInputField}
                      value={orderQuantity}
                      onChangeText={setOrderQuantity}
                      keyboardType="numeric"
                      placeholder="1"
                    />
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalActionButton, styles.addToCartButton]}
                      onPress={() => handleAddToCart(modalItem)}
                    >
                      <Ionicons name="cart-outline" size={20} color="#fff" />
                      <Text style={styles.modalActionButtonText}>Add to Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalActionButton, styles.orderButton]}
                      onPress={() => handleOrder(modalItem)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                      <Text style={styles.modalActionButtonText}>Order Now</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalActionButton, styles.contactButton]}
                      onPress={() => {
                        setShowModal(false);
                        handleContactSeller(modalItem);
                      }}
                    >
                      <Ionicons name="chatbubble-outline" size={20} color="#392867" />
                      <Text style={[styles.modalActionButtonText, { color: '#392867' }]}>Contact Seller</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F8F8FA' 
  },
  container: { 
    flex: 1, 
    padding: 16 
  },
  heading: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#392867', 
    marginBottom: 16 
  },
  filters: { 
    marginBottom: 20,
  },
  filterRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  pickerWrapper: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    flex: 1, 
    marginRight: 8, 
    paddingHorizontal: 6, 
    paddingVertical: Platform.OS === 'ios' ? 6 : 0,
    color: '#fff',
  },
  filterLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#555', 
    marginBottom: 2,
  },
  picker: { 
    height: 70 
  },
  priceWrapper: { 
    marginTop: 5 
  },
  priceInputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    paddingVertical: Platform.OS === 'ios' ? 10 : 6 
  },
  priceInput: { 
    marginLeft: 6, 
    flex: 1, fontSize: 14 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '48%',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: 'relative',
  },
  image: { 
    width: '100%', 
    height: 120, 
    borderRadius: 12 
  },
  typeBadge: { 
    position: 'absolute', 
    top: 8, 
    left: 8, 
    backgroundColor: '#392867', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 8 
  },
  typeText: { 
    color: '#fff', 
    fontSize: 10, 
    fontWeight: '700'
  },
  productName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#333', 
    marginTop: 8 
  },
  price: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#392867', 
    marginVertical: 4 
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  location: { 
    fontSize: 12, 
    color: '#777' 
  },
  addCartBtn: { 
    backgroundColor: '#392867', 
    padding: 6, 
    borderRadius: 8 
  },
  pagination: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10 
  },
  pageBtn: { 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    backgroundColor: '#392867', 
    borderRadius: 8, 
    marginHorizontal: 8 
  },
  pageBtnText: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  disabledBtn: { 
    backgroundColor: '#aaa' 
  },
  pageIndicator: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#392867' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '85%', 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20 
  },
  modalImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 16 
  },
  modalName: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#392867', 
    marginTop: 12 
  },
  modalPrice: { 
    fontSize: 18, 
    color: '#555', 
    marginVertical: 6 
  },
  modalLocation: { 
    fontSize: 14, 
    color: '#777',
    marginTop: 8,
  },
  modalQuantity: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  modalDelivery: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  modalStatus: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    marginBottom: 16,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  quantityInput: {
    marginVertical: 16,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  quantityInputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    gap: 12,
    marginTop: 8,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addToCartButton: {
    backgroundColor: '#392867',
  },
  orderButton: {
    backgroundColor: '#4CAF50',
  },
  contactButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#392867',
  },
  modalActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  closeBtn: { 
    marginTop: 20, 
    backgroundColor: '#392867',
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  closeText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600'
  },
});
