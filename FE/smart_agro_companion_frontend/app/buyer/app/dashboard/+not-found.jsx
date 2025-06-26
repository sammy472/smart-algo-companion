// File: buyer/app/dashboard/+not-found.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function DashboardNotFound() {
  return (
    <>
      <StatusBar style="dark" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
        <Entypo name="warning" size={70} color="orange" />
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20, color: 'orange' }}>Dashboard Not Found</Text>
        <Text style={{ textAlign: 'center', color: '#777', marginTop: 8 }}>We couldn't find the dashboard page you're looking for.</Text>
      </View>
    </>
  );
}