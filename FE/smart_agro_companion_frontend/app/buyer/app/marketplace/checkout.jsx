// File: buyer/app/marketplace/checkout.jsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    ScrollView,
    Alert 
} from 'react-native';

export default function CheckoutScreen() {
  return (
    <>
    <StatusBar style="light" />
    <ScrollView 
        contentContainerStyle={{ 
            padding: 20, 
            backgroundColor: '#f9f9f9' 
        }}
        keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>Checkout</Text>

      <Text style={{ marginBottom: 6 }}>Full Name</Text>
      <TextInput style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 }} placeholder="John Doe" />

      <Text style={{ marginBottom: 6 }}>Address</Text>
      <TextInput style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 }} placeholder="123 Street Name" />

      <Text style={{ marginBottom: 6 }}>Payment Method</Text>
      <TextInput style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 25 }} placeholder="e.g. Mobile Money, Visa..." />

      <Button title="Confirm Order" color="#2e7d32" onPress={() => Alert.alert('Order confirmed!')} />
    </ScrollView>
    </>
  );
}