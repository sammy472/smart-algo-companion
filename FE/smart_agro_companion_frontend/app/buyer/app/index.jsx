import React,{
  useState,
  useReducer,
  useEffect
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import placeHolderImage from './assets/cover.webp'; // Placeholder image for farms

// Sample data with Picsum images
const products = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    price: 3.5,
    image: { uri: 'https://picsum.photos/seed/tomatoes/400' },
  },
  {
    id: 2,
    name: 'Fresh Lettuce',
    price: 2.0,
    image: { uri: 'https://picsum.photos/seed/lettuce/400' },
  },
  {
    id: 3,
    name: 'Sweet Potatoes',
    price: 4.0,
    image: { uri: 'https://picsum.photos/seed/potatoes/400' },
  },
];

const recentOrders = [
  {
    id: 101,
    name: 'Organic Tomatoes',
    image: { uri: 'https://picsum.photos/seed/tomatoes/400' },
    price: '$3.50 / kg',
    quantity: '2 kg',
    date: 'Mar 27, 2025',
  },
];



const nearbyFarms = [
  {
    id: 1,
    name: 'Green Valley Farm',
    location: 'Accra, Ghana',
    farmer: 'Kojo Mensah',
  },
  {
    id: 2,
    name: 'Sunrise Harvest',
    location: 'Kumasi, Ghana',
    farmer: 'Ama Serwaa',
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState('buyer');
  return (
    loading ? (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1}}>
      <StatusBar style="light" />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        >
        <Text style={styles.welcomeText}>
          <Ionicons name="leaf-outline" size={26} color="#392867" /> Welcome Back 👋
        </Text>
        <View style={styles.switchWrapper}>
          <Text style={styles.switchText}>
            Switch to a Farmer?
          </Text>
          <Link href="/farmer/app" style={styles.link}>
              <MaterialIcons name="agriculture" size={30} color="white" /> 
          </Link>
        </View>
        <Text style={styles.subText}>Find fresh farm produce near you</Text>

        {/* Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="basket" size={20} color="#392867" />
            <Text style={styles.sectionTitle}>Farm Products</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image source={item.image} style={styles.image} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)} / kg</Text>
                <TouchableOpacity style={styles.cartButton}>
                  <Ionicons name="cart-outline" size={16} color="#fff" />
                  <Text style={styles.cartButtonText}> Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
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

        {/* Nearby Farms Section */}
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
      </SafeAreaView>
    </SafeAreaProvider>
  ) : (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="light" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#392867" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#392867' }}>Loading...</Text>
      </View>
    </SafeAreaProvider>)
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F6F6',
    padding: 16,
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#392867',
    marginBottom: 4,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight:'bold'
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#392867',
    fontFamily: 'Inter_600SemiBold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginRight: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: 160,
  },
  image: {
    height: 100,
    borderRadius: 1,
    marginBottom: 8,
    width: '100%',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,

  },
  price: {
    fontSize: 13,
    color: '#392867',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#392867',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 4,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 2,
    marginRight: 12,
  },
  orderMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontWeight: 'bold',
  },
  noOrdersText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  farmCard: {
    backgroundColor: '#fff',
    borderRadius: 1,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#392867',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  farmDetails: {
    fontSize: 13,
    color: '#666',
    fontWeight: 'bold',
  },
  farmerName: {
    fontSize: 13,
    color: '#392867',
    marginTop: 2,
    fontWeight: 'bold',
  },
  link:{
    flex: 1,
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 16,
    color: '#fff',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText:{ 
    fontSize: 18, 
    color: '#666', 
    fontWeight: 'bold', 
    marginRight: 8 
  },
  switchWrapper:{ 
    flex: 1, 
    backgroundColor: '#392867',
    flexDirection: 'column', 
    justifyContent: 'center', 
    marginBottom: 16,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  }
});
