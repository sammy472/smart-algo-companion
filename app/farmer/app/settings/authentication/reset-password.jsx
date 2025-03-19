import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Stack } from "expo-router";

const ResetPasswordPage = () => {
    const [email, setEmail] = useState("");

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
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>

                <Text style={styles.subtitle}>
                    Enter your email to receive a password reset link.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#777"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete='false'
                />

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => alert("Password reset link sent!")}
                >
                    <Text style={styles.buttonText}>Send Reset Link</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#F5F5F7",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#392867",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: 14,
        borderRadius: 10,
        backgroundColor: "#EDEDED", // Light gray background
        fontSize: 16,
        color: "#333",
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#392867",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
    },
});

export default ResetPasswordPage;
