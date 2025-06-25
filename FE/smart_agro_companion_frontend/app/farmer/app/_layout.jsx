import React,{useState} from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { 
    Appearance,
    Text,
    View,
    Platform, 
    TextInput,
    StyleSheet,
    Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';

//Importing images/logo
import Logo from "./assets/bc2.webp";

const Layout = () => {
    const colorScheme = Appearance.getColorScheme();

    return (
        <SafeAreaProvider>
            <StatusBar style="dark"/>
            <Tabs
                initialRouteName="index"
                screenOptions={
                    {
                        headerTitleAlign: "center",
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: "#1D1041",
                            shadowColor: "transparent",
                            elevation: 0,
                        },
                        headerTitleStyle: {
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "white",
                        },
                        tabBarPosition: 'bottom',
                        tabBarStyle: {
                            backgroundColor: "#1D1041",
                            height: 50,
                            borderTopWidth: 0,
                            shadowColor: "transparent",
                            padding:10
                        },
                        tabBarActiveTintColor: "white",
                        tabBarInactiveTintColor: "gray",
                        tabBarActiveBackgroundColor: "#392867",
                        tabBarInactiveBackgroundColor: "#1D1041",
                        
                    }
                }
            >
                <Tabs.Screen 
                    name="learning-hub"
                    options={
                        {
                            title: "Learning Hub",
                            tabBarIcon: ({focused,color,size}) => (
                                <MaterialCommunityIcons 
                                    name={focused ? "book-open-variant" : "book-open-page-variant-outline"}
                                    size={focused ? size + 2 : size} 
                                    color={color}
                                />
                            ),
                        }
                    }
                />
                <Tabs.Screen 
                    name="dashboard"
                    options={
                        {
                            title: "Admin Dashboard",
                            tabBarIcon: ({focused,color,size}) => (
                                <MaterialCommunityIcons
                                    name={focused ? "view-dashboard" : "view-dashboard-outline"} 
                                    size={focused ? size + 2 : size} 
                                    color={color}
                                />
                            ),
                        }
                    }
                />
                <Tabs.Screen 
                    name="index"
                    options={
                        {
                            title: "",
                            tabBarIcon: ({focused,color,size}) => (
                                <Ionicons 
                                    name={focused ? "home" : "home-outline"} 
                                    size={focused ? size + 2 : size} 
                                    color={color}
                                />
                            ),
                            headerTitle:'Smart Algo Companion',
                            headerTitleStyle: {
                                fontWeight: "bold",
                                fontSize: 20,
                                color: "white",
                                fontFamily: "sans-serif",
                            },
                            headerLeft: () => (
                                <View style={styles.container}>
                                    <Image source={Logo} style={styles.image}/>
                                </View>
                            ),                          
                        }
                    }
                />
                <Tabs.Screen 
                    name="iot-device-management"
                    options={
                        {
                            title: "Device Management",
                            tabBarIcon: ({focused,color,size}) => (
                                <MaterialCommunityIcons 
                                    name={focused ? "devices" : "devices"} 
                                    size={focused ? size + 2 : size} 
                                    color={color}
                                />
                            ),
                        }
                    }
                />
                <Tabs.Screen 
                    name="settings"
                    options={
                        {
                            title: "Profile & Parameters",
                            tabBarIcon: ({focused,color,size}) => (
                            <Ionicons 
                                name={focused ? "settings" : "settings-outline"} 
                                size={focused ? size + 2 : size} 
                                color={color}
                            />
                        ),
                        }
                    }
                />
            </Tabs>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    flex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 10,
        margin:5
    },
});

export default Layout;