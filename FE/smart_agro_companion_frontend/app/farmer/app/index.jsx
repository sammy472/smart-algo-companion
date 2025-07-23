import React, { 
    useState, 
    useEffect,
    useReducer,
    createContext
} from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList, 
    Image, 
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Link, useRouter } from 'expo-router';
import { useApp } from '@/app/context/app-context';

//Create a context for managing global state
export const GlobalContext = createContext();

// Sample Data
const sampleProducts = [
    { 
        id: '1', 
        name: 'Organic Tomatoes', 
        price: '$10/kg', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.5 

    },
    { 
        id: '2', 
        name: 'Fresh Corn', 
        price: '$5/dozen', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.8 

    },
    { 
        id: '3', 
        name: 'Organic Apples', 
        price: '$8/kg', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.2
    },
    { 
        id: '4', 
        name: 'Green Peppers', 
        price: '$6/kg', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.6
    },
    { 
        id: '5', 
        name: 'Organic Strawberries', 
        price: '$12/kg', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.4 
    },
    { 
        id: '6', 
        name: 'Fresh Bananas', 
        price: '$3/dozen', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.7 
    },
    { 
        id: '7', 
        name: 'Organic Carrots', 
        price: '$7/kg', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.3 
    },
    { 
        id: '8', 
        name: 'Sweet Potatoes', 
        price: '$9/kg', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.5 
    },
    { 
        id: '9', 
        name: 'Fresh Oranges', 
        price: '$5/kg', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.6 
    },
    { 
        id: '10', 
        name: 'Organic Grapes', 
        price: '$15/kg', 
        image: 'https://via.placeholder.com/100', 
        rating: 4.4 
    },
];

