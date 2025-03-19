import { useState,useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView,Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProfileSettings = () => {
    const [name, setName] = useState("John Doe");
    const nameRef = useRef(null);
    const [email, setEmail] = useState("johndoe@example.com");
    const [telephone, setTelephone] = useState("+123456789");
    const [address, setAddress] = useState("123 Main Street");
    const [city, setCity] = useState("New York");
    const [country, setCountry] = useState("USA");
    const [password, setPassword] = useState('Newtonian472');
    const [avatar, setAvatar] = useState(null);
    const [editableFields, setEditableFields] = useState({
        name: false,
        email: false,
        telephone: false,
        address: false,
        city: false,
        country: false,
        password: false,
    });
    const [showPassword, setShowPassword] = useState(false);

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

    const handleEditField = (field) => {
        setEditableFields(prev => ({ ...prev, [field]: true }));
        switch (field) {
            case "name":
                nameRef.current.focus();
                break;
            case "email":
                break;
            case "telephone":
                break;
            case "address":
                break;
            case "city":
                break;
            case "country":
                break;
            case "password":
                break;
            default:
                break;
        }
    };

    const handleShowPassword = () => {  
        setShowPassword(showPassword=>!showPassword);
    }

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
                    </TouchableOpacity>
                    <View style={[{position:'relative',top:'-50%',zIndex:1,opacity:0.6,}]}>
                        <MaterialCommunityIcons name="camera" size={32} color="white" />
                    </View>
                </View>

                {/* Editable Fields */}
                <Text style={styles.label}>Full Name:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Full Name"
                        editable={editableFields.name}
                        onBlur={() => setEditableFields(prev => ({ ...prev, name: false }))}
                        ref={nameRef}
                    />
                    <TouchableOpacity onPress={() => handleEditField('name')} style={{ position: "absolute", right: 10 }}>
                        <MaterialIcons name="edit" size={24} color="#392867" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Email:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        editable={editableFields.email}
                        onBlur={() => setEditableFields(prev => ({ ...prev, email: false }))}
                    />
                    <TouchableOpacity onPress={() => handleEditField('email')} style={{ position: "absolute", right: 10 }}>
                        <MaterialIcons name="edit" size={24} color="#392867" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Telephone:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={telephone}
                        onChangeText={setTelephone}
                        placeholder="Telephone"
                        keyboardType="phone-pad"
                        editable={editableFields.telephone}
                        onBlur={() => setEditableFields(prev => ({ ...prev, telephone: false }))}
                    />
                    <TouchableOpacity onPress={() => handleEditField('telephone')} style={{ position: "absolute", right: 10 }}>
                        <MaterialIcons name="edit" size={24} color="#392867" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Address:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Address"
                        editable={editableFields.address}
                        onBlur={() => setEditableFields(prev => ({ ...prev, address: false }))}
                    />
                    <TouchableOpacity onPress={() => handleEditField('address')} style={{ position: "absolute", right: 10 }}>
                        <MaterialIcons name="edit" size={24} color="#392867" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>City:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={setCity}
                        placeholder="City"
                        editable={editableFields.city}
                        onBlur={() => setEditableFields(prev => ({ ...prev, city: false }))}
                    />
                    <TouchableOpacity onPress={() => handleEditField('city')} style={{ position: "absolute", right: 10}}>
                        <MaterialIcons name="edit" size={24} color="#392867" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Country:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={country}
                        onChangeText={(newValue)=>setCountry(newValue)}
                        placeholder="Country"
                        editable={editableFields.country}
                        onBlur={() => setEditableFields(prev => ({ ...prev, country: false }))}
                    />
                    <TouchableOpacity onPress={() => handleEditField('country')} style={{ position: "absolute", right: 10 }}>
                        <MaterialIcons name="edit" size={24} color="#392867" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Password:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="*********"
                        editable={editableFields.password}
                        secureTextEntry={showPassword ? false:true}
                        onBlur={() => setEditableFields(prev => ({ ...prev, password: false }))}
                    />
                    <TouchableOpacity onPress={handleShowPassword} style={{ position: "absolute", right: 10 }}>
                        <MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#392867" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEditField('password')} style={{ position: "absolute", right: 50 }}>
                        <MaterialIcons name="edit" size={24} color="#392867" />
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}

                <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={() => Alert.alert("Profile Updated!")}
                >
                    <MaterialCommunityIcons name="content-save" size={24} color="white" />
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity 
                        style={styles.logoutButton} 
                        onPress={() => Alert.alert("Logged out!")}
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
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
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
        marginTop: 10,
        backgroundColor: "#392867",
        padding: 5,
        borderRadius: '50%',
    },
    editAvatarText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    pickerContainer: {
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        marginBottom: 12,
    },
    picker: {
        height: 50,
        width: "100%",
    },
    changePasswordButton: {
        marginBottom: 20,
        padding: 12,
        backgroundColor: "#ffaa00",
        borderRadius: 10,
        alignItems: "center",
    },
    changePasswordText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
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
    },
    logoutButton: {
        backgroundColor: "#555",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    logoutText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#d9534f",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    deleteText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ProfileSettings;