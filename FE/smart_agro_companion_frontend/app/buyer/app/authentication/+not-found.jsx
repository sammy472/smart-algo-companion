import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function NotFoundAuth() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
      <MaterialIcons name="error-outline" size={80} color="red" />
      <Text style={{ fontSize: 22, color: 'red', fontWeight: '600', marginTop: 20 }}>Oops! Page not found</Text>
      <Text style={{ textAlign: 'center', color: '#555', marginTop: 10 }}>
        The authentication route you're looking for doesn't exist.
      </Text>
    </View>
  );
}