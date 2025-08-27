import { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet,
    Alert 
} from "react-native";
import { useRouter, Stack } from "expo-router";

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#777"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete='false'
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#777"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Logging in...")}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text 
                    onPress={() => router.push("/farmer/app/settings/authentication/reset-password")} 
                    style={styles.link}
                >
                    Forgot Password?
                </Text>
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
        fontSize:24, 
        marginVertical:10,
        padding:10,
        textAlign:'center',
        fontWeight:'bold',
        color:'#1D1041',
        backgroundColor:'#EDEDED',
        borderRadius:10,
    },
    input: {
        width: "100%",
        padding: 14,
        borderRadius: 10,
        backgroundColor: "#EDEDED", // Soft gray background
        marginBottom: 12,
        fontSize: 16,
        color: "#333",
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
    link: {
        marginTop: 15,
        color: "#392867",
        textAlign: "center",
        fontSize: 14,
        fontWeight: "600",
    },
});

export default LoginScreen;
