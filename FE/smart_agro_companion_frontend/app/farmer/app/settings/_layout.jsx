import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

const SettingsLayout = () => {
    return (
        <GestureHandlerRootView>
            <Drawer
                screenOptions={{
                    headerShown: false,
                    swipeEnabled: true,
                    gestureEnabled: true,
                    drawerType: 'front',
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
                        borderRadius: 1,
                        marginVertical: 2,
                        marginHorizontal: 5,
                        padding: 5,
                        textAlign: 'center',
                    },
                }}
                initialRouteName="profile"
            >
                <Drawer.Screen 
                    name="profile" 
                    options={{ 
                        title: "Profile",
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="person-circle-outline" size={30} color={'white'} />
                        ),
                    }} 
                />

                <Drawer.Screen 
                    name="system-settings" 
                    options={{ 
                        title: "System Settings",
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="settings-outline" size={30} color={'white'} />
                        ),
                    }} 
                />

                <Drawer.Screen 
                    name="authentication"  
                    options={{ 
                        title: "Authentication", 
                        drawerIcon: ({ size, color }) => (
                            <Ionicons name="key-outline" size={30} color={'white'} />
                        ),
                    }} 
                />
            </Drawer>
        </GestureHandlerRootView>
    );
};

export default SettingsLayout;
