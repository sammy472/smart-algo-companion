// File: buyer/app/marketplace/cart.jsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
  View, 
  Text, 
  FlatList,
  Button,
  Alert 
} from 'react-native';

const mockCart = [
  { id: '1', name: 'Tomatoes', quantity: 2 },
  { id: '2', name: 'Carrots', quantity: 1 }
];

export default function CartScreen() {
  return (
    <>
      <StatusBar style='light' />
      <View style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Your Cart</Text>
        <FlatList
          data={mockCart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontSize: 18 }}>{item.name} x{item.quantity}</Text>
            </View>
          )}
        />
        <View style={{ marginTop: 30 }}>
          <Button title="Proceed to Checkout" color="#3366cc" onPress={() => Alert.alert('Proceeding to checkout')} />
        </View>
      </View>
    </>
  );
}