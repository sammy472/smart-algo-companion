import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const allProducts = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    price: 3.5,
    location: 'Accra',
    type: 'Vegetable',
    image: 'https://picsum.photos/seed/tomatoes/400',
  },
  {
    id: '2',
    name: 'Sweet Potatoes',
    price: 4.2,
    location: 'Kumasi',
    type: 'Root',
    image: 'https://picsum.photos/seed/potatoes/400',
  },
  {
    id: '3',
    name: 'Fresh Lettuce',
    price: 2.0,
    location: 'Cape Coast',
    type: 'Leafy',
    image: 'https://picsum.photos/seed/lettuce/400',
  },
  {
    id: '4',
    name: 'Green Peppers',
    price: 2.8,
    location: 'Tamale',
    type: 'Vegetable',
    image: 'https://picsum.photos/seed/peppers/400',
  },
  {
    id: '5',
    name: 'Mangoes',
    price: 3.0,
    location: 'Takoradi',
    type: 'Fruit',
    image: 'https://picsum.photos/seed/mangoes/400',
  },
];

const types = ['All', 'Fruit', 'Vegetable', 'Leafy', 'Root'];
const locations = ['All', 'Accra', 'Kumasi', 'Cape Coast', 'Tamale', 'Takoradi'];

export default function ProductCatalogue() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProducts = allProducts.filter((product) => {
    const typeMatch = selectedType === 'All' || product.type === selectedType;
    const locationMatch =
      selectedLocation === 'All' || product.location === selectedLocation;
    const priceMatch =
      maxPrice === '' || product.price <= parseFloat(maxPrice);
    return typeMatch && locationMatch && priceMatch;
  });

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#F6F6F6" />
    <View 
      style={styles.container}
    >
      <Text style={styles.heading}>Product Catalogue</Text>

      {/* Filters */}
      <View style={styles.filters}>
        <Text style={styles.label}>Filter by Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedType}
            onValueChange={(value) => setSelectedType(value)}
            style={styles.picker}
          >
            {types.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Filter by Location</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(value) => setSelectedLocation(value)}
            style={styles.picker}
          >
            {locations.map((loc) => (
              <Picker.Item key={loc} label={loc} value={loc} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Max Price ($)</Text>
        <View style={styles.priceInputContainer}>
          <Ionicons name="pricetag" size={16} color="#555" />
          <TextInput
            placeholder="e.g. 3.50"
            keyboardType="numeric"
            style={styles.priceInput}
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
      </View>

      {/* Products */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)} / kg</Text>
            <Text style={styles.location}>
              <Ionicons name="location" size={14} color="#777" /> {item.location}
            </Text>
            <TouchableOpacity style={styles.cartBtn}>
              <Ionicons name="cart" size={16} color="#fff" />
              <Text style={styles.cartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#392867',
  },
  filters: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#eee',
    borderRadius: 1,
    marginVertical: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 1,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    marginTop: 6,
    width: '50%',
  },
  priceInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 1,
    width: '48%',
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 110,
    borderRadius: 2,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  price: {
    fontSize: 13,
    color: '#392867',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#392867',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 2,
    justifyContent: 'center',
  },
  cartText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 13,
  },
});
