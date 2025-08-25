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
                initialRouteName="order-summary"
            >
                <Drawer.Screen 
                    name="order-summary"  
                    options={{
                        title: "Order Summary", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="document-text-outline" size={30} color={'white'} />
                        ),
                    }} 
                />  
                <Drawer.Screen 
                    name="farm-explorer"  
                    options={{
                        title: "Explore Farms", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="leaf-outline" size={30} color={'white'} />
                        ),
                    }} 
                />    
                <Drawer.Screen 
                    name="cart-section"  
                    options={{
                        title: "Cart", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="cart" size={30} color="white" />
                        ),
                    }} 
                />    
                <Drawer.Screen 
                    name="favorite-farms"  
                    options={{
                        title: "Favorite Farms", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="bookmark-outline" size={30} color={'white'} />
                        ),
                    }} 
                />
                <Drawer.Screen 
                    name="notifications"  
                    options={{
                        title: "Favorite Farms", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="bookmark-outline" size={30} color={'white'} />
                        ),
                    }} 
                />
            </Drawer>
        </GestureHandlerRootView>
    );
};

export default DashboardLayout;
