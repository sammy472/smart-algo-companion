import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Dummy user info
const initialUser = {
  name: "Samuel Boateng",
  email: "samuel@example.com",
  phone: "+233 20 123 4567",
  avatar: "https://i.pravatar.cc/150?img=12",
};

export default function Settings() {
  const [user, setUser] = useState(initialUser);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const handlePickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri });
    }
  };

  const handleCheckUpdates = () => {
    Alert.alert("Check for Updates", "You’re already on the latest version.");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => console.log("User logged out") },
    ]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <Text style={styles.headerText}>Settings ⚙️</Text>

          {/* Profile Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.profileCard}>
              <TouchableOpacity onPress={handlePickAvatar}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={user.name}
                  onChangeText={(text) => setUser({ ...user, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  value={user.email}
                  onChangeText={(text) => setUser({ ...user, email: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  keyboardType="phone-pad"
                  value={user.phone}
                  onChangeText={(text) => setUser({ ...user, phone: text })}
                />
              </View>
            </View>
          </View>

          {/* System Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Preferences</Text>

            <View style={styles.settingRow}>
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={20}
                color="#392867"
              />
              <Text style={styles.settingText}>Dark Mode</Text>
              <Switch value={darkMode} onValueChange={setDarkMode} />
            </View>

            <View style={styles.settingRow}>
              <Ionicons name="language-outline" size={20} color="#392867" />
              <Text style={styles.settingText}>Language</Text>
              <TouchableOpacity
                style={styles.languageButton}
                onPress={() =>
                  setLanguage(language === "English" ? "French" : "English")
                }
              >
                <Text style={styles.languageText}>{language}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.settingRow}>
              <Ionicons name="notifications-outline" size={20} color="#392867" />
              <Text style={styles.settingText}>Notifications</Text>
              <Switch value={notifications} onValueChange={setNotifications} />
            </View>

            <View style={styles.settingRow}>
              <Ionicons name="eye-outline" size={20} color="#392867" />
              <Text style={styles.settingText}>Profile Visibility</Text>
              <Switch value={privacy} onValueChange={setPrivacy} />
            </View>

            <View style={styles.settingRow}>
              <Ionicons name="finger-print-outline" size={20} color="#392867" />
              <Text style={styles.settingText}>Biometric Login</Text>
              <Switch value={biometrics} onValueChange={setBiometrics} />
            </View>

            <TouchableOpacity
              style={[styles.settingRow, { justifyContent: "flex-start" }]}
              onPress={handleCheckUpdates}
            >
              <Ionicons name="cloud-download-outline" size={20} color="#392867" />
              <Text style={[styles.settingText, { marginLeft: 10 }]}>
                Check for Updates
              </Text>
            </TouchableOpacity>
          </View>

          {/* Save & Logout */}
          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F6F6F6",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#392867",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#392867",
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 16,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 12,
    backgroundColor: "#392867",
    borderRadius: 20,
    padding: 4,
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    justifyContent: "space-between",
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
  languageButton: {
    backgroundColor: "#392867",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  languageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#392867",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  logoutButton: {
    backgroundColor: "#E63946",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
});
