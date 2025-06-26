// File: buyer/app/settings/+not-found.jsx
import React from 'react';
import { View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function SettingsNotFound() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
      <AntDesign name="frowno" size={60} color="#d32f2f" />
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#d32f2f' }}>Settings Page Not Found</Text>
      <Text style={{ textAlign: 'center', color: '#777', marginTop: 10 }}>The settings page you’re trying to access does not exist.</Text>
    </View>
  );
}