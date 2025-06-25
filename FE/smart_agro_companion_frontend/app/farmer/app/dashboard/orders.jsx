import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet 
} from 'react-native';

const OrdersPage = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.text}>This page will be implemented later.</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        color: '#555',
    },
});

export default OrdersPage;