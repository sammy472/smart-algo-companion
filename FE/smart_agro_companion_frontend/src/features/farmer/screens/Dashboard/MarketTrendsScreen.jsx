import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const MarketTrendsScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="chart-line" size={64} color="#4F8EF7" />
            </View>
            <Text style={styles.title}>Market Trends</Text>
            <Text style={styles.subtitle}>
                This feature is coming soon!
            </Text>
            <Text style={styles.description}>
                Stay tuned for real-time market insights and trends tailored for you.
            </Text>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    iconContainer: {
        backgroundColor: '#E3ECFA',
        borderRadius: 50,
        padding: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#22223B',
        marginBottom: 8,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        color: '#4F8EF7',
        marginBottom: 12,
        fontWeight: '600',
    },
    description: {
        fontSize: 16,
        color: '#6C757D',
        textAlign: 'center',
        lineHeight: 22,
        marginHorizontal: 10,
    },
});

export default MarketTrendsScreen;