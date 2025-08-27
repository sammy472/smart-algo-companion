import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

// Sample data
const products = [
  { 
    id: 1, 
    name: 'Organic Tomatoes', 
    price: 3.5, 
    image: { uri: 'https://picsum.photos/seed/tomatoes/400' } 
  },
  { 
    id: 2, 
    name: 'Fresh Lettuce', 
    price: 2.0, 
    image: { uri: 'https://picsum.photos/seed/lettuce/400' } 
  },
  { 
    id: 3, 
    name: 'Sweet Potatoes', 
    price: 4.0, 
    image: { uri: 'https://picsum.photos/seed/potatoes/400' } 
  },
  { 
    id: 4, 
    name: 'Cabbage', 
    price: 2.5, 
    image: { uri: 'https://picsum.photos/seed/cabbage/400' } 
  },
  { 
    id: 5, 
    name: 'Carrots', 
    price: 3.0, 
    image: { uri: 'https://picsum.photos/seed/carrots/400' } 
  },
  { 
    id: 6, 
    name: 'Peppers', 
    price: 5.0, 
    image: { uri: 'https://picsum.photos/seed/peppers/400' } 
  },
];

const recentOrders = [
  { 
    id: 101, 
    name: 'Organic Tomatoes', 
    image: { uri: 'https://picsum.photos/seed/tomatoes/400' }, 
    price: '$3.50 / kg', 
    quantity: '2 kg', date: 'Mar 27, 2025' 
  },
];

const nearbyFarms = [
  { 
    id: 1, 
    name: 'Green Valley Farm', 
    location: 'Accra, Ghana', 
    farmer: 'Kojo Mensah' 
  },
  { 
    id: 2,
    name: 'Sunrise Harvest', 
    location: 'Kumasi, Ghana', 
    farmer: 'Ama Serwaa' 
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState('buyer');

  // Pagination for products
  const itemsPerPage = 2;
  const [page, setPage] = useState(0);

  const paginatedProducts = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9FB' }}>
        <StatusBar style="auto" />
        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#392867" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <Text style={styles.welcomeText}>
              <Ionicons name="leaf-outline" size={26} color="#392867" /> Welcome Back 👋
            </Text>

            {/* Switch Mode */}
            <View style={styles.switchWrapper}>
              <Text style={styles.switchText}>Switch to a Farmer?</Text>
              <Link href="/farmer/app" style={styles.switchButton}>
                <MaterialIcons name="agriculture" size={20} color="white" />
                <Text style={styles.switchButtonText}> Switch</Text>
              </Link>
            </View>

            <Text style={styles.subText}>Find fresh farm produce near you</Text>

            {/* Products Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="basket" size={20} color="#392867" />
                <Text style={styles.sectionTitle}>Farm Products</Text>
              </View>
              <View style={styles.productGrid}>
                {paginatedProducts.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <Image source={item.image} style={styles.image} />
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.price}>${item.price.toFixed(2)} / kg</Text>
                    <TouchableOpacity style={styles.cartButton}>
                      <Ionicons name="cart-outline" size={16} color="#fff" />
                      <Text style={styles.cartButtonText}> Add</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Pagination */}
              <View style={styles.pagination}>
                <TouchableOpacity
                  disabled={page === 0}
                  onPress={() => setPage((prev) => prev - 1)}
                  style={[styles.pageBtn, page === 0 && styles.disabledBtn]}>
                  <Ionicons name="chevron-back" size={20} color="white" />
                </TouchableOpacity>
                <Text style={styles.pageIndicator}>{page + 1} / {Math.ceil(products.length / itemsPerPage)}</Text>
                <TouchableOpacity
                  disabled={(page + 1) * itemsPerPage >= products.length}
                  onPress={() => setPage((prev) => prev + 1)}
                  style={[styles.pageBtn, (page + 1) * itemsPerPage >= products.length && styles.disabledBtn]}>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Orders */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Orders</Text>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <View key={order.id} style={styles.orderCard}>
                    <Image source={order.image} style={styles.orderImage} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>{order.name}</Text>
                      <Text style={styles.price}>{order.price}</Text>
                      <Text style={styles.orderMeta}>Qty: {order.quantity} | {order.date}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noOrdersText}>You haven't made any orders yet.</Text>
              )}
            </View>

            {/* Nearby Farms */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="barn" size={20} color="#392867" />
                <Text style={styles.sectionTitle}>Nearby Farms</Text>
              </View>
              {nearbyFarms.map((farm) => (
                <View key={farm.id} style={styles.farmCard}>
                  <Text style={styles.farmName}>
                    <MaterialCommunityIcons name="tractor" size={16} color="#392867" /> {farm.name}
                  </Text>
                  <Text style={styles.farmDetails}>
                    <Ionicons name="location-outline" size={14} color="#666" /> {farm.location}
                  </Text>
                  <Text style={styles.farmerName}>
                    <Ionicons name="person-circle-outline" size={14} color="#392867" /> {farm.farmer}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16 
  },
  loaderWrapper: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 16, 
    fontSize: 16, 
    color: '#392867' 
  },
  welcomeText: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#392867', 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  subText: { 
    fontSize: 15, 
    color: '#444', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  section: { 
    marginBottom: 28 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 14 },
  sectionTitle: {
    fontSize: 18, 
    fontWeight: '700', 
    color: '#392867' 
  },
  switchWrapper: { 
    backgroundColor: '#392867', 
    padding: 14, 
    borderRadius: 10, 
    marginBottom: 18, 
    alignItems: 'center' 
  },
  switchText: { 
    fontSize: 16, 
    color: '#fff', 
    marginBottom: 6 
  },
  switchButton: { 
    flexDirection: 'row', 
    backgroundColor: 'green', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 20, 
    alignItems: 'center' 
  },
  switchButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  productGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginBottom: 16, 
    padding: 12, 
    width: '48%', 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowOffset: { 
      width: 0, 
      height: 3 }, 
      shadowRadius: 5 
  },
  image: { 
    height: 100, 
    borderRadius: 8, 
    marginBottom: 8, 
    width: '100%' 
  },
  productName: { 
    fontWeight: '600', 
    fontSize: 14, 
    marginBottom: 2 
  },
  price: { 
    fontSize: 13, 
    color: '#392867',
    marginBottom: 8, 
    fontWeight: 'bold' 
  },
  cartButton: { 
    backgroundColor: '#392867', 
    paddingVertical: 6, 
    paddingHorizontal: 8, 
    borderRadius: 6, 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start' 
  },
  cartButtonText: { 
    color: '#fff', 
    fontSize: 13, 
    marginLeft: 4 
  },
  pagination: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 8 
  },
  pageBtn: { 
    backgroundColor: '#392867', 
    padding: 8, 
    borderRadius: 20, 
    marginHorizontal: 10 
  },
  disabledBtn: { 
    opacity: 0.4 
  },
  pageIndicator: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#392867' 
  },

  orderCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 12, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4 
  },
  orderImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 6, 
    marginRight: 12 
  },
  orderMeta: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 4 
  },
  noOrdersText: { 
    fontSize: 14, 
    color: '#999', 
    fontStyle: 'italic', 
    textAlign: 'center', 
    marginTop: 10 
  },
  farmCard: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 14, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 4 
  },
  farmName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#392867', 
    marginBottom: 4 
  },
  farmDetails: { 
    fontSize: 13, 
    color: '#555', 
    marginBottom: 2 
  },
  farmerName: { 
    fontSize: 13, 
    color: '#392867', 
    fontWeight: '600' 
  },
});
