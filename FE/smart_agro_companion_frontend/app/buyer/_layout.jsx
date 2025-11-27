import React from 'react';
import { 
  View, 
  Image,
  StyleSheet,
} from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

//Importing images/logo
import Logo from "@/src/features/buyer/assets/bc2.webp";

export default function Layout() {
  return (
    <>
      <StatusBar style="light"/>
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
          name="authentication"
          options={{
            title: 'Authentication',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'log-in' : 'log-in-outline'} // Updated to log-in icon
                size={focused ? size + 2 : size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'stats-chart' : 'stats-chart-outline'} // Updated to stats-chart icon
                size={focused ? size + 2 : size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'} // Kept as is since it's suitable
                size={focused ? size + 2 : size}
                color={color}
              />
            ),
            headerTitle:'Smart Agro Companion',
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
          }}
        />
        <Tabs.Screen
          name="marketplace"
          options={{
            title: 'Market Place',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'cart' : 'cart-outline'} // Updated to cart icon
                size={focused ? size + 2 : size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'} // Updated to settings icon
                size={focused ? size + 2 : size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
},
    image: {
      width: 30,
      height: 30,
      borderRadius: 10,
      margin:5
  },
});