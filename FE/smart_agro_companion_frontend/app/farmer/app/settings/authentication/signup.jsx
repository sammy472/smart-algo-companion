import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet,ScrollView } from "react-native";
import { useRouter,Stack } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const SignupPage = () => {
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

    return (
        <>
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
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Email" 
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Confirm Email" 
                        value={confirmEmail} 
                        onChangeText={setConfirmEmail} 
                        keyboardType="email-address" 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Telephone Number" 
                        value={telephone} 
                        onChangeText={setTelephone} 
                        keyboardType="phone-pad" 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Address" 
                        value={address} 
                        onChangeText={setAddress} 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="City" 
                        value={city} 
                        onChangeText={setCity} 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Country" 
                        value={country} 
                        onChangeText={setCountry} 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Password" 
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Confirm Password" 
                        value={confirmPassword} 
                        onChangeText={setConfirmPassword} 
                        secureTextEntry 
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
                    <TouchableOpacity style={styles.button} onPress={() => alert("Signing up...")}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>

                    {/* Already have an account? */}
                    <Text onPress={() => router.push("/farmer/app/settings/authentication/login")} style={styles.link}>
                        Already have an account? Login
                    </Text>
                </View>
            </ScrollView>
        </>
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
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: "#e0e0e0",
        fontSize: 16,
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

export default SignupPage;
