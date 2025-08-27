import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList, 
    Image, 
    ScrollView 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useApp } from '@/src/hooks/useApp';
import { LinearGradient } from 'expo-linear-gradient';

const sampleProducts = [
    { id: '1', name: 'Organic Tomatoes', price: '$10/kg', image: 'https://via.placeholder.com/100', rating: 4.5 },
    { id: '2', name: 'Fresh Corn', price: '$5/dozen', image: 'https://via.placeholder.com/100', rating: 4.8 },
    { id: '3', name: 'Organic Apples', price: '$8/kg', image: 'https://via.placeholder.com/100', rating: 4.2 },
    { id: '4', name: 'Green Peppers', price: '$6/kg', image: 'https://via.placeholder.com/100', rating: 4.6 },
    { id: '5', name: 'Organic Strawberries', price: '$12/kg', image: 'https://via.placeholder.com/100', rating: 4.4 },
];

const analyticsData = [
    { id: '1', label: 'Total Sales', value: '$3,500' },
    { id: '2', label: 'Orders This Month', value: '120' },
    { id: '3', label: 'Inventory Alerts', value: '2 Low Stock' },
    { id: '4', label: 'New Orders', value: '5' }
];

const FarmerHomeScreen = () => {
    const [products, setProducts] = useState(sampleProducts);
    const router = useRouter();
    const { user } = useApp();

    const handleEditProduct = (id) => console.log('Edit Product:', id);
    const handleDeleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <ScrollView contentContainerStyle={styles.content}>

                {/* Welcome Section */}
                <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.welcomeBox}>
                    <View>
                        <Text style={styles.welcomeText}>Hello, {user?.firstName || 'SAMUEL'}!</Text>
                        <Text style={styles.welcomeSub}>Here's your dashboard today</Text>
                    </View>
                    <MaterialIcons name="person" size={36} color="white" />
                </LinearGradient>

                {/* Analytics Section */}
                <View style={styles.analyticsContainer}>
                    {analyticsData.map(a => (
                        <View key={a.id} style={styles.analyticsCard}>
                            <Text style={styles.analyticsLabel}>{a.label}</Text>
                            <Text style={styles.analyticsValue}>{a.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Products Section */}
                <Text style={styles.sectionTitle}>Your Products</Text>
                <FlatList
                    data={products}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productPrice}>{item.price}</Text>
                            <View style={styles.productActions}>
                                <TouchableOpacity onPress={() => handleEditProduct(item.id)}>
                                    <MaterialIcons name="edit" size={20} color="#4caf50" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
                                    <MaterialIcons name="delete" size={20} color="#f44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                />

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={[styles.actionButton, {backgroundColor:'#ff6f61'}]}
                        onPress={() => router.push('farmer/app/dashboard/add-product')}
                    >
                        <MaterialIcons name="add-circle" size={28} color="white" />
                        <Text style={styles.actionText}>Add Product</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, {backgroundColor:'#4caf50'}]}>
                        <MaterialIcons name="shopping-cart" size={28} color="white" />
                        <Text style={styles.actionText}>View Orders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, {backgroundColor:'#1e88e5'}]}>
                        <MaterialIcons name="bar-chart" size={28} color="white" />
                        <Text style={styles.actionText}>Market Trends</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    content: { padding: 20 },

    welcomeBox: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20, 
        borderRadius: 20, 
        marginBottom: 20 
    },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    welcomeSub: { fontSize: 14, color: 'white', marginTop: 4 },

    analyticsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 20 
    },
    analyticsCard: { 
        flex: 1, 
        backgroundColor: 'white', 
        marginHorizontal: 5, 
        padding: 15, 
        borderRadius: 15, 
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    analyticsLabel: { fontSize: 14, color: '#777', textAlign: 'center' },
    analyticsValue: { fontSize: 18, fontWeight: '700', marginTop: 5, color: '#333' },

    sectionTitle: { fontSize: 18, fontWeight: '700', marginVertical: 15 },
    productCard: { 
        backgroundColor: 'white', 
        borderRadius: 20, 
        padding: 15, 
        marginRight: 15, 
        alignItems: 'center', 
        width: 140,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    productImage: { width: 100, height: 100, borderRadius: 12, marginBottom: 10 },
    productName: { fontWeight: '600', fontSize: 14, textAlign: 'center' },
    productPrice: { fontSize: 12, color: '#4caf50', marginBottom: 8 },
    productActions: { flexDirection: 'row', justifyContent: 'space-between', width: 60 },

    actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    actionButton: { 
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 20,
        paddingVertical: 15,
        alignItems: 'center'
    },
    actionText: { color: 'white', fontWeight: '700', marginTop: 5 }
});

export default FarmerHomeScreen;