const analyticsData = [
    { 
        id: '1', 
        label: 'Total Sales', 
        value: '$3,500'
    },
    { 
        id: '2', 
        label: 'Orders This Month', 
        value: '120' 
    },
    { 
        id: '3', 
        label: 'Inventory Alerts', 
        value: '2 Low Stock' 

    },
    { 
        id: '4', 
        label: 'New Orders',
        value: '5'
    }
];

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulating login state
    const [products, setProducts] = useState(sampleProducts);
    const router = useRouter();
    const {user,isAuthenticated,userType,login } = useApp();

    // Function to handle product actions
    const handleEditProduct = (id) => {
        console.log('Edit Product:', id);
    };

    const handleDeleteProduct = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };
    useEffect(() => {
        console.log('App State:', user, isAuthenticated, userType);
    }, []);

    return (
    <GlobalContext.Provider value={{ isLoggedIn}}>
        <SafeAreaProvider style={styles.container}>
            <StatusBar style="light" />
            {isLoggedIn ? (
                <ScrollView contentContainerStyle={styles.content}>
                    
                    {/* Welcome Section */}
                    <View style={styles.welcomeBox}>
                        <Text style={styles.welcomeText}>Welcome back, SAMUEL!</Text>
                        <MaterialIcons name="person" size={30} color="white" />
                    </View>
                    <View style={styles.switchWrapper}>
                        <Text style={styles.switchText}>
                            Switch to a Buyer?
                        </Text>
                        <Link href="/buyer/app" style={styles.link}>
                            <MaterialIcons name="sell" size={30} color="white" /> 
                        </Link>
                    </View>

                    {/* Analytics Section */}
                    <View style={styles.analyticsContainer}>
                        {analyticsData.map((item) => (
                            <View key={item.id} style={styles.analyticsCard}>
                                <Text style={styles.analyticsLabel}>{item.label}</Text>
                                <Text style={styles.analyticsValue}>{item.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Product Listings */}
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
                                        <MaterialIcons name="edit" size={20} color="blue" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
                                        <MaterialIcons name="delete" size={20} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />

                    {/* Quick Actions */}
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => {
                                router.push('farmer/app/dashboard/add-product')
                            }}
                        >
                            <MaterialIcons name="add-circle" size={30} color="white" />
                            <Text style={styles.actionText}>Add Product</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialIcons name="shopping-cart" size={30} color="white" />
                            <Text style={styles.actionText}>View Orders</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialIcons name="bar-chart" size={30} color="white" />
                            <Text style={styles.actionText}>Market Trends</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            ) : (
                // If user is not logged in
                <View style={styles.authContainer}>
                    <Text style={styles.authText}>Welcome to Smart Agro Companion</Text>
                    <TouchableOpacity 
                        style={styles.authButton}
                        onPress={() => {
                            router.push('/farmer/app/settings/authentication/login'); // Navigate to login page
                        }}
                        >
                        <Text style={styles.authButtonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.authButton}
                        onPress={() => {
                            router.push('/farmer/app/settings/authentication/signup'); // Navigate to signup page
                        }}
                    >
                        <Text style={styles.authButtonText}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaProvider>
    </GlobalContext.Provider>
    );
};

// Styles
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8f8f8' 
    },
    content: { 
        padding: 20, 
        alignItems: 'center' 
    },
    // Welcome Section
    welcomeBox: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: '#392867', 
        padding: 15, 
        borderRadius: 4, 
        width: '100%', 
        marginBottom: 20 
    },
    welcomeText: { 
        fontSize: 20, 
        color: 'white', 
        fontWeight: 'bold' 
    },
    // Analytics Section
    analyticsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        width: '100%', 
        marginBottom: 20 
    },
    analyticsCard: { 
        flex: 1,
        flexDirection: 'column',    
        backgroundColor: 'white', 
        padding: 15, 
        borderRadius: 10, 
        width: '30%', 
        alignItems: 'center', 
        elevation: 2,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        margin: 2,
    },
    analyticsLabel: { 
        fontSize: 14, 
        color: '#555',
        fontFamily: 'sans-serif'
    },
    analyticsValue: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333' 
    },
    // Product Listings
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        alignSelf: 'flex-start', 
        marginBottom: 10 
    },
    productCard: { 
        backgroundColor: 'white', 
        padding: 10, 
        borderRadius: 10, 
        marginRight: 10, 
        alignItems: 'center' 
    },
    productImage: { 
        width: 80, 
        height: 80, 
        borderRadius: 10, 
        marginBottom: 5 
    },
    productName: { 
        fontSize: 14, 
        fontWeight: 'bold' 
    },
    productPrice: { 
        fontSize: 12, 
        color: 'green' 
    },
    productActions: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: 60, 
        marginTop: 5 
    },
    // Quick Actions
    actionsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%', 
        marginTop: 10 
    },
    actionButton: { 
        backgroundColor: '#392867', 
        padding: 15, 
        borderRadius: 4, 
        alignItems: 'center', 
        width: '30%' 
    },
    actionText: { 
        color: 'white', 
        fontWeight: 'bold', 
        marginTop: 5 
    },

    // Auth Screen
    authContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    authText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 20 
    },
    authButton: { 
        padding: 15, 
        borderRadius: 4, 
        marginBottom: 10, 
        width: '80%', 
        alignItems: 'center',
        backgroundColor: "#392867",
        marginBottom: 15,
        elevation: 5, // Shadow effect (Android)
        shadowColor: "#000", // Shadow effect (iOS)
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3, 
    },
    authButtonText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    switchText:{ 
        fontSize: 18, 
        color: '#666', 
        fontWeight: 'bold', 
        marginRight: 8,
        fontStyle: 'italic',
        fontFamily: 'Poppins_600SemiBold'
    },
    switchWrapper:{ 
        flex: 1, 
        backgroundColor: '#392867',
        flexDirection: 'column', 
        justifyContent: 'center', 
        marginBottom: 16,
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        width: '100%',
    },
    link:{
        flex: 1,
        backgroundColor: 'green',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginTop: 16,
        color: '#fff',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
  },
});

export default HomePage;
