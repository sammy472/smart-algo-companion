import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const NotFoundPage = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Page Not Found</Text>
            <Text style={styles.subtitle}>Oops! The page you are looking for does not exist.</Text>
            <Button title="Go Back" onPress={() => router.replace("/authentication")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#e63946",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
        marginBottom: 20,
    },
});

export default NotFoundPage;
