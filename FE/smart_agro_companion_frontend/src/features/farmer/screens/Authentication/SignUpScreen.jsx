import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,ScrollView, Alert } from "react-native";
import { useRouter,Stack } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/src/services/api";

const SignUpScreen = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [telephone, setTelephone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [userType, setUserType] = useState(""); // Farmer or Buyer
    const [gender, setGender] = useState(""); // Male or Female

    const [error, setError] = useState({
        name: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        telephone: "",
        address: "",
    });

    const validateFormEmail = (email, confirmEmail) => {
        if (!email || email !== confirmEmail) {
            setError({ ...error, email: "Email is required and must match" });
            return false;
        }
    
        return true;

    }

    const validateFormPassword = (password, confirmPassword) => {
        if (!password || password !== confirmPassword) {
            setError({ ...error, password: "Password is required and must match" });
            return false;
        }
        return true;
    }

    const handleSignup = async () => {
        const userData = {
            name: name,
            email: email === confirmEmail ? email : null,
            password: password === confirmPassword ? password : null,
            telephone: telephone,
            address: address,
            city: city,
            country: country,
            userType: userType,
            gender: gender,
        };

        if(validateFormEmail(userData.email, userData.confirmEmail)) {
            Alert.alert("Error", "Please fill in all fields and ensure emails match");
            return;
        }
        if(validateFormPassword(userData.password, userData.confirmPassword)) {
            Alert.alert("Error", "Please fill in all fields and ensure passwords match");
            return;
        }
        
        const response = await api.signup(userData);
        console.log(response);
        if (response.success) {
            router.push("/farmer/authentication/login");
        } else {
            Alert.alert("Error", response.message);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen 
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: "#fff",
                        height: 50,
                    },
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#392867",
                    },
                }} 
            />
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Sign Up</Text>

                    <TextInput 
                        style={[styles.input]} 
                        placeholder="Full Name" 
                        value={name} 
                        onChangeText={setName} 
                        placeholderTextColor="#777"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Email" 
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                        placeholderTextColor="#777"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Confirm Email" 
                        value={confirmEmail} 
                        onChangeText={setConfirmEmail} 
                        keyboardType="email-address" 
                        placeholderTextColor="#777"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Telephone Number" 
                        value={telephone} 
                        onChangeText={setTelephone} 
                        keyboardType="phone-pad" 
                        placeholderTextColor="#777"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Address" 
                        value={address} 
                        onChangeText={setAddress} 
                        placeholderTextColor="#777"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="City" 
                        value={city} 
                        onChangeText={setCity} 
                        placeholderTextColor="#777"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Country" 
                        value={country} 
                        onChangeText={setCountry} 
                        placeholderTextColor="#777"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Password" 
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry 
                        placeholderTextColor="#777"
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Confirm Password" 
                        value={confirmPassword} 
                        onChangeText={setConfirmPassword} 
                        secureTextEntry 
                        placeholderTextColor="#777"
                    />

                    {/* User Type Picker */}
                    <Text style={styles.label}>I am a:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={userType} onValueChange={(itemValue) => setUserType(itemValue)} style={styles.picker}>
                            <Picker.Item label="Select User Type" value="" />
                            <Picker.Item label="Farmer" value="Farmer" />
                            <Picker.Item label="Buyer" value="Buyer" />
                        </Picker>
                    </View>

                    {/* Gender Picker */}
                    <Text style={styles.label}>Gender:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker}>
                            <Picker.Item label="Select Gender" value="" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity style={styles.button} onPress={() => handleSignup()}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* Already have an account? */}
                    <Text onPress={() => router.push("/farmer/settings/authentication/login")} style={styles.link}>
                        Already have an account? Login
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    input: {
        width: "100%",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#e0e0e0",
        fontSize: 16,
        color: "#333"
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
    button: {
        backgroundColor: "#392867",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    link: {
        marginTop: 20,
        color: "#392867",
        textAlign: "center",
        fontSize: 16,
    },
});

export default SignUpScreen;
