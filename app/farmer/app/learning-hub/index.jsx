import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const HomePage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Smart Algo Companion</Text>
            <Button
                title="Get Started"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
});

export default HomePage;