// File: buyer/app/settings/system-settings.jsx
import React from 'react';
import { View, Text, Switch } from 'react-native';

export default function SystemSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>System Settings</Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#ccc', true: '#4caf50' }}
          thumbColor={notificationsEnabled ? '#2e7d32' : '#f1f1f1'}
        />
      </View>

      <View>
        <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#ccc', true: '#1976d2' }}
          thumbColor={darkMode ? '#0d47a1' : '#f1f1f1'}
        />
      </View>
    </View>
  );
}