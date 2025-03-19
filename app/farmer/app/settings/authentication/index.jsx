import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, Stack } from "expo-router";

const AuthenticationPage = () => {
    const router = useRouter();

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.push("/farmer/app/settings/authentication/login")}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.signupButton]} 
                    onPress={() => router.push("/farmer/app/settings/authentication/signup")}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#333",
    },
    button: {
        width: "80%",
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: "#392867",
        alignItems: "center",
        marginBottom: 15,
        elevation: 5, // Shadow effect (Android)
        shadowColor: "#000", // Shadow effect (iOS)
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    signupButton: {
        backgroundColor: "#6C5CE7",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default AuthenticationPage;
