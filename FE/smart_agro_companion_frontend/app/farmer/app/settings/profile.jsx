import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    Modal
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const ProfileSettings = () => {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "johndoe@example.com",
        telephone: "+123456789",
        address: "123 Main Street",
        city: "New York",
        country: "USA",
        password: "Newtonian472"
    });

    const [avatar, setAvatar] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const router = useRouter();

    const handleEditField = (field) => {
        setCurrentField(field);
        setTempValue(profile[field]);
        setModalVisible(true);
    };

    const saveField = () => {
        setProfile((prev) => ({ ...prev, [currentField]: tempValue }));
        setModalVisible(false);
        setCurrentField(null);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.title}>Profile Settings</Text>

                {/* Profile Avatar */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.editAvatarButton}>
                        <Image
                            source={avatar ? { uri: avatar } : require("./default-avatar.webp")}
                            style={styles.avatar}
                        />
                        <View style={{ position: 'absolute', top: '35%', left: '10%', opacity: 0.95 }}>
                            <MaterialCommunityIcons name="camera" size={32} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Profile Fields */}
                {Object.entries(profile).map(([field, value]) => (
                    <View key={field}>
                        <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}:</Text>
                        <TouchableOpacity onPress={() => handleEditField(field)} style={styles.textRow}>
                            <Text style={styles.fieldText}>
                                {field === "password" ? "*".repeat(value.length) : value}
                            </Text>
                            <MaterialCommunityIcons 
                                name="account-edit" size={24} 
                                color="#392867" 
                                style={{ position: 'absolute', top: '35%', right: '5%', opacity: 0.95 }}
                            />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Save Profile */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => Alert.alert("Profile Updated!")}
                >
                    <MaterialCommunityIcons name="content-save" size={24} color="white" />
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                {/* Logout & Delete Buttons */}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => {
                            router.push("/");
                            Alert.alert("Logged out!")
                        }}
                    >
                        <MaterialCommunityIcons name="logout" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => Alert.alert("Account Deleted!")}
                    >
                        <MaterialCommunityIcons name="delete-forever" size={24} color="white" />
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
            </View>
        </ScrollView>
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
});

export default ProfileSettings;
