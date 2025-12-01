import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

const DashboardLayout = () => {
    return (
        <GestureHandlerRootView>
            <Drawer
                screenOptions={{
                    headerShown: false,
                    swipeEnabled: true,
                    gestureEnabled: true,
                    drawerType: 'slide',
                    drawerStyle: {
                        width: '85%',
                    },
                    drawerActiveTintColor: "#392867",
                    drawerInactiveTintColor: "#454545",
                    drawerActiveBackgroundColor: "#392867",
                    drawerInactiveBackgroundColor: "#454545",
                    drawerLabelStyle: {
                        fontSize: 16,
                        fontWeight: "bold",
                        color: 'white',
                    },
                    drawerItemStyle: {
                        borderRadius: 2,
                        marginVertical: 2,
                        marginHorizontal: 5,
                        padding: 5,
                        textAlign: 'center',
                    },
                }}
                initialRouteName="index"
            >
                <Drawer.Screen 
                    name="index" 
                    options={{ 
                        title: "Analytics",
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="analytics-outline" size={30} color={'white'} />
                        ),
                    }} 
                />

                <Drawer.Screen 
                    name="product-listing"  
                    options={{
                        title: "Product Listing", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="list-outline" size={30} color={'white'} />
                        ),
                    }} 
                />
                
                <Drawer.Screen 
                    name="add-product"  
                    options={{
                        title: "Add Product", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="add-circle-outline" size={30} color={'white'} />
                        ),
                    }} 
                />    
                <Drawer.Screen 
                    name="add-farms"  
                    options={{
                        title: "Add Farm", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="add-circle-outline" size={30} color={'white'} />
                        ),
                    }} 
                />    
                <Drawer.Screen 
                    name="orders"  
                    options={{
                        title: "Orders", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="mail-unread" size={30} color={'white'} />
                        ),
                    }} 
                />     
                <Drawer.Screen 
                    name="market-trends"  
                    options={{
                        title: "Market Trends", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="trending-up-outline" size={30} color={'white'} />
                        ),
                    }} 
                />
                <Drawer.Screen 
                    name="ai-detection"  
                    options={{
                        title: "AI Crop Detection", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="leaf-outline" size={30} color={'white'} />
                        ),
                    }} 
                />      
                <Drawer.Screen 
                    name="notifications"  
                    options={{
                        title: "Notifications", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="notifications-outline" size={30} color={'white'} />
                        ),
                    }} 
                />
            </Drawer>
        </GestureHandlerRootView>
    );
};

export default DashboardLayout;
