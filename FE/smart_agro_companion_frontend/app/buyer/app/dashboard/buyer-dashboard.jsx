// File: buyer/app/dashboard/buyer-dashboard.jsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function BuyerDashboard() {
  return (
    <>
      <StatusBar style="light"/>
      <ScrollView 
          style={{ 
              flex: 1, 
              backgroundColor: '#f2f2f2' 
          }} 
          contentContainerStyle={{ padding: 20 }}
      >
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#2e7d32', marginBottom: 20 }}>Buyer Dashboard</Text>

        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="cart" size={24} color="#666" />
            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: '600' }}>Recent Orders</Text>
          </View>
          <Text style={{ color: '#999' }}>You haven’t placed any orders yet.</Text>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 3 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <FontAwesome5 name="user-circle" size={22} color="#666" />
            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: '600' }}>Account Status</Text>
          </View>
          <Text style={{ color: '#999' }}>Profile completion: 50%</Text>
        </View>
      </ScrollView>
    </>
  );
}