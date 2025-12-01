import React, { useState, useEffect } from "react";
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
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useApp } from "@/src/hooks/useApp";
import api from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadImageToSupabase, generateImagePath } from "@/src/services/supabase";

export default function SettingsScreen() {
  const { user, userType, logout } = useApp();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    avatar: null,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [biometrics, setBiometrics] = useState(false);


  useEffect(() => {
    loadProfile();
    loadSettings();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await api.getProfile(user.id, userType);
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        country: data.country || "",
        avatar: data.avatar || null,
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme");
      const lang = await AsyncStorage.getItem("language");
      const notif = await AsyncStorage.getItem("notifications");
      
      if (theme) setDarkMode(theme === "dark");
      if (lang) setLanguage(lang);
      if (notif !== null) setNotifications(notif === "true");
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handlePickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setProfile({ ...profile, avatar: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // Upload avatar to Supabase if it's a new local URI
      let avatarUrl = profile.avatar;
      if (profile.avatar && (profile.avatar.startsWith('file://') || profile.avatar.startsWith('content://'))) {
        const avatarPath = generateImagePath('avatars', `buyer-${user.id}`, 'jpg');
        avatarUrl = await uploadImageToSupabase(profile.avatar, 'avatars', avatarPath);
      } else if (profile.avatar && !profile.avatar.startsWith('http')) {
        // If avatar is already a URL, use it
        avatarUrl = profile.avatar;
      }

      await api.updateProfile(user.id, userType, { ...profile, avatar: avatarUrl });
      await AsyncStorage.setItem("theme", darkMode ? "dark" : "light");
      await AsyncStorage.setItem("language", language);
      await AsyncStorage.setItem("notifications", notifications.toString());
      Alert.alert("Success", "Profile and settings updated successfully!");
      loadSettings(); // Reload to get updated data
    } catch (error) {
      console.error('Save settings error:', error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
  };

  const handleDeleteProfile = async () => {
    if (!deletePassword) {
      Alert.alert("Error", "Please enter your password to confirm deletion");
      return;
    }

    try {
      await api.deleteProfile(user.id, userType, deletePassword);
      Alert.alert(
        "Profile Deleted",
        "Your profile has been deleted. Redirecting to signup...",
        [
          {
            text: "OK",
            onPress: async () => {
              await logout();
              router.replace("/buyer/authentication/signup");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete profile");
    }
  };

  const handleCheckUpdates = async () => {
    try {
      const response = await api.checkUpdates();
      Alert.alert("Updates", response.message || "No updates available");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to check for updates");
    }
  };

  return (
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
              <Image
                source={{
                  uri: profile.avatar || "https://via.placeholder.com/80",
                }}
                style={styles.avatar}
              />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="phone-pad"
                value={profile.phone}
                onChangeText={(text) => setProfile({ ...profile, phone: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={profile.address}
                onChangeText={(text) => setProfile({ ...profile, address: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={profile.city}
                onChangeText={(text) => setProfile({ ...profile, city: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={profile.country}
                onChangeText={(text) => setProfile({ ...profile, country: text })}
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
              onPress={() => {
                const newLang = language === "English" ? "French" : "English";
                setLanguage(newLang);
              }}
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

        {/* Delete Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setDeleteModalVisible(true)}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.deleteButtonText}>Delete Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Save & Logout */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Delete Profile Modal */}
        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Profile</Text>
              <Text style={styles.modalSubtitle}>
                This action cannot be undone. Please enter your password to confirm.
              </Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter password"
                secureTextEntry
                value={deletePassword}
                onChangeText={setDeletePassword}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => {
                    setDeleteModalVisible(false);
                    setDeletePassword("");
                  }}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteModalButton]}
                  onPress={handleDeleteProfile}
                >
                  <Text style={styles.deleteModalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  deleteButton: {
    backgroundColor: "#E63946",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelModalButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelModalButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  deleteModalButton: {
    backgroundColor: "#E63946",
  },
  deleteModalButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
