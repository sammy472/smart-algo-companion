import React from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatedSwipeRightHint } from "@/src/features/farmer/components/animated-swipe-right-indicator";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthenticationScreen = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={
            { 
                flex: 1, 
                backgroundColor: "#f5f5f5", 
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
            }
        }>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.container}>
                <AnimatedSwipeRightHint />
                <MaterialCommunityIcons
                    name="account-key"
                    size={50}
                    color="#392867"
                    style={{ marginBottom: 20 }}    
                />
                <Text style={styles.title}>Welcome to Authentication</Text>
                <Text style={styles.subtitle}>
                    Please choose an option below to continue.
                </Text>
            </View>
            <View style={styles.subContainer}>                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={
                        () => router.push("/farmer/settings/authentication/login")
                    }
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.signupButton]} 
                    onPress={
                        () => router.push("/farmer/settings/authentication/signup")
                    }
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <Text style={styles.subtitle}>
                    Forgotten your password?{" "}
                    <Text 
                        style={{ color: "#6C5CE7", fontWeight: "bold" }} 
                        onPress={
                            () => router.push("/farmer/app/settings/authentication/reset-password")
                        }
                    >
                        Reset it here   
                        </Text>
                </Text>
            </View>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 5,
    },
    subContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 5,
        borderColor: "#392867",
        borderWidth: 1,
        width: "95%",
        borderRadius: 4,
    },
    title: {
        fontSize:24, 
        marginVertical:10,
        padding:10,
        textAlign:'center',
        fontWeight:'bold',
        color:'#1D1041',
        backgroundColor:'#EDEDED',
        borderRadius:10,
    },
    button: {
        width: "80%",
        paddingVertical: 15,
        borderRadius: 4,
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
    subtitle: {
        fontSize: 14,
        color: "#555",
        marginTop: 10,
        textAlign: "center",
    },
});

export default AuthenticationScreen;
