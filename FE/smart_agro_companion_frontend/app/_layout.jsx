import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider,SafeAreaView } from "react-native-safe-area-context";
import { AppProvider } from "./context/app-context";


const Layout = () => {
    return (
        <AppProvider>
            <StatusBar barStyle="dark-content" />
            <Stack
                screenOptions={
                    {
                        headerTitleAlign: "center",
                        headerBackButtonDisplayMode: 'generic',
                        headerShown: false,
                        headerStyle: {
                            backgroundColor: "#1D1041",
                            shadowColor: "transparent",
                            elevation: 0,
                        },
                        headerTitleStyle: {
                            fontWeight: "bold",
                            fontSize: 20,
                        },
                    }
                }
                initialRouteName="index"
            >
                <Stack.Screen 
                    name="index"
                    options={
                        {
                            title: "Farmer",
                        }
                    }
                />
                <Stack.Screen 
                    name="farmer/app"
                    options={
                        {
                            title: "Farmer",
                        }
                    }
                />
                <Stack.Screen 
                    name="buyer/app"
                    options={
                        {
                            title: "Buyer",
                        }
                    }
                />
                <Stack.Screen 
                    name="+not-found"
                    options={
                        {
                            title: "404 - Page Not Found",
                            headerShown: true,
                            headerTitleAlign: "center",
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
                        }
                    }
                />
            </Stack>
        </AppProvider>
    );
}

export default Layout;