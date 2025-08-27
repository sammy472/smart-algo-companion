import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

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

export default function ProductCatalogue() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [page, setPage] = useState(1);

  const filteredProducts = allProducts.filter((product) => {
    const typeMatch = selectedType === 'All' || product.type === selectedType;
    const locationMatch = selectedLocation === 'All' || product.location === selectedLocation;
    const priceMatch = maxPrice === '' || product.price <= parseFloat(maxPrice);
    return typeMatch && locationMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleViewMore = (item) => {
    setModalItem(item);
    setShowModal(true);
  };

  return (
    <SafeAreaProvider>
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
          <FlatList
            data={paginatedProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => handleViewMore(item)}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)} / kg</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.location}>
                    <Ionicons name="location-outline" size={14} color="#777" /> {item.location}
                  </Text>
                  <TouchableOpacity style={styles.addCartBtn}>
                    <Ionicons name="cart-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />

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
                    <Image source={{ uri: modalItem.image }} style={styles.modalImage} />
                    <Text style={styles.modalName}>{modalItem.name}</Text>
                    <Text style={styles.modalPrice}>${modalItem.price.toFixed(2)} / kg</Text>
                    <Text style={styles.modalLocation}>Location: {modalItem.location}</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
    color: '#777' 
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
