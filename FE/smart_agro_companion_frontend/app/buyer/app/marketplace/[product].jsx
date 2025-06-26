// File: buyer/app/marketplace/[product].jsx
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  Button, 
  ScrollView,
  Alert
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ProductDetails() {
  const { product } = useLocalSearchParams();

  return (
    <>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#fff' }}>
        <Image source={{ uri: 'https://via.placeholder.com/300' }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 20 }} />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{product || 'Product Name'}</Text>
        <Text style={{ color: '#777', marginBottom: 20 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
        </Text>
        <Button title="Add to Cart" color="#2e7d32" onPress={() => Alert.alert('Added to cart!')} />
      </ScrollView>
    </>
  );
}