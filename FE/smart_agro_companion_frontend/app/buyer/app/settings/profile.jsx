// File: buyer/app/settings/profile.jsx
import React from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#f4f4f4' }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>Profile Settings</Text>

      <Text style={{ marginBottom: 6 }}>Full Name</Text>
      <TextInput placeholder="Jane Doe" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15 }} />

      <Text style={{ marginBottom: 6 }}>Email</Text>
      <TextInput placeholder="jane@example.com" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15 }} keyboardType="email-address" />

      <Text style={{ marginBottom: 6 }}>Phone</Text>
      <TextInput placeholder="+1234567890" style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 25 }} keyboardType="phone-pad" />

      <Button title="Save Changes" color="#1976d2" onPress={() => alert('Changes saved')} />
    </ScrollView>
  );
}