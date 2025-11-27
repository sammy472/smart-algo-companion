import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const GlobalAppNotFound = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="dark" />
            <View style={styles.container}>
                <Text style={styles.text}>404 - Page Not Found</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default GlobalAppNotFound;