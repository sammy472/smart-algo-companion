// File: buyer/app/marketplace/+not-found.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function MarketplaceNotFound() {
  return (
    <>
      <StatusBar style="light" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
        <MaterialIcons name="search-off" size={70} color="#ff6f00" />
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#ff6f00' }}>Marketplace Page Not Found</Text>
        <Text style={{ textAlign: 'center', color: '#777', marginTop: 8 }}>The product or page you’re looking for doesn’t exist.</Text>
      </View>
    </>
  );
}