import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
    ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { AnimatedSwipeRightHint } from "@/src/features/farmer/components/animated-swipe-right-indicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/src/hooks/useApp";
import api from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadImageToSupabase, generateImagePath } from "@/src/services/supabase";

const ProfileSettingsScreen = () => {
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

    const [avatar, setAvatar] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");

    useEffect(() => {
        loadProfile();
    }, [user]);

    const handleEditField = (field) => {
        setCurrentField(field);
        setTempValue(profile[field]);
        setModalVisible(true);
    };

    const saveField = () => {
        setProfile((prev) => ({ ...prev, [currentField]: tempValue }));
        setModalVisible(false);
        setCurrentField(null);
        setTempValue("");
    };

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
            if (data.avatar) setAvatar(data.avatar);
        } catch (error) {
            console.error("Failed to load profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
            setProfile({ ...profile, avatar: result.assets[0].uri });
        }
    };

    const handleSave = async () => {
        if (!user?.id) return;
        
        setSaving(true);
        try {
            // Upload avatar to Supabase if it's a new local URI
            let avatarUrl = profile.avatar;
            if (avatar && avatar.startsWith('file://') || avatar.startsWith('content://')) {
                const avatarPath = generateImagePath('avatars', `farmer-${user.id}`, 'jpg');
                avatarUrl = await uploadImageToSupabase(avatar, 'avatars', avatarPath);
            } else if (avatar && !avatar.startsWith('http')) {
                // If avatar is already a URL, use it
                avatarUrl = avatar;
            }

            await api.updateProfile(user.id, userType, { ...profile, avatar: avatarUrl });
            Alert.alert("Success", "Profile updated successfully!");
            loadProfile(); // Reload to get updated data
        } catch (error) {
            console.error('Save profile error:', error);
            Alert.alert("Error", error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
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
                            router.replace("/farmer/settings/authentication/signup");
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to delete profile");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <AnimatedSwipeRightHint />
                <Text style={styles.title}>Profile Settings</Text>

                {/* Profile Avatar */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.editAvatarButton}>
                        <Image
                            source={avatar ? { uri: avatar } : require("@/src/features/farmer/assets/default-avatar.jpg")}
                            style={styles.avatar}
                        />
                        <View style={{ position: 'absolute', top: '35%', left: '10%', opacity: 0.95 }}>
                            <MaterialCommunityIcons name="camera" size={32} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Profile Fields */}
                <View>
                    <Text style={styles.label}>Full Name:</Text>
                    <TouchableOpacity onPress={() => handleEditField('name')} style={styles.textRow}>
                        <Text style={styles.fieldText}>{profile.name || 'Not set'}</Text>
                        <MaterialCommunityIcons 
                            name="account-edit" size={24} 
                            color="#392867" 
                            style={{ position: 'absolute', top: '35%', right: '5%', opacity: 0.95 }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.label}>Email:</Text>
                    <TouchableOpacity onPress={() => handleEditField('email')} style={styles.textRow}>
                        <Text style={styles.fieldText}>{profile.email || 'Not set'}</Text>
                        <MaterialCommunityIcons 
                            name="account-edit" size={24} 
                            color="#392867" 
                            style={{ position: 'absolute', top: '35%', right: '5%', opacity: 0.95 }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.label}>Phone:</Text>
                    <TouchableOpacity onPress={() => handleEditField('phone')} style={styles.textRow}>
                        <Text style={styles.fieldText}>{profile.phone || 'Not set'}</Text>
                        <MaterialCommunityIcons 
                            name="account-edit" size={24} 
                            color="#392867" 
                            style={{ position: 'absolute', top: '35%', right: '5%', opacity: 0.95 }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.label}>Address:</Text>
                    <TouchableOpacity onPress={() => handleEditField('address')} style={styles.textRow}>
                        <Text style={styles.fieldText}>{profile.address || 'Not set'}</Text>
                        <MaterialCommunityIcons 
                            name="account-edit" size={24} 
                            color="#392867" 
                            style={{ position: 'absolute', top: '35%', right: '5%', opacity: 0.95 }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.label}>City:</Text>
                    <TouchableOpacity onPress={() => handleEditField('city')} style={styles.textRow}>
                        <Text style={styles.fieldText}>{profile.city || 'Not set'}</Text>
                        <MaterialCommunityIcons 
                            name="account-edit" size={24} 
                            color="#392867" 
                            style={{ position: 'absolute', top: '35%', right: '5%', opacity: 0.95 }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={styles.label}>Country:</Text>
                    <TouchableOpacity onPress={() => handleEditField('country')} style={styles.textRow}>
                        <Text style={styles.fieldText}>{profile.country || 'Not set'}</Text>
                        <MaterialCommunityIcons 
                            name="account-edit" size={24} 
                            color="#392867" 
                            style={{ position: 'absolute', top: '35%', right: '5%', opacity: 0.95 }}
                        />
                    </TouchableOpacity>
                </View>

                {/* Save Profile */}
                <TouchableOpacity
                    style={[styles.saveButton, saving && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="content-save" size={24} color="white" />
                            <Text style={styles.buttonText}>Save</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Logout & Delete Buttons */}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={async () => {
                            await logout();
                            router.replace("/");
                        }}
                    >
                        <MaterialCommunityIcons name="logout" size={24} color="white" />
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => setDeleteModalVisible(true)}
                    >
                        <MaterialCommunityIcons name="delete-forever" size={24} color="white" />
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>

                {/* Edit Field Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>
                                Edit {currentField && currentField.charAt(0).toUpperCase() + currentField.slice(1)}
                            </Text>
                            <TextInput
                                style={styles.modalInput}
                                value={tempValue}
                                onChangeText={setTempValue}
                                secureTextEntry={currentField === "password"}
                            />
                            <View style={styles.modalActions}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={saveField} style={styles.modalSave}>
                                    <Text style={styles.modalButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Delete Profile Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={deleteModalVisible}
                    onRequestClose={() => setDeleteModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
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
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setDeleteModalVisible(false);
                                        setDeletePassword("");
                                    }}
                                    style={styles.modalCancel}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleDeleteProfile}
                                    style={styles.modalDelete}
                                >
                                    <Text style={styles.modalButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        marginVertical: 10,
        textAlign: "center",
        fontWeight: "bold",
        color: "#1D1041",
        backgroundColor: "#EDEDED",
        borderRadius: 10,
        padding: 10,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#392867",
    },
    editAvatarButton: {
        position: "relative",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    fieldText: {
        fontSize: 16,
        padding: 12,
        flex: 1,
        color: "#444",
        backgroundColor: "#fff",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    textRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
        borderWidth:0
    },
    saveButton: {
        backgroundColor: "#392867",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    logoutButton: {
        backgroundColor: "#555",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
        flex: 1,
        marginRight: 5,
    },
    deleteButton: {
        backgroundColor: "#d9534f",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
        flex: 1,
        marginLeft: 5,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "85%",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalCancel: {
        backgroundColor: "#aaa",
        padding: 10,
        borderRadius: 6,
        width: "48%",
        alignItems: "center",
    },
    modalSave: {
        backgroundColor: "#392867",
        padding: 10,
        borderRadius: 6,
        width: "48%",
        alignItems: "center",
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    modalSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
    },
    modalDelete: {
        backgroundColor: "#d9534f",
        padding: 10,
        borderRadius: 6,
        width: "48%",
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});

export default ProfileSettingsScreen;
