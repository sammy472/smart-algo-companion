import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function Notifications() {
  // ✅ Notifications stored in an array
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Push Notifications", enabled: true, icon: "notifications-outline" },
    { id: 2, title: "Email Notifications", enabled: false, icon: "mail-outline" },
    { id: 3, title: "SMS Notifications", enabled: false, icon: "chatbox-ellipses-outline" },
    { id: 4, title: "Reminders", enabled: true, icon: "alarm-outline" },
    { id: 5, title: "App Updates", enabled: true, icon: "cloud-download-outline" },
  ]);

  const handleToggle = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSave = () => {
    const enabled = notifications.filter((n) => n.enabled).map((n) => n.title);
    Alert.alert("Preferences Saved ✅", `Enabled: ${enabled.join(", ") || "None"}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.headerText}>Notifications 🔔</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manage Notifications</Text>

            {/* ✅ Render all notifications dynamically */}
            {notifications.map((item) => (
              <View key={item.id} style={styles.settingRow}>
                <Ionicons name={item.icon as any} size={20} color="#392867" />
                <Text style={styles.settingText}>{item.title}</Text>
                <Switch
                  value={item.enabled}
                  onValueChange={() => handleToggle(item.id)}
                />
              </View>
            ))}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#392867",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#392867",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  settingText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "500",
    color: "#392867",
  },
  saveButton: {
    backgroundColor: "#392867",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});
